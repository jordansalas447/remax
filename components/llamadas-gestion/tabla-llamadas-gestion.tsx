"use client"

import * as React from "react"
import { MessageSquarePlusIcon, PencilIcon } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { LlamadasRowDetalle, LlamadaType } from "@/lib/supabase/queries/llamadas"

import { columns } from "./columns"
import { DialogNuevaObservacion } from "./dialog-nueva-observacion"
import { SubcampoLlamada } from "./subcampo-llamada"
import { EstadoLlamadas } from "@/lib/supabase/queries/estado_llamada"

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

  const handleAbrirDialogObservacion = (llamada: LlamadasRowDetalle) => {
    setLlamadaSeleccionada(llamada)
    setDialogOpen(true)
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-xs">
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

