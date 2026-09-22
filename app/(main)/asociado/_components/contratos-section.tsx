"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Calendar,
  FileText,
  HandCoins,
  RefreshCw,
  GitBranch,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ContratoConPropiedad } from "@/lib/supabase/queries/contratos";
import { DetailField, formatCurrency, formatDate } from "./detail-field";
import { DocumentResource } from "./document-resource";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calcularDiasDesdeEntrada,
  calcularDiasDesdeEntregado,
  calcularDiferenciaDias,
  calcularDiferenciaDiasSigi,
} from "@/utils/utils";

// Cuántos "grupos" (contratos sueltos o cadenas de renovación) se muestran por página
const PAGE_SIZE = 3;

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  // Cada vez que cambian los filtros (y por lo tanto los grupos resultantes),
  // reiniciamos la paginación a la primera página.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [estadoFiltro, tipoFiltro, nroFiltro]);

  const gruposVisibles = useMemo(
    () => grupos.slice(0, visibleCount),
    [grupos, visibleCount],
  );

  const hayMasPorMostrar = visibleCount < grupos.length;
  const restantes = grupos.length - visibleCount;

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
        <>
          <CardContent className="grid gap-3 grid-cols-1 sm:grid-cols-1 xl:grid-cols-3">
            {gruposVisibles.map((grupo) => {
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

              // Cadena de renovación: se muestra como una pila de tarjetas.
              // Abajo, una tarjeta con los datos que no cambian (tipo de
              // contrato y operación); arriba, apiladas, las tarjetas con
              // los datos propios de cada renovación (fechas, precios,
              // estado, comisión). Cada una se sigue seleccionando de forma
              // independiente.
              return (
                <RenewalStack
                  key={grupo.key}
                  items={grupo.items}
                  selectedContratoId={selectedContratoId}
                  onSelectContrato={onSelectContrato}
                  CheckRevision={CheckRevision}
                />
              );
            })}
          </CardContent>

          {/* Botones para desplegar/colapsar contratos-cadenas */}
          {(hayMasPorMostrar || visibleCount > PAGE_SIZE) && (
            <CardContent className="flex justify-center gap-2 pt-0">
              {hayMasPorMostrar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                  <Plus />
                  Mostrar más ({restantes} restante{restantes === 1 ? "" : "s"})
                </Button>
              )}
              {visibleCount > PAGE_SIZE && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleCount(PAGE_SIZE)}
                >
                  <Minus />
                  Colapsar
                </Button>
              )}
            </CardContent>
          )}
        </>
      ) : contratos.length === 0 ? null : (
        <CardContent>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">No hay contratos que cumplan con el filtro seleccionado.</p>
        </CardContent>
      )}
    </Card>
  );
}

// --- Pila de renovación ------------------------------------------------
//
// Muestra una cadena de renovación como un mazo de tarjetas: la tarjeta
// base (abajo) trae los datos compartidos por toda la cadena (tipo de
// contrato y operación, que no cambian entre renovaciones). Sobre ella se
// apila una tarjeta por cada contrato de la cadena, mostrando sólo lo que
// cambia (nro., fechas, precios, estado, comisión). La más reciente queda
// al frente; las anteriores asoman detrás y se puede hacer clic para
// traerlas al frente y seleccionarlas.

interface RenewalStackProps {
  items: ContratoConPropiedad[];
  selectedContratoId: number | null;
  onSelectContrato: (id_contrato: number, id_propiedad: number) => void;
  CheckRevision: any[];
}

function RenewalStack({
  items,
  selectedContratoId,
  onSelectContrato,
  CheckRevision,
}: RenewalStackProps) {
  // El contrato más reciente queda al frente por defecto.
  const [frontIndex, setFrontIndex] = useState(items.length - 1);

  // Si la cadena o su orden cambia (por ejemplo, tras refiltrar), evitamos
  // quedar apuntando a un índice fuera de rango.
  useEffect(() => {
    setFrontIndex(items.length - 1);
  }, [items]);

  const bringToFront = (i: number) => {
    setFrontIndex(i);
    onSelectContrato(items[i].id_contrato, items[i].id_propiedad);
  };

  const maxDistancia = items.length - 1;
  // Alto de la "pestaña" que asoma por cada contrato anterior en la pila.
  // Se deja casi toda la fila a la vista (el alto de la pestaña es h-11 =
  // 44px) para que el número de contrato se lea sin tener que traerla al frente.
  const PEEK = 50;

  // Tipo de contrato y operación no siempre se mantienen entre renovaciones:
  // sólo van en la tarjeta base (compartida) si son iguales en toda la
  // cadena. Si cambian en algún punto, se muestran en la tarjeta de arriba,
  // junto con el resto de los datos que sí varían.
  const tipoEsConstante = items.every(
    (it) => it.tipo_contrato?.tipo_contrato === items[0].tipo_contrato?.tipo_contrato,
  );
  const operacionEsConstante = items.every(
    (it) => it.operacion?.operacion === items[0].operacion?.operacion,
  );

  const primero = items[0];
  const ultimo = items[items.length - 1];
  const hayDatosFijos = tipoEsConstante || operacionEsConstante;

  return (
    <div className="">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300">
          <GitBranch className="size-3.5 shrink-0" />
          <span>Cadena de renovación · {items.length} contratos</span>
        </div>
        <div>
        · 
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500 dark:border-blue-900/40 dark:text-zinc-400">
          <Calendar className="size-3.5 shrink-0" />
          <span>
            {formatDate(primero.fecha_inicio)} → {formatDate(ultimo.fecha_fin)}
          </span>
        </div>
      </div>
 
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-3 dark:border-blue-900/50 dark:bg-blue-950/10 sm:p-4 lg:flex-row lg:items-start">
        {/* <RenewalBaseCard
          items={items}
          tipoEsConstante={tipoEsConstante}
          operacionEsConstante={operacionEsConstante}
        />   */}
        {/* Pila: el contrato vigente/enfocado va al frente, tapando a los
            anteriores casi por completo. Los anteriores asoman por ARRIBA,
            cada uno un poco más alto que el que tiene delante, como un
            fajo de documentos. */}
        <div
          className="relative flex-1"
          style={{ paddingTop: maxDistancia * PEEK }}
        >
          {items.map((contrato, i) => {
            const isFront = i === frontIndex;

            if (isFront) {
              return (
                <div key={contrato.id_contrato} className="relative" style={{ zIndex: items.length + 1 }}>
                  <ContratoCard
                    contrato={contrato}
                    isSelected={selectedContratoId === contrato.id_contrato}
                    onSelectContrato={onSelectContrato}
                    CheckRevision={CheckRevision}
                    inChain
                    stackVariant
                    stackPosition={i + 1}
                    stackTotal={items.length}
                    hideTipoContrato={tipoEsConstante}
                    hideOperacion={operacionEsConstante}
                  />
                </div>
              );
            }

            const distancia = Math.abs(i - frontIndex);

            return (
              <button
                key={contrato.id_contrato}
                type="button"
                onClick={() => bringToFront(i)}
                title="Ver este contrato"
                className="absolute inset-x-0 flex h-15 items-center justify-between gap-2 rounded-t-xl border border-zinc-200 bg-white px-3.5 text-left transition-all duration-300 ease-out hover:brightness-95 dark:border-zinc-800 dark:bg-zinc-900"
                style={{
                  top: (maxDistancia - distancia) * PEEK,
                  zIndex: items.length - distancia,
                  opacity: Math.max(1 - distancia * 0.06, 0.85),
                }}
              >
                {/* Bloque de la información principal de la pestaña */}
                <span className="flex min-w-0 items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  {/* Número del contrato en círculo */}
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200">
                    {i + 1}
                  </span>
                  {/* Nro de contrato o fallback */}
                  <span className="truncate">
                    C: {contrato.nro_contrato || `Contrato #${contrato.id_contrato}`}
                  </span>
                  {/* Fecha inicio */}
                  {/* <span className="shrink-0 text-zinc-400 dark:text-zinc-500">
                    · {formatDate(contrato.fecha_inicio)}
                  </span> */}
                  {/* Datos fijos en la cadena */}
                  {/* {hayDatosFijos && (
                    <span className="gap-2.5 text-sm flex items-center">
                      {tipoEsConstante && (
                        <Badge variant="secondary">
                          {primero.tipo_contrato?.tipo_contrato ?? "No definido"}
                        </Badge>
                      )}
                      {operacionEsConstante && (
                        <Badge variant={primero.operacion?.color}>
                          {primero.operacion?.operacion ?? "—"}
                        </Badge>
                      )}
                    </span>
                  )} */}
                </span>

                {/* Chevron para indicar "expandir/ver" */}
                <ChevronRight className="size-4 shrink-0 text-zinc-400" />
              </button>

            );
          })}
        </div>
      </div>
    </div>
  );
}

// Tarjeta "base" de una cadena de renovación: sólo los datos que
// realmente se mantienen iguales en toda la cadena. Tipo de contrato y
// operación pueden cambiar de una renovación a otra, así que sólo
// aparecen acá cuando de verdad no cambiaron; si no, quedan en la
// tarjeta de arriba junto con el resto de los datos variables.
function RenewalBaseCard({
  items,
  tipoEsConstante,
  operacionEsConstante,
}: {
  items: ContratoConPropiedad[];
  tipoEsConstante: boolean;
  operacionEsConstante: boolean;
}) {
  const primero = items[0];
  const ultimo = items[items.length - 1];
  const hayDatosFijos = tipoEsConstante || operacionEsConstante;

  return (
    <div className=" bg-white/70 p-4 dark:border-blue-900/40 dark:bg-zinc-950/40">
      <div className="">
        {hayDatosFijos && (
          <dl className=" gap-2.5 text-sm">
            {tipoEsConstante && (
              <DetailField
                label="Tipo de contrato"
                value={primero.tipo_contrato?.tipo_contrato ?? "No definido"}
              />
            )}
            {operacionEsConstante && (
              <DetailField
                badge={true}
                badgeVariant={primero.operacion?.color}
                label="Operación"
                value={primero.operacion?.operacion ?? "—"}
              />
            )}
          </dl>
        )}
      </div>
      <div className="text-xs text-zinc-500 dark:border-blue-900/40 dark:text-zinc-400">
        <Calendar className="size-3.5 shrink-0" />
        <span>
          {formatDate(primero.fecha_inicio)} → {formatDate(ultimo.fecha_fin)}
        </span>
      </div>
    </div>
  );
}

// --- Tarjeta individual de contrato -----------------------------------------
//
// Se usa tanto para contratos sueltos como para el contrato al frente de
// una pila de renovación. `inChain` sólo oculta la pista redundante
// "R: ..." (la relación ya se ve por la pila/base). `stackVariant` además
// oculta el tipo de contrato y la operación, porque esos datos ya se
// muestran una sola vez en la tarjeta base de la pila, y agrega un
// indicador de qué lugar ocupa este contrato dentro de la cadena.

interface ContratoCardProps {
  contrato: ContratoConPropiedad;
  isSelected: boolean;
  onSelectContrato: (id_contrato: number, id_propiedad: number) => void;
  CheckRevision: any[];
  inChain?: boolean;
  stackVariant?: boolean;
  stackPosition?: number;
  stackTotal?: number;
  hideTipoContrato?: boolean;
  hideOperacion?: boolean;
}

function ContratoCard({
  contrato,
  isSelected,
  onSelectContrato,
  CheckRevision,
  inChain = false,
  stackVariant = false,
  stackPosition,
  stackTotal,
  hideTipoContrato = false,
  hideOperacion = false,
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
          ? "border-blue-500 bg-blue-50/100 ring-2 ring-blue-500/20 dark:border-blue-400 dark:bg-blue-950/30"
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
            <span className="text-base text-gray-800">C: {contrato.nro_contrato}</span>
       
              <span className="text-xs text-gray-400"> #{contrato.id_contrato}
                {/* {stackVariant && stackTotal && stackTotal > 1 && (
                  <Badge variant="outline" className="mx-2 text-[10px]">
                    {stackPosition === stackTotal ? "Vigente" : `Renovación ${stackPosition}/${stackTotal}`}
                  </Badge>
                )} */}
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
            <Badge variant={"outline"}>
              {contrato.tipo_contrato?.tipo_contrato}
            </Badge>
       
            {/* {!hideTipoContrato && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {contrato.tipo_contrato?.tipo_contrato ?? "No definido"}
              </p>
            )} */}
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
          <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
            <Calendar className="size-4 shrink-0" />
            <span>
              Observaciones: {formatDate(contrato.observaciones)}
            </span>

          </div>
        </dl>
        <div
          className={cn(
            "mt-3 grid gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800",
            hideOperacion ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {!hideOperacion && (
            <DetailField badge={true} badgeVariant={contrato.operacion?.color} label="Operación" value={contrato.operacion?.operacion ?? "—"} />
          )}
          <DetailField
            label="Comisión"
            boldValue={true}
            textColorClass="text-green-700"
            value={calcularComision(contrato)}
          />
        </div>
      </button>
    </div>
  );
}
