"use client";

import {  Home, MapPin, Ruler } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailField, formatDate } from "./detail-field";
import { DocumentResource } from "./document-resource";
import { Badge } from "@/components/ui/badge";
import { InmuebleDetalle } from "@/lib/supabase/queries/propiedad_propietarios";


interface PropiedadesFichaProps {
  propiedades: InmuebleDetalle[] | []; // puede recibir null o array vacío
  loading: boolean;
  CheckRevision: any[];
  contratoId: number | null;
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
            Propiedad
          </CardTitle>
          <CardDescription>Selecciona un contrato para ver el detalle de la(s) propiedad(es).</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propiedad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!propiedades || propiedades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inmueble</CardTitle>
          <CardDescription>No se encontró información de las propiedades vinculadas al contrato.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="size-5 text-blue-600" />
            <span className="font-medium text-zinc-900 dark:text-zinc-50">Propiedades</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {propiedades.map((propiedad, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900 shadow-sm flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* <Badge className="bg-blue-500">
                      {propiedad.inmueble.conformidad?.tipo
                        ? `Conformidad: ${propiedad.inmueble.conformidad.tipo}`
                        : "Sin conformidad"}
                    </Badge> */}
                    <span className="text-base font-bold text-black">{propiedad.inmueble.n_partida}</span>
               
                    <span className="text-xs text-gray-400">#{propiedad.id_propiedad}</span>
                  </div>
                  <div className="relative">
                    <DocumentResource url={""} document={propiedad} type="inmueble" CheckRevision={CheckRevision} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <MapPin className="size-4" />
                  {propiedad.inmueble.direccion ?? "Sin dirección registrada"}
                </div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Captación" value={propiedad.inmueble.captacion_mes?.mes} />
                  <DetailField label="Tipo" value={propiedad.inmueble.tipo_propiedad?.tipo_propiedad} />
                  <DetailField label="Distrito" value={propiedad.inmueble.distritos?.distrito} />
                  <DetailField label="N° partida" boldValue={true} value={propiedad.inmueble.n_partida} />
                  <DetailField label="ID Remax" value={propiedad.inmueble.id_remax} />
                  <DetailField
                    label="Área terreno"
                    value={
                      propiedad.inmueble.area_terreno != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Ruler className="size-3.5" />
                          {propiedad.inmueble.area_terreno} m²
                        </span>
                      ) : null
                    }
                  />
                  <DetailField
                    label="Área construida"
                    value={
                      propiedad.inmueble.area_construida != null ? (
                        <span className="inline-flex items-center gap-1">
                          <Ruler className="size-3.5" />
                          {propiedad.inmueble.area_construida} m²
                        </span>
                      ) : null
                    }
                  />
                  <DetailField
                    label="Fotos"
                    value={propiedad.inmueble.fotos == null ? "—" : propiedad.inmueble.fotos ? "Disponibles" : "Pendientes"}
                  />
                  <DetailField
                    badge={true}
                    label="Fecha est Titulo"
                    value={formatDate(propiedad.inmueble.fecha_est_titulo)}
                  />
                  <DetailField label="Observacion" value={propiedad.inmueble.observacion} />
                </dl>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
