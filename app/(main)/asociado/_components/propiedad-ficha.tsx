"use client";

import { Home, MapPin, Ruler, Building2, SquareArrowOutUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { InmuebleDetalle } from "@/lib/supabase/queries/propiedad_propietarios";
import { DetailField, formatDate } from "./detail-field";
import { DocumentResource } from "./document-resource";

interface PropiedadesFichaProps {
  propiedades: InmuebleDetalle[];
  loading: boolean;
  CheckRevision: any[];
  contratoId: number | null;
}

/** Medida (m²) con etiqueta. Muestra "—" si no hay dato. */
function Medida({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-950/40">
      <Ruler className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {value != null ? `${value.toLocaleString("es-PE")} m²` : "—"}
        </p>
      </div>
    </div>
  );
}

export function PropiedadFicha({
  propiedades,
  CheckRevision,
  loading,
  contratoId,
}: PropiedadesFichaProps) {
  if (!contratoId) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="size-5 text-blue-600" />
            Propiedades
          </CardTitle>
          <CardDescription>
            Selecciona un contrato para ver el detalle de sus propiedades.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propiedades</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (!propiedades || propiedades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="size-5 text-blue-600 dark:text-blue-400" />
            Propiedades
          </CardTitle>
          <CardDescription>
            No se encontró información de propiedades vinculadas al contrato.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const total = propiedades.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="size-5 text-blue-600 dark:text-blue-400" />
          Propiedades
          <Badge variant="secondary" className="ml-1 rounded-full px-2 py-0 text-xs font-medium">
            {total}
          </Badge>
        </CardTitle>
        <CardDescription>
          {total} propiedad{total === 1 ? "" : "es"} vinculada{total === 1 ? "" : "s"} al contrato
        </CardDescription>
      </CardHeader>

      <CardContent className="grid items-start gap-4 xl:grid-cols-2">
        {propiedades.map((propiedad) => {
          const inmueble = propiedad.inmueble;
          const fotos = inmueble.fotos;

          return (
            <article
              key={propiedad.id_propiedad}
              className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40"
            >
              {/* Cabecera: identificación + documentos */}
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
                      ID Remax {inmueble.id_remax ?? "—"}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      #{propiedad.id_propiedad}
                    </span>
                  </h3>
                  <p className="mt-1 flex items-start gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
                    <span className="break-words">
                      {inmueble.direccion ?? "Sin dirección registrada"}
                    </span>
                  </p>
                </div>
                <div className="relative shrink-0">        
                  {
                    inmueble.id_remax ? 
                    <a  target="_blank" href={"https://www.remax.pe/web/search/all/propertys/list/?code__in="+ inmueble.id_remax}><SquareArrowOutUpRight /></a> :
                    <></>  
                  }                                    
                  {/* <DocumentResource
                    url=""
                    document={propiedad}
                    type="inmueble"
                    CheckRevision={CheckRevision}
                  /> */}
                </div>
              </header>

              {/* Medidas */}
              <div className="grid grid-cols-2 gap-2">
                <Medida label="Área terreno" value={inmueble.area_terreno} />
                <Medida label="Área construida" value={inmueble.area_construida} />
              </div>

              {/* Datos del inmueble */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <DetailField label="Tipo" value={inmueble.tipo_propiedad?.tipo_propiedad} />
                <DetailField label="Distrito" value={inmueble.distritos?.distrito} />
                <DetailField label="N° partida" boldValue value={inmueble.n_partida} />
                <DetailField label="Captación" value={inmueble.captacion_mes?.mes} />
                <DetailField
                  label="Fotos"
                  value={fotos == null ? null : fotos ? "Disponibles" : "Pendientes"}
                  badge={fotos != null}
                  badgeVariant={fotos ? "secondary" : "outline"}
                />
                <DetailField
                  label="Fecha estimada de título"
                  value={formatDate(inmueble.fecha_est_titulo)}
                />
                <DetailField
                  label="Observación"
                  value={inmueble.observacion}
                  className="col-span-2"
                />
              </dl>
            </article>
          );
        })}
      </CardContent>
    </Card>
  );
}