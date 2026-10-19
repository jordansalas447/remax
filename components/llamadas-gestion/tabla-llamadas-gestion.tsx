"use client"

import * as React from "react"
import { Download, MessageSquarePlusIcon, PencilIcon } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { LlamadasRowDetalle, LlamadaType } from "@/lib/supabase/queries/llamadas"

import { columns } from "./columns"
import { DialogNuevaObservacion } from "./dialog-nueva-observacion"
import { SubcampoLlamada } from "./subcampo-llamada"
import { EstadoLlamadas } from "@/lib/supabase/queries/estado_llamada"

import * as XLSX from "xlsx";

interface TablaLlamadasGestionProps {
  Llamadas: LlamadasRowDetalle[]
  EstadoLlamadas: EstadoLlamadas[]
}

export default function TablaLlamadasGestion({
  Llamadas,
  EstadoLlamadas,
}: TablaLlamadasGestionProps) {
  const [data, setData] = React.useState<LlamadasRowDetalle[]>(Llamadas)
  const [llamadaSeleccionada, setLlamadaSeleccionada] =
    React.useState<LlamadasRowDetalle | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  // Sincronizar si cambian los datos del servidor (props)
  React.useEffect(() => {
    setData(Llamadas)
  }, [Llamadas])

  const handleObservacionGuardada = (id: number, record: LlamadaType) => {
    const estadoObj = EstadoLlamadas.find((e) => e.id === record.id_estado_llamada)

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              id_llamada: record.id ?? item.id_llamada,
              observacion: record.observacion || "",
              observacion_seguimiento: record.observacion_seguimiento || "",
              curso_llamada: record.curso_llamada || "",
              id_estado_llamada: record.id_estado_llamada || 0,
              estado_llamada: estadoObj?.estado_llamada || item.estado_llamada,
              color: estadoObj?.color || "default",
              fecha_bienvenida: record.fecha_bienvenida ?? item.fecha_bienvenida,
              fecha_seguimiento_llamada:
                record.fecha_seguimiento_llamada ?? item.fecha_seguimiento_llamada,
            }
          : item
      )
    )

    setLlamadaSeleccionada((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            id_llamada: record.id ?? prev.id_llamada,
            observacion: record.observacion || "",
            observacion_seguimiento: record.observacion_seguimiento || "",
            curso_llamada: record.curso_llamada || "",
            id_estado_llamada: record.id_estado_llamada || 0,
            estado_llamada: estadoObj?.estado_llamada || prev.estado_llamada,
            color: estadoObj?.color || "default",
            fecha_bienvenida: record.fecha_bienvenida ?? prev.fecha_bienvenida,
            fecha_seguimiento_llamada:
              record.fecha_seguimiento_llamada ?? prev.fecha_seguimiento_llamada,
          }
        : prev
    )
  }

    // Función para exportar los datos a Excel usando la librería XLSX
  function ExportarExcel(llamadas:LlamadasRowDetalle[]) {

  }

  const handleExport = () => {
      // Preparar los datos que aparecerán en Excel
      const datos = Llamadas.map((p:LlamadasRowDetalle) => ({
        "ID": p.id_remax,
        "AGENTE":p.asociado,
        "TIPO DE PROPIEDAD": p.tipo_propiedad,
        "DIRECCIÓN":p.direccion,
        "TIPO DE NEGOCIO":p.tipo_negocio,
        "MODALIDAD":p.modalidad,
        "PROPIETARIOS":p.propietario,
        "NUMERO TELEFONO":p.numero_telefono,
        "FECHA LLAMADA BIENVENIDA": p.fecha_bienvenida
          ? new Date(new Date(p.fecha_bienvenida).getTime() - 5 * 60 * 60 * 1000).toISOString().slice(0, 10)
          : "",
   
        "FECHA CONTRATO RECIBIDO": p.fecha_contrato_recibido,
        "ESTADO LLAMADA":p.estado_llamada,
        "CURSO DE LLAMADA":p.curso_llamada,
        "OBSERVACIONES":p.observacion,
        "FECHA LLAMADA DE SEGUIMIENTO":p.fecha_seguimiento_llamada,
        "OBSERVACION DE SEGUIMIENTO":p.observacion_seguimiento
      }));
  
      // Crear una hoja de Excel
      const hoja = XLSX.utils.json_to_sheet(datos);
  
      // Crear el libro
      const libro = XLSX.utils.book_new();
  
      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(libro, hoja, "llamadas");
  
      // Descargar el archivo
      XLSX.writeFile(libro, "llamadas.xlsx");
  };

  const handleAbrirDialogObservacion = (llamada: LlamadasRowDetalle) => {
    setLlamadaSeleccionada(llamada)
    setDialogOpen(true)
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-xs">
      <div className="mb-4 flex justify-end">
        <button
          className="flex items-center gap-2 rounded bg-emerald-500 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-600 transition-colors"
          // Aquí puedes definir el handler de exportación, por ahora solo un alert como placeholder
          onClick={() => handleExport()}
        >
          {/* Icono download, puedes cambiar por cualquiera de lucide-react o FontAwesome */}
          <Download/>
          <span>Exportar</span>
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="id_remax"
        searchPlaceholder="Filtrar n° id_remax..."
        // 1. Anclado de columnas determinadas (permite anclar/desanclar desde el encabezado)
        enableColumnPinning={true}
        initialColumnPinning={{
          start: ["id_remax"],
        }}
        // 2. Botón "+ Observación" / "Editar gestión" en la columna de acciones de la tabla
        rowActionsHeader="Acciones"
        rowActionsSize={140}
        pinRowActions={true}
        rowActions={(row) => {
          const tieneObservacion = Boolean(
            row.original.id_llamada ||
            row.original.curso_llamada?.trim() ||
            row.original.observacion?.trim() ||
            row.original.observacion_seguimiento?.trim() ||
            row.original.estado_llamada
          )

          return (
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => handleAbrirDialogObservacion(row.original)}
              className={
                tieneObservacion
                  ? "gap-1 border-primary/40 text-primary hover:bg-primary/10"
                  : "gap-1 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              }
            >
              {tieneObservacion ? (
                <>
                  <PencilIcon className="size-3.5" />
                  <span>Editar gestión</span>
                </>
              ) : (
                <>
                  <MessageSquarePlusIcon className="size-3.5" />
                  <span>Observación</span>
                </>
              )}
            </Button>
          )
        }}
        // 3. Sub campo inmediatamente después del registro
        renderSubRow={(row) => (
          <SubcampoLlamada
            llamada={row.original}
            onObservacionGuardada={handleObservacionGuardada}
            onEditar={handleAbrirDialogObservacion}
          />
        )}
      />

      {/* Modal para agregar o editar observación */}
      <DialogNuevaObservacion
        llamada={llamadaSeleccionada}
        estadollamadas={EstadoLlamadas}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onObservacionGuardada={handleObservacionGuardada}
      />
    </div>
  )
}

