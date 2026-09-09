"use client";

import React, { useState, useMemo } from "react";
import { Building2, Calendar, FileText, X, HandCoins } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContratoConPropiedad } from "@/lib/supabase/queries/contratos";
import { DetailField, formatCurrency, formatDate } from "./detail-field";
import { DocumentResource } from "./document-resource";
import { Badge } from "@/components/ui/badge";
import {
  calcularDiasDesdeEntrada,
  calcularDiasDesdeEntregado,
  calcularDiferenciaDias,
  calcularDiferenciaDiasSigi,
} from "@/utils/utils";

// Filtros posibles: por estado, tipo, nro_contrato, propiedad, operación
const estadosUnicos = (contratos: ContratoConPropiedad[]) =>
  Array.from(
    new Set(
      contratos
        .map((c) =>
          c.estado && c.estado.estado
            ? JSON.stringify({ estado: c.estado.estado, color: c.estado.color })
            : null,
        )
        .filter(Boolean),
    ),
  )
    .map((s) => JSON.parse(s as string))
    .filter((e) => e.estado);

const tiposUnicos = (contratos: ContratoConPropiedad[]) =>
  Array.from(
    new Set(contratos.map((c) => c.tipo_contrato?.tipo_contrato).filter(Boolean)),
  );

interface ContratosSectionProps {
  contratos: ContratoConPropiedad[];
  selectedContratoId: number | null;
  CheckRevision: any[];
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
  const [estadoFiltro, setEstadoFiltro] = useState<string | "">("");
  const [tipoFiltro, setTipoFiltro] = useState<string | "">("");
  const [nroFiltro, setNroFiltro] = useState<string>("");

  // Valores únicos para los filtros
  const estados = useMemo(() => estadosUnicos(contratos), [contratos]);
  const tipos = useMemo(() => tiposUnicos(contratos), [contratos]);

  const contratosFiltrados = useMemo(() => {
    return contratos.filter((contrato) => {
      let ok = true;
      if (estadoFiltro)
        ok = !!contrato.estado && contrato.estado.estado === estadoFiltro;
      if (tipoFiltro)
        ok = ok && !!contrato.tipo_contrato && contrato.tipo_contrato.tipo_contrato === tipoFiltro;
      if (nroFiltro)
        ok = ok && typeof contrato.nro_contrato === "string" && contrato.nro_contrato.toLowerCase().includes(nroFiltro.toLowerCase());
      return ok;
    });
  }, [contratos, estadoFiltro, tipoFiltro, nroFiltro]);

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
          <FileText className="size-5 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 font-semibold text-lg tracking-tight">
            Contratos
          </span>         
        </CardTitle>
        <CardDescription>
          {contratos.length === 0
            ? "Este asociado no tiene contratos registrados."
            : "Selecciona un contrato para ver la propiedad y los propietarios vinculados."}
        </CardDescription>
        {/* Filtros */}
        {contratos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Estado */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="">Todos los estados</option>
              {estados.map((e) => (
                <option value={e.estado} key={e.estado}>
                  {e.estado}
                </option>
              ))}
            </select>
            {/* Tipo Contrato */}
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="">Todos los tipos</option>
              {tipos.map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </select>
            {/* Número de Contrato */}
            <input
              type="text"
              placeholder="Buscar nro. contrato..."
              value={nroFiltro}
              onChange={(e) => setNroFiltro(e.target.value)}
              className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            {(estadoFiltro || tipoFiltro || nroFiltro) && (
              <button
                type="button"
                className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                onClick={() => {
                  setEstadoFiltro("");
                  setTipoFiltro("");
                  setNroFiltro("");
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </CardHeader>

      {contratosFiltrados.length > 0 ? (
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {contratosFiltrados.map((contrato, index) => {
            const propiedad = contrato.inmuebles;
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
                    <DocumentResource url={documentoUrl} document={contrato} type="contrato" CheckRevision={CheckRevision}></DocumentResource>
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
                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                      <HandCoins className="size-4 shrink-0" />
                      <span>Precio {contrato.tipo_moneda_precio_inicial?.simbolo} {contrato.precio_inicio}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                      <HandCoins className="size-4 shrink-0" />
                      <span>P.Venta:  {contrato.tipo_moneda_precio_venta?.simbolo} {contrato.precio_venta ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="size-4 shrink-0" />
                      <span>
                        Fecha:  {formatDate(contrato.fecha_inicio)} – {formatDate(contrato.fecha_fin)}
                      </span>
                    </div>

                    {propiedad && (
                      <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                        <Building2 className="size-4 shrink-0" />
                        <span className="truncate">
                          F.Contrato: {formatDate(contrato.fecha_contrato)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="size-4 shrink-0" />
                      <span>
                        F.C.Recibido: {formatDate(contrato.fecha_contrato_recibido)}
                      </span>

                    </div>
                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="size-4 shrink-0" />
                      <span>
                      F.C.Entregado: {formatDate(contrato.fecha_contrato_entregado)}
                    </span>        
                      {calcularDiferenciaDias(contrato) !== null && (
                        <Badge variant="outline" className="">
                          <strong>Días: {calcularDiferenciaDias(contrato)} {calcularDiferenciaDias(contrato) === 1 ? "día" : "días"}</strong> 
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
                    <Calendar className="size-4 shrink-0" />
                    <span>
                    F.C.Sigi: {formatDate(contrato.fecha_contrato_sigi)}
                    </span>
                    {calcularDiferenciaDiasSigi(contrato) !== null && (
                        <Badge variant="outline" className="">
                            <strong>Días: {calcularDiferenciaDiasSigi(contrato)} {calcularDiferenciaDiasSigi(contrato) === 1 ? "día" : "días"}</strong> 
                        </Badge>
                      )}
                       {calcularDiasDesdeEntregado(contrato) !== null && !contrato.fecha_contrato_sigi && (
                        <Badge variant="outline" className="">
                            <strong>Días: {calcularDiasDesdeEntregado(contrato)} {calcularDiasDesdeEntregado(contrato) === 1 ? "día" : "días"}</strong> 
                        </Badge>
                      )}
                        {(calcularDiasDesdeEntrada(contrato) !== null && !contrato.fecha_contrato_sigi) && (
                        <Badge variant="outline" className="">
                            <strong>Días: {calcularDiasDesdeEntrada(contrato)} {calcularDiasDesdeEntrada(contrato) === 1 ? "día" : "días"}</strong> 
                        </Badge>
                      )}
                 
                    </div>

                  </dl>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <DetailField label="Operación" value={contrato.operacion?.operacion ?? "—"} />
                    <DetailField
                      label="Comisión"
                      value={
                        contrato.tipo_moneda_comision?.simbolo === "%"
                          ? `${contrato.tipo_moneda_precio_inicial?.simbolo ?? "—"} ${((Number(contrato.precio_inicio) * Number(contrato.comision)) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` + ' ( ' +  `${contrato.comision} ${contrato.tipo_moneda_comision?.simbolo ?? "—"}` + ')'
                          : `${contrato.tipo_moneda_comision?.simbolo ?? "—"} ${contrato.comision}`
                      }
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </CardContent>
      ) : contratos.length === 0 ? null : (
        <CardContent>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No hay contratos que cumplan con el filtro seleccionado.</p>
        </CardContent>
      )}
      
    </Card>
  );
}
