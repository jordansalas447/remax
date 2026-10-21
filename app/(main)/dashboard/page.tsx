"use client";

import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getLlamadasPropietarios, LlamadasRowDetalle } from "@/lib/supabase/queries/llamadas";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale/es";
import { CalendarIcon, Phone, RefreshCw, Search, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const ESTADO_PENDIENTE = "Pendiente";

function formatFecha(value?: string | null) {
  if (!value) return null;
  const d = parseISO(value);
  return isValid(d) ? format(d, "d MMM yyyy", { locale: es }) : value;
}

function toISODate(d: Date) {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function DashboardPage() {
  const [resumen, setResumen] = useState<LlamadasRowDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [estadoActivo, setEstadoActivo] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const filtros = selectedDate ? { fecha_registro: toISODate(selectedDate) } : undefined;
      const data = await getLlamadasPropietarios(filtros);
      setResumen(data || []);
    } catch (error: any) {
      setErrorMsg(error?.message || "No se pudo cargar la información del dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Un chip por estado, con su conteo y el color que ya trae la fila
  const estados = useMemo(() => {
    const map = new Map<string, { count: number; color?: string }>();
    resumen.forEach((r) => {
      const key = r.estado_llamada ?? ESTADO_PENDIENTE;
      const prev = map.get(key);
      map.set(key, { count: (prev?.count ?? 0) + 1, color: prev?.color ?? (r.color as string) });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  }, [resumen]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return resumen.filter((r) => {
      const estado = r.estado_llamada ?? ESTADO_PENDIENTE;
      if (estadoActivo && estado !== estadoActivo) return false;
      if (!q) return true;
      return [r.propietario, r.asociado].some((v) => v?.toLowerCase().includes(q));
    });
  }, [resumen, estadoActivo, busqueda]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Encabezado + filtros */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Llamadas a Propietarios
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {selectedDate
              ? `Registros del ${format(selectedDate, "PPP", { locale: es })}`
              : "Todos los registros"}
            {!isLoading && !errorMsg && ` · ${filtrados.length} de ${resumen.length}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar propietario o asociado"
              aria-label="Buscar propietario o asociado"
              className="h-9 w-64 rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-[210px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Fecha de registro"}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d);
                  setOpen(false);
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedDate(undefined)}>
              <X className="mr-1 h-4 w-4" />
              Quitar fecha
            </Button>
          )}
        </div>
      </header>

      {/* Resumen por estado: sirve también como filtro */}
      {!isLoading && !errorMsg && estados.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado de llamada">
          <button
            type="button"
            onClick={() => setEstadoActivo(null)}
            aria-pressed={estadoActivo === null}
            className={cn(
              "rounded-full border px-3 py-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              estadoActivo === null
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}
          >
            Todas <span className="ml-1 tabular-nums opacity-70">{resumen.length}</span>
          </button>
          {estados.map(([estado, { count, color }]) => {
            const activo = estadoActivo === estado;
            return (
              <button
                key={estado}
                type="button"
                onClick={() => setEstadoActivo(activo ? null : estado)}
                aria-pressed={activo}
                className={cn(
                  "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  activo
                    ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800"
                    : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                )}
              >
                <Badge variant={color as BadgeVariant} className="rounded-full px-2 py-0.5">
                  {estado}
                </Badge>
                <span className="tabular-nums text-zinc-600 dark:text-zinc-300">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Contenido */}
      {isLoading ? (
        <SkeletonGrid />
      ) : errorMsg ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          <p>{errorMsg}</p>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <Phone className="h-6 w-6 text-zinc-400" />
          <p className="font-medium text-zinc-800 dark:text-zinc-100">No hay llamadas para mostrar</p>
          <p className="text-sm text-zinc-500">
            {resumen.length > 0
              ? "Prueba con otro estado o con otra búsqueda."
              : "Cambia la fecha de registro o quita el filtro para ver más resultados."}
          </p>
          {(selectedDate || estadoActivo || busqueda) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setSelectedDate(undefined);
                setEstadoActivo(null);
                setBusqueda("");
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((row, idx) => (
            <LlamadaCard key={(row as any).id ?? idx} row={row} />
          ))}
        </ul>
      )}
    </main>
  );
}

function LlamadaCard({ row }: { row: LlamadasRowDetalle }) {
  const detalles = [row.tipo_propiedad, row.tipo_negocio, row.modalidad].filter(Boolean) as string[];

  const hitos = [
    { label: "Bienvenida", value: formatFecha(row.fecha_bienvenida) },
    { label: "Contrato recibido", value: formatFecha(row.fecha_contrato_recibido) },
    { label: "Registro", value: formatFecha(row.fecha_registro) },
  ];

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {row.propietario ?? "Propietario sin nombre"}
          </p>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            Asociado: {row.asociado ?? "sin asignar"}
          </p>
        </div>
        <Badge variant={row.color as BadgeVariant} className="shrink-0 rounded-full px-2.5 py-0.5 font-medium">
          {row.estado_llamada ?? ESTADO_PENDIENTE}
        </Badge>
      </div>

      {detalles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {detalles.map((d) => (
            <span
              key={d}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {d}
            </span>
          ))}
        </div>
      )}

      {/* Los tres hitos sí forman una secuencia: bienvenida → contrato → registro */}
      <ol className="relative space-y-3 border-l border-zinc-200 pl-4 dark:border-zinc-700">
        {hitos.map((h) => (
          <li key={h.label} className="relative flex items-baseline justify-between gap-2 text-sm">
            <span
              aria-hidden
              className={cn(
                "absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white dark:bg-zinc-900",
                h.value ? "border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400" : "border-zinc-300 dark:border-zinc-600"
              )}
            />
            <span className="text-zinc-500 dark:text-zinc-400">{h.label}</span>
            <span
              className={cn(
                "tabular-nums",
                h.value ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"
              )}
            >
              {h.value ?? "Pendiente"}
            </span>
          </li>
        ))}
      </ol>
    </li>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Cargando datos">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}