"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AsociadoDetalle } from "@/lib/supabase/queries/asociados";
import { DetailField, formatDate, getInitials } from "./detail-field";
import { Badge } from "@/components/ui/badge";

interface AsociadoProfileCardProps {
  asociado: AsociadoDetalle | null;
  loading: boolean;
  fotoUrl?: string | null;
}

export function AsociadoProfileCard({ asociado, loading, fotoUrl }: AsociadoProfileCardProps) {
  if (loading) {
    return (
<Card>
  <CardContent className="flex flex-col items-center gap-4 p-6">
    {/* Avatar */}
    <Skeleton className="size-24 shrink-0 rounded-2xl" />

    {/* Nombre + meta */}
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-5 w-28 rounded-full" />
    </div>

    {/* Detalles */}
    <div className="flex w-full flex-col gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
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
  const URL = asociado.url_resource;
  const initials = getInitials(nombre);

  return (
<Card>
  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
    {/* Avatar */}
    <div className="relative flex size-36 md:size-40 items-center justify-center overflow-hidden rounded-3xl border-2 border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
      {URL ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={URL} alt={nombre} className="size-full object-cover" />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-700 dark:from-indigo-950 dark:to-zinc-900 dark:text-indigo-200">
          {initials !== "?" ? (
            <span className="text-3xl md:text-4xl font-semibold">{initials}</span>
          ) : (
            <User className="size-14 opacity-70" />
          )}
        </div>
      )}
    </div>

    {/* Nombre + meta */}
    <div className="min-w-0">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {nombre}
      </h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        ID #{asociado.id_asociado}
      </p>
      {detalle?.nivel_asociado?.descripcion && (
        <Badge variant="secondary" className="mt-2 rounded-full text-xs font-medium">
          {detalle.nivel_asociado.descripcion}
        </Badge>
      )}
    </div>

    {/* Detalles */}
    <dl className="flex w-full flex-col gap-3 border-t border-zinc-100 pt-4 text-left dark:border-zinc-800">
      <DetailField label="Documento" value={persona?.documento_identidad} />
      <DetailField label="Teléfono" value={persona?.numero_telefono} />
      <DetailField label="Dirección" value={persona?.direccion} />
      <DetailField label="Fecha nacimiento" value={formatDate(persona?.fecha_nacimiento)} />
      <DetailField label="Registro asociado" value={formatDate(asociado.fecha_creacion)} />
      <DetailField label="Detalle" value={detalle?.descripcion ?? asociado.descripcion} />
    </dl>
  </CardContent>
</Card>
  );
}
