"use client";

import { useEffect, useState } from "react";
import { getEstadosRevision } from "@/lib/supabase/queries/estados_revision";
import { updateRevision } from "@/lib/supabase/queries/revisiones";
import type { EstadoRevisionRow } from "@/lib/supabase/queries/estados_revision";
import { FileCheck2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PropiedadPropietarioDetalle, RevisionDocumentoDetalle } from "@/lib/supabase/queries/propiedad_propietarios";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faFile, faFileContract, faUser } from "@fortawesome/free-solid-svg-icons";


type DocumentsCheckProps = {
  revisiones: RevisionDocumentoDetalle[];
  loading: boolean;

};

export function RevisionesEstatusItem({ revisiones, loading }: DocumentsCheckProps) {

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck2 className="size-5 text-indigo-600" />
            Revisión de documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // // Aplanar los items checklist para mostrar como documentos pendientes o revisar
  // const allDocuments = revisiones.flatMap((prop) =>
  //   prop.revisiones.map((item) => ({
  //     id: item.id_revision,
  //     descripcion: item.rev || "-",
  //     oficina: item.estado_oficina || "-",
  //     operacion_inmobiliaria: item.operacion || "-",
  //     sigi: item.estado_sigi || "-",
  //     sigi_color: item.estado_sigi?.color || "#fde68a", // amarillo pálido predeterminado para pendientes
  //     oficina_color: item.estado_oficina?.color || "#fde68a", // amarillo pálido predeterminado para pendientes
  //   }))
  // );

  function getStatusStyles(descripcion: string, color?: string) {
    if (descripcion === "-") {
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
    // Si hay color definido (hex u otro formato tailwind compatible)
    return color
      ? `border px-2 py-0.5 text-xs font-semibold`
      : "bg-zinc-100 text-zinc-800";
  }

  function getStatusInlineStyle(color?: string) {
    // Si viene color hex, úsalo como fondo y busca un color adecuado para la fuente
    if (!color) return undefined;
    // Texto oscuro si fondo claro, texto blanco si fondo oscuro
    let textColor = "#111";
    // Simple darkness check (luma, asumimos #RRGGBB)
    if (color.startsWith("#") && color.length === 7) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      textColor = luma < 180 ? "#fff" : "#111";
    }
    return { backgroundColor: color, color: textColor, border: `1px solid ${color}` };
  }

  return (
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <FileCheck2 className="size-5 text-amber-600 dark:text-amber-500" />
      Advertencia
      {revisiones.length > 0 && (
        <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs font-medium">
          {revisiones.length}
        </Badge>
      )}
    </CardTitle>
    <CardDescription>
      {revisiones.length > 0
        ? `${revisiones.length} documento${revisiones.length > 1 ? "s" : ""} pendiente${revisiones.length > 1 ? "s" : ""} de revisión`
        : "No hay documentos para revisar por ahora"}
    </CardDescription>
  </CardHeader>

  {revisiones.length > 0 ? (
    <CardContent className="grid gap-3 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
      {revisiones.map((doc) => (
        <div
          key={doc.id_revision}
          className="group relative rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-amber-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-amber-800/60"
        >
          {/* barra de acento */}
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-amber-400/70 dark:bg-amber-500/50" />

          <div className="grid grid-cols-6 gap-4 items-center">
            {/* Columna 1: icono grande vertical flex center */}
            <div className="col-span-1 flex flex-col items-center justify-center h-full">
              {doc.operacion === "Propiedad" ? (
                <FontAwesomeIcon icon={faBuilding} className="text-4xl text-zinc-400 dark:text-zinc-500" />
              ) : doc.operacion === "Propietario" ? (
                <FontAwesomeIcon icon={faUser} className="text-4xl text-zinc-400 dark:text-zinc-500" />
              ) : doc.operacion === "contrato" ? (
                <FontAwesomeIcon icon={faFileContract} className="text-4xl text-zinc-400 dark:text-zinc-500" />
              ) : (
                <FontAwesomeIcon icon={faFile} className="text-4xl text-zinc-400 dark:text-zinc-500" />
              )}
            </div>
       

            {/* Columna 2: resto de datos */}
            <div className="col-span-5 flex flex-col gap-2">
              <div className="mb-1 min-w-0">
                <p className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                  {doc.operacion} ({doc.nombre_item})
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                  <span>{doc.rev}</span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span>ID #{doc.id_revision}</span>
                </div>
              </div>

              <dl className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-zinc-500 dark:text-zinc-400">Oficina</dt>
                  <dd>
                    <Badge
                      variant="outline"
                      className={`truncate rounded-full font-medium ${getStatusStyles(doc.estado_oficina, doc.color_estado_oficina)}`}
                      style={
                        doc.color_estado_oficina && doc.estado_oficina !== "-"
                          ? getStatusInlineStyle(doc.color_estado_oficina)
                          : undefined
                      }
                    >
                      {doc.estado_oficina}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="font-medium text-zinc-500 dark:text-zinc-400">Sigi</dt>
                  <dd>
                    <Badge
                      variant="outline"
                      className={`truncate rounded-full font-medium ${getStatusStyles(doc.estado_sigi, doc.color_estado_sigi)}`}
                      style={
                        doc.color_estado_sigi && doc.estado_sigi !== "-"
                          ? getStatusInlineStyle(doc.color_estado_sigi)
                          : undefined
                      }
                    >
                      {doc.estado_sigi}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
   
      ))}
    </CardContent>
  ) : (
    <CardContent>
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-10 text-center dark:border-zinc-800">
        <FileCheck2 className="size-8 text-zinc-300 dark:text-zinc-700" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Todo al día. No hay documentos pendientes.
        </p>
      </div>
    </CardContent>
  )}
</Card>
  );
}

export default RevisionesEstatusItem;