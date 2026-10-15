"use client"

import * as React from "react"
import { Loader2Icon, MessageSquarePlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  LlamadaType,
  type LlamadasRow,
  type LlamadasRowDetalle,
  insertarLlamada,
} from "@/lib/supabase/queries/llamadas"

type DialogNuevaObservacionProps = {
  llamada: LlamadaType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onObservacionGuardada?: (idLlamada: number, observacionActualizada: string) => void
}

// Helper para formatear fechas a ISO 8601 UTC explícito (con "Z")
function toUtcIsoString(date: Date | null): string | null {
  if (!date) return null
  return date.toISOString() // El toISOString() ya produce un string UTC 0 con 'Z'
}

export function DialogNuevaObservacion({
  llamada,
  open,
  onOpenChange,
  onObservacionGuardada,
}: DialogNuevaObservacionProps) {
  // Campos del formulario
  const [cursoLlamada, setCursoLlamada] = React.useState("")
  const [observacion, setObservacion] = React.useState("")
  const [observacionSeguimiento, setObservacionSeguimiento] = React.useState("")
  const [idSeguimiento, setIdSeguimiento] = React.useState("")
  const [eliminado, setEliminado] = React.useState(false)

  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Genera fecha de bienvenida local (cuando se abre el form)
  const [fechaBienvenida, setFechaBienvenida] = React.useState<Date | null>(null)
  // Fecha de seguimiento solo se pone cuando hay texto en observacion de seguimiento
  const [fechaSeguimientoLlamada, setFechaSeguimientoLlamada] = React.useState<Date | null>(null)

  React.useEffect(() => {
    if (open) {
      setCursoLlamada("")
      setObservacion("")
      setObservacionSeguimiento("")
      setIdSeguimiento("")
      setEliminado(false)
      setError(null)
      setGuardando(false)
      // Fecha bienvenida: momento de abrir el formulario
      setFechaBienvenida(new Date())
      setFechaSeguimientoLlamada(null)
    }
  }, [open])

  React.useEffect(() => {
    // Cuando hay texto en observacionSeguimiento y aún no hay fechaSeguimiento, la setea
    if (observacionSeguimiento.trim() && !fechaSeguimientoLlamada) {
      setFechaSeguimientoLlamada(new Date())
    }
    // Si el usuario borra el campo, borra la fecha asociada también
    if (!observacionSeguimiento.trim() && fechaSeguimientoLlamada) {
      setFechaSeguimientoLlamada(null)
    }
  }, [observacionSeguimiento])

  if (!llamada) return null

  const handleGuardar = async () => {
    // Validación mínima: al menos observación debe tener algo
    if (
      !cursoLlamada.trim() &&
      !observacion.trim() &&
      !observacionSeguimiento.trim()
    ) {
      setError("Debes completar al menos un campo para guardar.")
      return
    }

    try {
      setGuardando(true)
      setError(null)

      // Armar el registro según los campos dados
      // Debe coincidir con esquema de 'llamadas'
      const record: LlamadaType = {
        // id: se autogenera
        // created_at: lo pone backend
        fecha_bienvenida: toUtcIsoString(fechaBienvenida),
        curso_llamada: cursoLlamada || null,
        observacion: observacion || null,
        fecha_seguimiento_llamada: toUtcIsoString(fechaSeguimientoLlamada),
        observacion_seguimiento: observacionSeguimiento || null,
        id_seguimiento: idSeguimiento ? Number(idSeguimiento) : null,
        eliminado: eliminado ? true : false
      }

      // id_propiedad_propietario => este dato DEBE estar asociado a la propiedad; cambiar aquí según tu modelo
      // Usar 0 si este dato no existe como ejemplo, pero deberías obtenerlo realmente de la llamada asociada
      const idPropiedadPropietario = (llamada as any)?.id ?? 0

      console.log(record, idPropiedadPropietario)

      const nuevaLlamada = await insertarLlamada(record, idPropiedadPropietario)

      console.log(nuevaLlamada)
      // Avísale al padre (si aplica), pasando el id de la nueva llamada y la observacion capturada
      // if (onObservacionGuardada) {
      //   onObservacionGuardada(nuevaLlamada.id, observacion)
      // }
      
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || "No se pudo guardar la llamada.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} preventOutsideClose={false}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageSquarePlusIcon className="size-5 text-primary" />
            <span>Nueva gestión / llamada</span>
          </DialogTitle>
          {/* <DialogDescription>
            Propiedad #{llamada.id_remax} • {llamada.propietario || "Sin propietario"}
          </DialogDescription> */}
        </DialogHeader>

        <form
          onSubmit={e => {
            e.preventDefault()
            handleGuardar()
          }}
        >
          <div className="space-y-3 py-2">

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Curso de llamada</label>
              <Textarea
                value={cursoLlamada}
                onChange={e => setCursoLlamada(e.target.value)}
                placeholder="Describe brevemente el curso de la llamada"
                className="min-h-16 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Observación</label>
              <Textarea
                value={observacion}
                onChange={e => setObservacion(e.target.value)}
                placeholder="Ingresa la observación principal..."
                className="min-h-20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Observación seguimiento
              </label>
              <Textarea
                value={observacionSeguimiento}
                onChange={e => setObservacionSeguimiento(e.target.value)}
                placeholder="Observación para seguimiento (opcional)..."
                className="min-h-20 text-sm"
              />
              {fechaSeguimientoLlamada && (
                <p className="text-xs text-muted-foreground">
                  Fecha seguimiento:{" "}
                  {/* Mostramos la fecha también en UTC 0 explícito */}
                  {fechaSeguimientoLlamada.toLocaleString("en-GB", { 
                    timeZone: "UTC", 
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })} UTC
                </p>
              )}
            </div>

            {/* <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                ID Seguimiento (opcional)
              </label>
              <input
                type="number"
                min={1}
                className="w-full border rounded text-sm px-2 py-1"
                value={idSeguimiento}
                onChange={e => setIdSeguimiento(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={eliminado}
                onChange={e => setEliminado(e.target.checked)}
                id="eliminado"
              />
              <label htmlFor="eliminado" className="text-xs text-foreground">
                Eliminado
              </label>
            </div> */}

            <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
              <div>
                <strong>Fecha de bienvenida:</strong>{" "}
                {fechaBienvenida
                  ? fechaBienvenida.toLocaleString("en-GB", { 
                      timeZone: "UTC", 
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    }) + " UTC"
                  : "Se generará automáticamente"}
              </div>
              {/* created_at: solo backend */}
            </div>

            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={guardando}
            >
              {guardando ? (
                <>
                  <Loader2Icon className="mr-1.5 size-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
