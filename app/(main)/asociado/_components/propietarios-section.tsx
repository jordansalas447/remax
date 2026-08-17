"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropietarioDetalle } from "@/lib/supabase/queries/propietarios";
import { DetailField } from "./detail-field";

interface PropietariosSectionProps {
  propietarios: PropietarioDetalle[];
  loading: boolean;
  propiedadId: number | null;
}

export function PropietariosSection({ propietarios, loading, propiedadId }: PropietariosSectionProps) {
  if (!propiedadId) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-indigo-600" />
            Propietarios
          </CardTitle>
          <CardDescription>Selecciona un contrato para ver los propietarios de la propiedad.</CardDescription>
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
        <CardContent className="grid gap-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-5 text-indigo-600" />
          Propietarios
        </CardTitle>
        <CardDescription>
          {propietarios.length === 0
            ? "No hay propietarios vinculados a esta propiedad."
            : `${propietarios.length} propietario${propietarios.length === 1 ? "" : "s"} registrado${propietarios.length === 1 ? "" : "s"}.`}
        </CardDescription>
      </CardHeader>

      {propietarios.length > 0 && (
        <CardContent className="grid gap-3 md:grid-cols-2">
          {propietarios.map((propietario) => {
            const persona = propietario.personas;
            const nombre = propietario.nombre_completo ?? persona?.nombre_completo ?? "Sin nombre";

            return (
              <div
                key={propietario.id_propietario}
                className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{nombre}</p>
                <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                  ID #{propietario.id_propietario}
                </p>
                <dl className="grid gap-2 sm:grid-cols-2">
                  <DetailField label="Contacto" value={propietario.contacto ?? persona?.numero_telefono} />
                  <DetailField label="Documento" value={persona?.documento_identidad} />
                  <DetailField label="Dirección" value={persona?.direccion} className="sm:col-span-2" />
                </dl>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
