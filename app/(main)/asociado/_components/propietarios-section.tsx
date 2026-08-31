"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropietarioDetalle } from "@/lib/supabase/queries/propietarios";
import { DetailField } from "./detail-field";
import { Badge } from "@/components/ui/badge";
import { DocumentResource } from "./document-resource";
import { getVistaRevisiones } from "@/lib/supabase/queries/revisiones";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface PropietariosSectionProps {
  propietarios: PropietarioDetalle[];
  loading: boolean;
  CheckRevision:any[];
  propiedadId: number | null;
}

export function PropietariosSection({ propietarios,CheckRevision ,loading, propiedadId }: PropietariosSectionProps) {

  // Eliminate the incorrect log and replace with a proper example log per-propietario matching CheckRevision

  // For debugging: print CheckRevision entries grouped/matched by propietario

    const matches = CheckRevision.filter(
      i => i.id_ref_propiedad_propietario_contrato == propietarios[0]?.id_propietario
    )


  if (!propiedadId) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-blue-600" />
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
      <Users className="size-5 text-blue-600 dark:text-blue-400" />
      Propietarios
      {propietarios.length > 0 && (
        <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs font-medium">
          {propietarios.length}
        </Badge>
      )}
    </CardTitle>
    <CardDescription>
      {propietarios.length === 0
        ? "No hay propietarios vinculados a esta propiedad"
        : `${propietarios.length} propietario${propietarios.length === 1 ? "" : "s"} registrado${propietarios.length === 1 ? "" : "s"}`}
    </CardDescription>
  </CardHeader>

  {propietarios.length > 0 ? (
    <CardContent className="grid gap-3 md:grid-cols-2">
      {propietarios.map((propietario) => {
        const persona = propietario.personas;
        const nombre = propietario.nombre_completo ?? persona?.nombre_completo ?? "Sin nombre";

        return (
          <div
            key={propietario.id_propietario}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-blue-800/60"
          >
            <div className="relative">
              <div className="absolute right-0">
              <DocumentResource url={undefined} document={propietario} type={"propietario"} CheckRevision={matches} />
              </div>         
            </div>  
            <div className="mb-3 flex items-center gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50"><FontAwesomeIcon icon={faUser} />{nombre}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  ID #{propietario.id_propietario}
                </p>
              </div>
            </div>   
            <dl className="grid gap-2 border-t border-zinc-100 pt-3 sm:grid-cols-2 dark:border-zinc-800">
              <DetailField label="Contacto" value={propietario.contacto ?? persona?.numero_telefono} />
              <DetailField label="Documento" value={persona?.documento_identidad} />
              <DetailField label="Dirección" value={persona?.direccion} className="sm:col-span-2" />
            </dl>
          </div>
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
