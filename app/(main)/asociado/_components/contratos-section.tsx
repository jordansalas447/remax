"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Calendar,
  FileText,
  HandCoins,
  RefreshCw,
  GitBranch,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
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

// --- Lógica de agrupación de cadenas de renovación -------------------------
//
// Un contrato puede referenciar, vía `renovacion_contrato`, al contrato que
// renueva. Aquí construimos "cadenas": conjuntos de contratos emparentados
// por renovación, para poder mostrarlos unidos visualmente sin perder la
// posibilidad de seleccionar cada uno de forma independiente.

function getParentId(
  contrato: ContratoConPropiedad,
  allContratos: ContratoConPropiedad[],
): number | null {
  const rc = (contrato as any).renovacion_contrato;
  if (!rc) return null;
  if (typeof rc.id_contrato === "number") return rc.id_contrato;
  // Fallback por si el join no trae el id, sólo el nro_contrato
  if (rc.nro_contrato) {
    const match = allContratos.find((c) => c.nro_contrato === rc.nro_contrato);
    if (match) return match.id_contrato;
  }
  return null;
}

function calcularComision(contrato: {
  precio_inicio?: number | string | null,
  precio_venta?: number | string | null,
  comision?: number | string | null,
  tipo_moneda_comision?: { simbolo: string } | null,
  tipo_moneda_precio_inicial?: { simbolo: string } | null,
  tipo_moneda_precio_venta?: { simbolo: string } | null,
  conformidad?: { id: number } | null
}): string {
  // Determinar si hay precio de venta
  const tienePrecioVenta =
    contrato.precio_venta != null &&
    contrato.precio_venta !== "" &&
    !isNaN(Number(contrato.precio_venta));

  const precioBaseNum = tienePrecioVenta
    ? Number(contrato.precio_venta)
    : Number(contrato.precio_inicio);

  const simboloComision = contrato.tipo_moneda_comision?.simbolo;
  const simboloPrecio = tienePrecioVenta
    ? contrato.tipo_moneda_precio_venta?.simbolo
    : contrato.tipo_moneda_precio_inicial?.simbolo;

  const comisionNum = Number(contrato.comision);
  const esConformidad6 = contrato.conformidad?.id === 6;

  if (simboloComision === "%") {
    if (
      (tienePrecioVenta
        ? contrato.precio_venta == null
        : contrato.precio_inicio == null) ||
      contrato.comision == null ||
      isNaN(precioBaseNum) ||
      isNaN(comisionNum)
    ) {
      return "—";
    }
    const valorPrev = ((precioBaseNum * comisionNum) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (esConformidad6) {
      return `${simboloPrecio ?? "—"} ${valorPrev} ( ${contrato.comision} ${simboloComision ?? "—"} )`;
    }
    return `Aprox. ${simboloPrecio ?? "—"} ${valorPrev} ( ${contrato.comision} ${simboloComision ?? "—"} )`;
  } else {
    if (contrato.comision == null || isNaN(comisionNum)) {
      return "—";
    }
    if (esConformidad6) {
      return `${simboloComision ?? "—"} ${contrato.comision} ( Fijo )`;
    }
    return `Aprox. ${simboloComision ?? "—"} ${contrato.comision} ( Fijo )`;
  }
}

interface RenewalGroup {
  key: string;
  items: ContratoConPropiedad[];
}

function buildRenewalGroups(
  filtered: ContratoConPropiedad[],
  allContratos: ContratoConPropiedad[],
): RenewalGroup[] {
  const byId = new Map<number, ContratoConPropiedad>(
    allContratos.map((c) => [c.id_contrato, c]),
  );

  const rootCache = new Map<number, number>();
  const getRootId = (id: number, visited = new Set<number>()): number => {
    if (rootCache.has(id)) return rootCache.get(id)!;
    const contrato = byId.get(id);
    if (!contrato || visited.has(id)) return id;
    visited.add(id);
    const parentId = getParentId(contrato, allContratos);
    const root = parentId != null && byId.has(parentId) ? getRootId(parentId, visited) : id;
    rootCache.set(id, root);
    return root;
  };

  const order: number[] = [];
  const groups = new Map<number, ContratoConPropiedad[]>();

  for (const contrato of filtered) {
    const root = getRootId(contrato.id_contrato);
    if (!groups.has(root)) {
      groups.set(root, []);
      order.push(root);
    }
    groups.get(root)!.push(contrato);
  }

  return order.map((root) => {
    const items = [...groups.get(root)!].sort((a, b) => {
      const da = a.fecha_inicio ? new Date(a.fecha_inicio).getTime() : 0;
      const db = b.fecha_inicio ? new Date(b.fecha_inicio).getTime() : 0;
      return da - db || a.id_contrato - b.id_contrato;
    });
    return { key: String(root), items };
  });
}

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

  const grupos = useMemo(
    () => buildRenewalGroups(contratosFiltrados, contratos),
    [contratosFiltrados, contratos],
  );

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
        <CardContent className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {grupos.map((grupo) => {
            if (grupo.items.length === 1) {
              const contrato = grupo.items[0];
              return (
                <ContratoCard
                  key={contrato.id_contrato}
                  contrato={contrato}
                  isSelected={selectedContratoId === contrato.id_contrato}
                  onSelectContrato={onSelectContrato}
                  CheckRevision={CheckRevision}
                />
              );
            }

            // Cadena de renovación: varios contratos emparentados, unidos
            // visualmente por una línea de tiempo, pero cada uno se
            // selecciona de forma completamente independiente.
            return (
              <div
                key={grupo.key}
                className="col-span-1 sm:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-3 dark:border-blue-900/50 dark:bg-blue-950/10 sm:p-4"
              >
                <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                  <GitBranch className="size-3.5 shrink-0" />
                  <span>Cadena de renovación · {grupo.items.length} contratos</span>
                </div>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:gap-3">
                  {grupo.items.map((contrato, i) => (
                    <React.Fragment key={contrato.id_contrato}>
                      <div className="min-w-0 flex-1 lg:min-w-[260px]">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-blue-600/80 dark:text-blue-400/80">
                          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white dark:bg-blue-500">
                            {i + 1}
                          </span>
                          <span>Desde {formatDate(contrato.fecha_inicio)}</span>
                        </div>
                        <ContratoCard
                          contrato={contrato}
                          isSelected={selectedContratoId === contrato.id_contrato}
                          onSelectContrato={onSelectContrato}
                          CheckRevision={CheckRevision}
                          inChain
                        />
                      </div>
                      {i < grupo.items.length - 1 && (
                        <div className="flex items-center justify-center text-blue-300 dark:text-blue-700 lg:pt-8">
                          <ChevronDown className="size-4 lg:hidden" />
                          <ChevronRight className="hidden size-4 lg:block" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
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

// --- Tarjeta individual de contrato -----------------------------------------
//
// Se usa tanto para contratos sueltos como para cada miembro de una cadena
// de renovación. `inChain` sólo oculta la pista redundante "R: ..." ya que,
// dentro de una cadena, la relación ya se muestra con la línea de tiempo.

interface ContratoCardProps {
  contrato: ContratoConPropiedad;
  isSelected: boolean;
  onSelectContrato: (id_contrato: number, id_propiedad: number) => void;
  CheckRevision: any[];
  inChain?: boolean;
}

function ContratoCard({
  contrato,
  isSelected,
  onSelectContrato,
  CheckRevision,
  inChain = false,
}: ContratoCardProps) {
  const propiedad = contrato.inmuebles;
  // Si hay recurso, debería estar en contrato.resources?.url_resource
  const documentoUrl: string | undefined =
    (contrato as any).resources?.url_resource ||
    (contrato as any).resource?.url_resource; // Por compat

  return (
    <div
      className={cn(
        "relative h-full rounded-xl border p-4 text-left transition-all hover:border-blue-300 hover:shadow-sm dark:hover:border-blue-700",
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
                {contrato.conformidad?.tipo ? (
                  <Badge
                    className="mx-2"
                    variant={contrato.conformidad?.color}
                  >
                    {contrato.conformidad.tipo}
                  </Badge>
                ) :
                  <Badge
                    className="mx-2"
                    style={
                      contrato.estado?.color
                        ? { backgroundColor: contrato.estado.color, color: "#fff" }
                        : undefined
                    }
                  >
                    {contrato.estado.estado}
                  </Badge>}
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
          {!inChain && contrato.renovacion_contrato?.nro_contrato && (
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <RefreshCw className="size-4 shrink-0" />
              <span>R: {contrato.renovacion_contrato.nro_contrato}</span>
            </div>
          )}
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

          {/* {propiedad && (
            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <Building2 className="size-4 shrink-0" />
              <span className="truncate">
                F.Contrato: {formatDate(contrato.fecha_contrato)}
              </span>
            </div>
          )} */}

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
          <DetailField badge={true} badgeVariant={contrato.operacion?.color} label="Operación" value={contrato.operacion?.operacion ?? "—"} />
          <DetailField
            label="Comisión"
            boldValue={true}
            textColorClass="text-green-700"
            value={calcularComision(contrato) }
          />
        </div>
      </button>
    </div>
  );
}