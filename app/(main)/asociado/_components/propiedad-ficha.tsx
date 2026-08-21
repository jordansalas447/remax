"use client";

import { Home, MapPin, Ruler } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropiedadDetalle } from "@/lib/supabase/queries/propiedades";
import { DetailField } from "./detail-field";

interface PropiedadFichaProps {
  propiedad: PropiedadDetalle | null;
  loading: boolean;
  contratoId: number | null;
}

export function PropiedadFicha({ propiedad, loading, contratoId }: PropiedadFichaProps) {
  if (!contratoId) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="size-5 text-indigo-600" />
            Propiedad
          </CardTitle>
          <CardDescription>Selecciona un contrato para ver el detalle de la propiedad.</CardDescription>
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

  if (!propiedad) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propiedad</CardTitle>
          <CardDescription>No se encontró información de la propiedad vinculada al contrato.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="size-5 text-indigo-600" />
          <p className="font-medium text-zinc-900 dark:text-zinc-50"> Propiedad  <span className="text-xs text-gray-400"> #{propiedad.id_propiedad}</span> </p>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <MapPin className="size-4" />
          {propiedad.direccion ?? "Sin dirección registrada"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailField label="Captación" value={propiedad.captacion} />
          <DetailField label="Estado" value={propiedad.estado} />
          <DetailField label="Tipo" value={propiedad.tipo_propiedad?.tipo_propiedad} />
          <DetailField label="Distrito" value={propiedad.distritos?.distrito} />
          <DetailField label="N° partida" value={propiedad.n_partida} />
          <DetailField label="ID Remax" value={propiedad.id_remax} />
          <DetailField
            label="Área terreno"
            value={
              propiedad.area_terreno != null ? (
                <span className="inline-flex items-center gap-1">
                  <Ruler className="size-3.5" />
                  {propiedad.area_terreno} m²
                </span>
              ) : null
            }
          />
          <DetailField
            label="Área construida"
            value={
              propiedad.area_construida != null ? (
                <span className="inline-flex items-center gap-1">
                  <Ruler className="size-3.5" />
                  {propiedad.area_construida} m²
                </span>
              ) : null
            }
          />
          <DetailField label="Descripción" value={propiedad.descripcion} className="sm:col-span-2" />
          <DetailField
            label="Fotos"
            value={propiedad.fotos == null ? "—" : propiedad.fotos ? "Disponibles" : "Pendientes"}
          />
        </dl>
      </CardContent>
    </Card>
  );
}
