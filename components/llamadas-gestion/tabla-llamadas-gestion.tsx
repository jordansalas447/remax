"use client"

import * as React from "react"
import { MessageSquarePlusIcon } from "lucide-react"

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
  EstadoLlamadas
}: TablaLlamadasGestionProps) {
  const [data, setData] = React.useState<LlamadasRowDetalle[]>(Llamadas)
  const [llamadaSeleccionada, setLlamadaSeleccionada] =
    React.useState<LlamadasRowDetalle | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  // Sincronizar si cambian los datos del servidor (props)
  React.useEffect(() => {
    setData(Llamadas)
  }, [Llamadas])

  const handleObservacionGuardada = (
    id: number,
    record: LlamadaType
  ) => {

    console.log(id,record)

    console.log(data)

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, 
            observacion: record.observacion || "",
            observacion_seguimiento:record.observacion_seguimiento || "",
            curso_llamada:record.curso_llamada || "",
            id_estado_llamada:record.id_estado_llamada || 0,
            estado_llamada:EstadoLlamadas.find(id => id.id === record.id_estado_llamada)?.estado_llamada,
            color:EstadoLlamadas.find(id => id.id === record.id_estado_llamada)?.color || "default"
          }
          : item
      )
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
        // 2. Botón "+ Observación" en la columna de acciones de la tabla
        rowActionsHeader="Acciones"
        rowActionsSize={140}
        pinRowActions={true}
        rowActions={(row) => (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => handleAbrirDialogObservacion(row.original)}
            className="gap-1 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <MessageSquarePlusIcon className="size-3.5" />
            <span>Observación</span>
          </Button>
        )}
        // 3. Sub campo inmediatamente después del registro
        renderSubRow={(row) => (
          <SubcampoLlamada
            llamada={row.original}
            onObservacionGuardada={handleObservacionGuardada}
          />
        )}
      />

      {/* Modal para agregar observación */}
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
