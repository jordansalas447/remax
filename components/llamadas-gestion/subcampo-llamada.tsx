"use client"

import * as React from "react"
import {
  FileTextIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
  SendIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  LlamadasRowDetalle,
  agregarObservacionLlamada,
} from "@/lib/supabase/queries/llamadas"

interface SubcampoLlamadaProps {
  llamada: LlamadasRowDetalle
  onObservacionGuardada: (idLlamada: number, observacionActualizada: string) => void
}

export function SubcampoLlamada({
  llamada,
  onObservacionGuardada,
}: SubcampoLlamadaProps) {
  const [nuevaNota, setNuevaNota] = React.useState("")
  const [guardando, setGuardando] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = React.useState(false)

  const handleGuardar = async () => {
    if (!nuevaNota.trim()) return

    try {
      setGuardando(true)
      setError(null)
      const observacionFinal = await agregarObservacionLlamada(
        llamada.id,
        nuevaNota.trim(),
        llamada.observacion
      )
      onObservacionGuardada(llamada.id, observacionFinal)
      setNuevaNota("")
      setMostrarForm(false)
    } catch (err: any) {
      setError(err?.message || "Error al guardar.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Detalle del Registro #{llamada.id_remax}
          </span>
          {llamada.propietario && (
            <span className="inline-flex items-center gap-1">
              <UserIcon className="size-3.5" />
              {llamada.propietario}
            </span>
          )}
          {llamada.numero_telefono && (
            <span className="inline-flex items-center gap-1">
              <PhoneIcon className="size-3.5" />
              {llamada.numero_telefono}
            </span>
          )}
          {llamada.direccion && (
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-3.5" />
              {llamada.direccion}
            </span>
          )}
        </div>

        {!mostrarForm && (
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="gap-1 text-xs"
            onClick={() => setMostrarForm(true)}
          >
            <PlusIcon className="size-3" />
            Añadir nota rápida
          </Button>
        )}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {/* Observación principal */}
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <FileTextIcon className="size-3.5 text-primary" />
            <span>Observaciones</span>
          </div>
          <p className="mt-1.5 text-xs whitespace-pre-wrap text-muted-foreground">
            {llamada.observacion?.trim() || "Sin observaciones registradas."}
          </p>
        </div>

        {/* Observación de seguimiento */}
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <FileTextIcon className="size-3.5 text-muted-foreground" />
            <span>Observación de Seguimiento</span>
          </div>
          <p className="mt-1.5 text-xs whitespace-pre-wrap text-muted-foreground">
            {llamada.observacion_seguimiento?.trim() ||
              "Sin observaciones de seguimiento."}
          </p>
        </div>
      </div>

      {/* Formulario desplegable para agregar observación inmediata */}
      {mostrarForm && (
        <div className="mt-3 space-y-2 rounded-md border border-primary/20 bg-primary/5 p-3">
          <label className="text-xs font-medium text-foreground">
            Nueva observación rápida:
          </label>
          <Textarea
            value={nuevaNota}
            onChange={(e) => setNuevaNota(e.target.value)}
            placeholder="Escribe la observación aquí..."
            className="min-h-16 bg-background text-xs"
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => {
                setMostrarForm(false)
                setNuevaNota("")
                setError(null)
              }}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              size="xs"
              onClick={handleGuardar}
              disabled={guardando || !nuevaNota.trim()}
              className="gap-1"
            >
              {guardando ? (
                <>
                  <Loader2Icon className="size-3 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <SendIcon className="size-3" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
