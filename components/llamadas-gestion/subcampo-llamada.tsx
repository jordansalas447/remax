"use client"

import * as React from "react"
import {
  Calendar,
  FileTextIcon,
  MapPinIcon,
  PencilIcon,
  Phone,
  PhoneIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  LlamadaType,
  LlamadasRowDetalle,
} from "@/lib/supabase/queries/llamadas"
import { Badge, BadgeVariant } from "../ui/badge"

interface SubcampoLlamadaProps {
  llamada: LlamadasRowDetalle
  onObservacionGuardada: (idLlamada: number, observacionActualizada: LlamadaType) => void
  onEditar?: (llamada: LlamadasRowDetalle) => void
}

export function SubcampoLlamada({
  llamada,
  onEditar,
}: SubcampoLlamadaProps) {
  const tieneDatos = Boolean(
    llamada.id_llamada ||
    llamada.curso_llamada?.trim() ||
    llamada.observacion?.trim() ||
    llamada.observacion_seguimiento?.trim() ||
    llamada.estado_llamada
  )

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            ID REMAX #{llamada.id_remax}
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
          {llamada.fecha_contrato_recibido && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {llamada.fecha_contrato_recibido}
            </span>
          )}
        </div>

        {onEditar && (
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="gap-1 text-xs border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => onEditar(llamada)}
          >
            <PencilIcon className="size-3" />
            <span>{tieneDatos ? "Editar gestión" : "Añadir gestión"}</span>
          </Button>
        )}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {/* Curso Llamada */}
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="flex items-center justify-between gap-1.5 text-xs font-semibold text-foreground">
            <div className="flex items-center gap-1.5">
              <FileTextIcon className="size-3.5 text-primary" />
              <span>Curso Llamada</span>
            </div>
            {llamada.fecha_bienvenida && (
              <span className="text-[11px] font-normal text-muted-foreground">
                {new Date(llamada.fecha_bienvenida).toLocaleDateString("es-PE")}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs whitespace-pre-wrap text-muted-foreground">
            {llamada.curso_llamada?.trim() || "Sin observaciones registradas."}
          </p>
        </div>

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
          <div className="flex items-center justify-between gap-1.5 text-xs font-semibold text-foreground">
            <div className="flex items-center gap-1.5">
              <FileTextIcon className="size-3.5 text-muted-foreground" />
              <span>Observación de Seguimiento</span>
            </div>
            {llamada.fecha_seguimiento_llamada && (
              <span className="text-[11px] font-normal text-muted-foreground">
                {new Date(llamada.fecha_seguimiento_llamada).toLocaleDateString("es-PE")}
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs whitespace-pre-wrap text-muted-foreground">
            {llamada.observacion_seguimiento?.trim() ||
              "Sin observaciones de seguimiento."}
          </p>
        </div>

        {/* Estado Llamada */}
        <div className="rounded-md border bg-muted/30 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Phone className="size-3.5 text-muted-foreground" />
            <span>Estado Llamada</span>
          </div>
          <div className="mt-1.5">
            <Badge variant={(llamada.color as BadgeVariant) ?? "default"}>
              {llamada.estado_llamada?.trim() || "Pendiente"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

