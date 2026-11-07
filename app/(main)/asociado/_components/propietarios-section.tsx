"use client";

import { FileText, IdCard, MapPin, Phone, PhoneCall, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { PropietarioDetalle } from "@/lib/supabase/queries/propietarios";
import type { LlamadasRowDetalle } from "@/lib/supabase/queries/llamadas";
import { DetailField, formatDate, getInitials } from "./detail-field";
// import { DocumentResource } from "./document-resource";

interface PropietariosSectionProps {
  propietarios: PropietarioDetalle[];
  llamadas: LlamadasRowDetalle[];
  loading: boolean;
  CheckRevision: any[]; // se mantiene por compatibilidad con DocumentResource
  propiedadId: number | null;
}

/** Fila con icono + valor. No se renderiza si no hay valor. */
function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
      <div className="min-w-0">
        <span className="sr-only">{label}: </span>
        <span className="break-words text-sm text-zinc-700 dark:text-zinc-300">{value}</span>
      </div>
    </div>
  );
}

function LlamadaBlock({ llamada }: { llamada: LlamadasRowDetalle }) {
  const hasNotes = llamada.observacion || llamada.observacion_seguimiento;

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <PhoneCall className="size-4 text-blue-600 dark:text-blue-400" aria-hidden />
          Llamada de bienvenida
        </div>
        {llamada.estado_llamada && (
          <Badge variant={llamada.color as BadgeVariant}>{llamada.estado_llamada}</Badge>
        )}
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-2">
        <DetailField label="Curso" value={llamada.curso_llamada} />
        <DetailField label="Fecha de bienvenida / Llamada" value={formatDate(llamada.fecha_bienvenida)} />
        {hasNotes && (
          <>
            <DetailField
              label="Observación"
              value={llamada.observacion}
              className="sm:col-span-2"
            />
            <DetailField
              label="Observación de seguimiento"
              value={llamada.observacion_seguimiento}
              className="sm:col-span-2"
            />
          </>
        )}
      </dl>
    </div>
  );
}

export function PropietariosSection({
  propietarios,
  loading,
  propiedadId,
  llamadas,
}: PropietariosSectionProps) {
  if (!propiedadId) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-blue-600" />
            Propietarios
          </CardTitle>
          <CardDescription>
            Selecciona un contrato para ver los propietarios de la propiedad.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propietarios</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const total = propietarios.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-blue-600 dark:text-blue-400" />
          Propietarios
          {total > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs font-medium">
              {total}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {total === 0
            ? "No hay propietarios vinculados a esta propiedad"
            : `${total} propietario${total === 1 ? "" : "s"} registrado${total === 1 ? "" : "s"}`}
        </CardDescription>
      </CardHeader>

      {total > 0 ? (
        <CardContent className="grid items-start gap-4 md:grid-cols-2">
          {propietarios.map((propietario) => {
            const persona = propietario.personas;
            const nombre = propietario.nombre_completo ?? persona?.nombre_completo ?? "Sin nombre";
            const situacion = propietario.situacion?.descripcion;
            const llamadasPropietario = llamadas.filter(
              (l) => l.id_propietario === propietario.id_propietario
            );

            return (
              <article
                key={propietario.id_propietario}
                className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-blue-800/60"
              >
                {/* Cabecera: identidad */}
                <header className="flex items-start gap-3">
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    aria-hidden
                  >
                    {getInitials(nombre)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
                      {nombre}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      {situacion && (
                        <Badge variant="outline" className="text-xs font-normal">
                          {situacion}
                        </Badge>
                      )}
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        ID #{propietario.id_propietario}
                      </span>
                    </div>
                  </div>
                  {/* <DocumentResource url={undefined} document={propietario} type="propietario" CheckRevision={matches} /> */}
                </header>

                {/* Datos de contacto */}
                <div className="grid gap-2.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                  <ContactRow
                    icon={Phone}
                    label="Contacto"
                    value={propietario.contacto ?? persona?.numero_telefono}
                  />
                  <ContactRow
                    icon={IdCard}
                    label="Documento"
                    value={persona?.documento_identidad}
                  />
                  <ContactRow icon={MapPin} label="Dirección" value={persona?.direccion} />
                </div>

                {/* Seguimiento de llamadas */}
                {llamadasPropietario.map((llamada, index) => (
                  <LlamadaBlock
                    key={`${llamada.id_propietario}-${index}`}
                    llamada={llamada}
                  />
                ))}
              </article>
            );
          })}
        </CardContent>
      ) : (
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-800">
            <Users className="size-8 text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Sin propietarios vinculados a esta propiedad.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}