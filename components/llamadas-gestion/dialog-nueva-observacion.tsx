"use client"

import * as React from "react"
import { Loader2Icon, MessageSquarePlusIcon, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  LlamadaType,
  LlamadasRowDetalle,
  guardarLlamada,
} from "@/lib/supabase/queries/llamadas"
import { NativeSelect } from "../ui/native-select"
import { EstadoLlamadas } from "@/lib/supabase/queries/estado_llamada"

type DialogNuevaObservacionProps = {
  llamada: (LlamadasRowDetalle & LlamadaType) | null
  estadollamadas: EstadoLlamadas[] | []
  open: boolean
  onOpenChange: (open: boolean) => void
  onObservacionGuardada?: (idLlamada: number, observacionActualizada: LlamadaType) => void
}

// Helper para formatear fechas a ISO 8601 UTC explícito (con "Z")
function toUtcIsoString(date: Date | null): string | null {
  if (!date || isNaN(date.getTime())) return null
  return date.toISOString()
}

export function DialogNuevaObservacion({
  llamada,
  estadollamadas,
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
  const [estadoLlamada, setEstadoLlamada] = React.useState<string>("")

  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Genera fecha de bienvenida local (cuando se abre el form)
  const [fechaBienvenida, setFechaBienvenida] = React.useState<Date | null>(null)
  // Fecha de seguimiento solo se pone cuando hay texto en observacion de seguimiento
  const [fechaSeguimientoLlamada, setFechaSeguimientoLlamada] = React.useState<Date | null>(null)

  // Determinar si ya existe un registro de llamada asociado a este inmueble/propietario
  const esEdicion = Boolean(
    llamada?.id_llamada ||
    llamada?.curso_llamada?.trim() ||
    llamada?.observacion?.trim() ||
    llamada?.observacion_seguimiento?.trim() ||
    llamada?.fecha_bienvenida ||
    llamada?.estado_llamada
  )

  React.useEffect(() => {
    if (open && llamada) {
      if (esEdicion) {
        // Cargar datos existentes para editar
        setCursoLlamada(llamada.curso_llamada || "")
        setObservacion(llamada.observacion || "")
        setObservacionSeguimiento(llamada.observacion_seguimiento || "")
        setIdSeguimiento(llamada.id_seguimiento ? String(llamada.id_seguimiento) : "")
        setEliminado(Boolean((llamada as any).eliminado))

        // Determinar ID del estado de la llamada
        let matchedEstadoId = ""
        if (llamada.id_estado_llamada) {
          matchedEstadoId = String(llamada.id_estado_llamada)
        } else if (llamada.estado_llamada) {
          const found = estadollamadas.find(
            (opt) =>
              opt.estado_llamada?.trim().toLowerCase() ===
              String(llamada.estado_llamada).trim().toLowerCase()
          )
          if (found) {
            matchedEstadoId = String(found.id)
          }
        }
        setEstadoLlamada(matchedEstadoId)

        // Fechas existentes
        if (llamada.fecha_bienvenida) {
          const d = new Date(llamada.fecha_bienvenida)
          setFechaBienvenida(isNaN(d.getTime()) ? new Date() : d)
        } else {
          setFechaBienvenida(new Date())
        }

        if (llamada.fecha_seguimiento_llamada) {
          const d = new Date(llamada.fecha_seguimiento_llamada)
          setFechaSeguimientoLlamada(isNaN(d.getTime()) ? null : d)
        } else {
          setFechaSeguimientoLlamada(null)
        }
      } else {
        // Modo nuevo: campos vacíos
        setCursoLlamada("")
        setObservacion("")
        setObservacionSeguimiento("")
        setIdSeguimiento("")
        setEliminado(false)
        setEstadoLlamada("")
        setFechaBienvenida(new Date())
        setFechaSeguimientoLlamada(null)
      }

      setError(null)
      setGuardando(false)
    }
  }, [open, llamada, esEdicion, estadollamadas])

  React.useEffect(() => {
    // Si hay texto en seguimiento y no hay fecha registrada aún, asignar fecha actual
    if (observacionSeguimiento.trim() && !fechaSeguimientoLlamada) {
      setFechaSeguimientoLlamada(new Date())
    }
    if (!observacionSeguimiento.trim() && fechaSeguimientoLlamada) {
      setFechaSeguimientoLlamada(null)
    }
  }, [observacionSeguimiento])

  if (!llamada) return null

  const handleGuardar = async () => {
    // Validación mínima: al menos observación o curso de llamada y estado seleccionado
    if (
      !cursoLlamada.trim() &&
      !observacion.trim() &&
      !observacionSeguimiento.trim()
    ) {
      setError("Debes completar al menos un campo de observación o curso de llamada.")
      return
    }
    if (!estadoLlamada) {
      setError("Debes seleccionar un estado de llamada.")
      return
    }

    try {
      setGuardando(true)
      setError(null)

      // Armar el registro según los campos dados
      const record: Omit<LlamadaType, 'id'> = {
        fecha_bienvenida: toUtcIsoString(fechaBienvenida),
        curso_llamada: cursoLlamada || null,
        observacion: observacion || null,
        fecha_seguimiento_llamada: toUtcIsoString(fechaSeguimientoLlamada),
        observacion_seguimiento: observacionSeguimiento || null,
        id_seguimiento: idSeguimiento ? Number(idSeguimiento) : null,
        eliminado: eliminado ? true : false,
        id_estado_llamada: Number(estadoLlamada),
      }

      const idPropiedadPropietario = (llamada as any)?.id ?? 0
      const idLlamadaExistente = (llamada as any)?.id_llamada ?? null

      const { data: llamadaGuardada, id_propiedad_propietario } = await guardarLlamada(
        record,
        idPropiedadPropietario,
        idLlamadaExistente
      )

      if (onObservacionGuardada) {
        onObservacionGuardada(id_propiedad_propietario || idPropiedadPropietario, {
          ...record,
          id: llamadaGuardada?.id ?? idLlamadaExistente ?? undefined,
        })
      }

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
            {esEdicion ? (
              <PencilIcon className="size-5 text-primary" />
            ) : (
              <MessageSquarePlusIcon className="size-5 text-primary" />
            )}
            <span>
              {esEdicion ? "Editar gestión / llamada" : "Nueva gestión / llamada"}
            </span>
          </DialogTitle>
          <div className="text-xs text-muted-foreground mt-0.5">
            {llamada.id_remax && (
              <span className="font-semibold text-foreground">
                ID REMAX #{llamada.id_remax}
              </span>
            )}
            {llamada.propietario && ` • ${llamada.propietario}`}
            {llamada.numero_telefono && ` • Tel: ${llamada.numero_telefono}`}
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleGuardar()
          }}
        >
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Curso de llamada</label>
              <Textarea
                value={cursoLlamada}
                onChange={(e) => setCursoLlamada(e.target.value)}
                placeholder="Describe brevemente el curso de la llamada"
                className="min-h-16 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Observación</label>
              <Textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
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
                onChange={(e) => setObservacionSeguimiento(e.target.value)}
                placeholder="Observación para seguimiento (opcional)..."
                className="min-h-20 text-sm"
              />
              {fechaSeguimientoLlamada && (
                <p className="text-xs text-muted-foreground">
                  Fecha seguimiento:{" "}
                  {new Date(fechaSeguimientoLlamada.getTime() - 5 * 60 * 60 * 1000).toLocaleString("es-PE", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    // hour: "2-digit",
                    // minute: "2-digit",
                    // second: "2-digit",
                  })}
                </p>
              )}

            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Estado Llamada</label>
              <NativeSelect
                value={estadoLlamada}
                onChange={(e) => setEstadoLlamada(e.target.value)}
                required={true}
                name="estado_llamada"
                id="estado_llamada"
              >
                <option value="">Seleccionar…</option>
                {estadollamadas.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.estado_llamada}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
              <div>
                <strong>Fecha de bienvenida:</strong>{" "}
                {fechaBienvenida
                  ? new Date(fechaBienvenida.getTime() - 5 * 60 * 60 * 1000).toLocaleString("es-PE", {
                      timeZone: "UTC",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      // hour: "2-digit",
                      // minute: "2-digit",
                      // second: "2-digit",
                    })
                  : "Se generará automáticamente"}
             
              </div>
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
            <Button type="submit" size="sm" disabled={guardando}>
              {guardando ? (
                <>
                  <Loader2Icon className="mr-1.5 size-3.5 animate-spin" />
                  {esEdicion ? "Actualizando..." : "Guardando..."}
                </>
              ) : esEdicion ? (
                "Guardar cambios"
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

