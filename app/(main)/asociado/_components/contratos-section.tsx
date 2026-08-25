"use client";

import React, { useState } from "react";
import { Building2, Calendar, FileText, X, HandCoins } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContratoConPropiedad } from "@/lib/supabase/queries/contratos";
import { DetailField, formatCurrency, formatDate } from "./detail-field";
import { DocumentResource } from "./document-resource";

interface ContratosSectionProps {
  contratos: ContratoConPropiedad[];
  selectedContratoId: number | null;
  onSelectContrato: (id_contrato: number, id_propiedad: number) => void;
  loading: boolean;
}

export function ContratosSection({
  contratos,
  selectedContratoId,
  onSelectContrato,
  loading,
}: ContratosSectionProps) {
  // Estado para mostrar la imagen del documento seleccionado
  const [docOpenId, setDocOpenId] = useState<number | null>(null);

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
          <FileText className="size-5 text-indigo-600" />
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
                  "relative rounded-xl border p-4 text-left transition-all hover:border-indigo-300 hover:shadow-sm dark:hover:border-indigo-700",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20 dark:border-indigo-400 dark:bg-indigo-950/30"
                    : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
                )}
              >
                {/* Nuevo botón con icono de documento en la esquina superior derecha */}
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                  title={
                    documentoUrl
                      ? "Ver documento"
                      : "Sin documento disponible"
                  }
                  disabled={!documentoUrl}
                  style={documentoUrl ? {} : { opacity: 0.5, cursor: "not-allowed" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (documentoUrl) setDocOpenId(contrato.id_contrato);
                  }}
                >
                  <FileText className="size-4" />
                </button>
                <DocumentResource url={documentoUrl} document={contrato}></DocumentResource>

                {/* Card body button para selección */}
                <button
                  type="button"
                  onClick={() => onSelectContrato(contrato.id_contrato, contrato.id_propiedad)}
                  className="w-full text-left focus:outline-none"
                  tabIndex={-1}
                  // Quita estilos de botón para anidar dentro del div
                  style={{ all: "unset", display: "block", cursor: "pointer" }}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        Contrato
                        <span className="text-xs text-gray-400"> #{contrato.id_contrato}</span>
                      </p>
                      <p>
                        <span className="text-xs text-gray-800">{contrato.nro_contrato}</span>
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {contrato.tipo_contrato?.tipo_contrato ?? "No definido"}
                      </p> 
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        contrato.estado
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
                      )}
                    >
                      {contrato.estado ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <dl className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <HandCoins className="size-4 shrink-0" />
                      <span>P.P. {contrato.tipo_moneda?.simbolo} {contrato.precio}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <HandCoins className="size-4 shrink-0" />
                      <span>P.F. {contrato.tipo_moneda?.simbolo} {contrato.precio_operacion}</span>
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
                          {formatDate(propiedad.captacion)}
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
