"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AsociadoDetalle } from "@/lib/supabase/queries/asociados";
import { DetailField, formatDate, getInitials } from "./detail-field";

interface AsociadoProfileCardProps {
  asociado: AsociadoDetalle | null;
  loading: boolean;
  fotoUrl?: string | null;
}

export function AsociadoProfileCard({ asociado, loading, fotoUrl }: AsociadoProfileCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex gap-6 p-6">
          <Skeleton className="size-28 shrink-0 rounded-2xl" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!asociado) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Ficha del asociado</CardTitle>
          <CardDescription>
            Selecciona un asociado para ver su información personal y contratos vinculados.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const persona = asociado.personas;
  const detalle = asociado.detalle_asociado;
  const nombre = asociado.nombre_completo ?? persona?.nombre_completo ?? "Sin nombre";
  const initials = getInitials(nombre);

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fotoUrl} alt={nombre} className="size-full object-cover" />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-700 dark:from-indigo-950 dark:to-zinc-900 dark:text-indigo-200">
                {initials !== "?" ? (
                  <span className="text-2xl font-semibold">{initials}</span>
                ) : (
                  <User className="size-10 opacity-70" />
                )}
              </div>
            )}
          </div>
          <p className="max-w-[7rem] text-center text-xs text-zinc-500 dark:text-zinc-400">
            Foto del asociado
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {nombre}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              ID #{asociado.id_asociado}
              {detalle?.nivel_asociado?.descripcion
                ? ` · ${detalle.nivel_asociado.descripcion}`
                : ""}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label="Documento" value={persona?.documento_identidad} />
            <DetailField label="Teléfono" value={persona?.numero_telefono} />
            <DetailField label="Dirección" value={persona?.direccion} />
            <DetailField label="Fecha nacimiento" value={formatDate(persona?.fecha_nacimiento)} />
            <DetailField label="Registro asociado" value={formatDate(asociado.fecha_creacion)} />
            <DetailField label="Detalle" value={detalle?.descripcion ?? asociado.descripcion} />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
