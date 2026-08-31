"use client";

import React, { useState } from "react";
import { Building2, Calendar, FileText, X, HandCoins } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContratoConPropiedad } from "@/lib/supabase/queries/contratos";
import { DetailField, formatCurrency, formatDate } from "./detail-field";
import { DocumentResource } from "./document-resource";
import { Badge } from "@/components/ui/badge";

interface ContratosSectionProps {
  contratos: ContratoConPropiedad[];
  selectedContratoId: number | null;
  CheckRevision:any[]
  onSelectContrato: (id_contrato: number, id_propiedad: number) => void;
  loading: boolean;
}

export function ContratosSection({
  contratos,
  selectedContratoId,
  CheckRevision,
  onSelectContrato,
  loading,
}: ContratosSectionProps) {
  // Estado para mostrar la imagen del documento seleccionado
    //console.log(CheckRevision)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contratos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-blue-600" />
          Contratos
        </CardTitle>
        <CardDescription>
          {contratos.length === 0
            ? "Este asociado no tiene contratos registrados."
            : "Selecciona un contrato para ver la propiedad y los propietarios vinculados."}
        </CardDescription>
      </CardHeader>

      {contratos.length > 0 && (
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {contratos.map((contrato,index) => {
            const propiedad = contrato.propiedades;
            const isSelected = selectedContratoId === contrato.id_contrato;
            // Si hay recurso, debería estar en contrato.resources?.url_resource
            const documentoUrl: string | undefined =
              (contrato as any).resources?.url_resource ||
              (contrato as any).resource?.url_resource; // Por compat

            return (
              <div
                key={contrato.id_contrato}
                className={cn(
                  "relative rounded-xl border p-4 text-left transition-all hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700",
                  isSelected
                    ? "border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950/30"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
                )}
              >
                {/* Nuevo botón con icono de documento en la esquina superior derecha */}
                <div className="relative">
                  <div className="absolute right-0">
                  <DocumentResource  url={documentoUrl} document={contrato} type="contrato" CheckRevision={CheckRevision}></DocumentResource>
                  </div>
                </div>

                {/* Card body button para selección */}
                <button
                  type="button"
                  onClick={() => onSelectContrato(contrato.id_contrato, contrato.id_propiedad)}
                  className="w-full text-left focus:outline-none w-full!"
                  tabIndex={-1}
                  // Quita estilos de botón para anidar dentro del div
                  style={{ all: "unset", display: "block", cursor: "pointer" }}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">
                        Contrato
                        <span className="text-xs text-gray-400"> #{contrato.id_contrato}
                        <Badge
                          className="mx-2"
                          style={
                            contrato.estado?.color
                              ? { backgroundColor: contrato.estado.color, color: "#fff" }
                              : undefined
                          }
                        >
                          {contrato.estado?.estado}
                        </Badge>
                   
                        </span>
                      

                      </div>

                      <p>
                        <span className="text-xs text-gray-800">{contrato.nro_contrato}</span>
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {contrato.tipo_contrato?.tipo_contrato ?? "No definido"}
                      </p> 
                    </div>
                  </div>

                  <dl className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <HandCoins className="size-4 shrink-0" />
                      <span>Precio {contrato.tipo_moneda_precio_inicial?.simbolo} {contrato.precio_inicio} - {contrato.tipo_moneda_precio_maximo?.simbolo} {contrato.precio_maximo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <HandCoins className="size-4 shrink-0" />
                      <span>P.Venta {contrato.tipo_moneda_precio_venta?.simbolo} {contrato.precio_venta}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="size-4 shrink-0" />
                      <span>
                        {formatDate(contrato.fecha_inicio)} – {formatDate(contrato.fecha_fin)}
                      </span>
                    </div>
                    {propiedad && (
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                        <Building2 className="size-4 shrink-0" />
                        <span className="truncate">
                          {formatDate(contrato.fecha_contrato)}
                        </span>
                      </div>
                    )}
                  </dl>

                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <DetailField label="Operación" value={contrato.operacion?.operacion ?? "—"} />
                    <DetailField
                      label="Comisión"
                      value={`${contrato.tipo_moneda_comision?.simbolo ?? "—"} ${contrato.comision}`}
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
