"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronRight, FileText, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentosRowDetalle, getDocumentosxEmitidos } from "@/lib/supabase/queries/documentos";

const COLORES: BadgeVariant[] = [
  "blue", "green", "red", "yellow", "amber", "pink",
  "violet", "indigo", "orange", "teal", "gray",
];

function estadoVariant(color?: string | null): BadgeVariant {
  const c = (color ?? "").toLowerCase() as BadgeVariant;
  return COLORES.includes(c) ? c : "gray";
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function formatFecha(value?: string | null, conHora = false) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return conHora
    ? d.toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })
    : d.toLocaleDateString("es", { dateStyle: "medium" });
}

function EstadoBadge({ doc }: { doc: DocumentosRowDetalle }) {
  return (
    <Badge variant={estadoVariant(doc.estado_documento?.color)}>
      {doc.estado_documento?.estado ?? "Sin estado"}
    </Badge>
  );
}

function Campo({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-zinc-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm">{value}</dd>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{titulo}</h3>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

/** Vista ampliada de Contratos: lista los documentos emitidos. */
export default function ContratosDashboard() {
  const [documentos, setDocumentos] = useState<DocumentosRowDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<DocumentosRowDetalle | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getDocumentosxEmitidos();
      setDocumentos(data ?? []);
    } catch (error: any) {
      setErrorMsg(error?.message || "No se pudieron cargar los contratos emitidos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Conteo por estado, para los filtros rápidos
  const estados = useMemo(() => {
    const mapa = new Map<string, { count: number; color?: string | null }>();
    documentos.forEach((d) => {
      const nombre = d.estado_documento?.estado ?? "Sin estado";
      const prev = mapa.get(nombre);
      mapa.set(nombre, { count: (prev?.count ?? 0) + 1, color: d.estado_documento?.color });
    });
    return Array.from(mapa.entries());
  }, [documentos]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return documentos.filter((d) => {
      const estado = d.estado_documento?.estado ?? "Sin estado";
      if (estadoFiltro && estado !== estadoFiltro) return false;
      if (!q) return true;
      return [d.nro_contrato, d.id_publico, d.asociados?.nombre_completo, estado, d.tipo_contrato?.tipo_contrato, d.operacion?.operacion]
        .some((v) => (v ?? "").toString().toLowerCase().includes(q));
    });
  }, [documentos, busqueda, estadoFiltro]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contratos emitidos</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {isLoading || errorMsg
              ? "Haz clic en un contrato para ver sus detalles."
              : `${filtrados.length} de ${documentos.length} contratos · Haz clic en uno para ver sus detalles`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nº, asociado, estado…"
              aria-label="Buscar contrato"
              className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 sm:w-72 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchData} aria-label="Actualizar" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {!isLoading && !errorMsg && estados.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por estado">
          <button
            type="button"
            onClick={() => setEstadoFiltro(null)}
            aria-pressed={estadoFiltro === null}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${estadoFiltro === null
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
          >
            Todos ({documentos.length})
          </button>
          {estados.map(([nombre, { count, color }]) => {
            const activo = estadoFiltro === nombre;
            return (
              <button
                key={nombre}
                type="button"
                onClick={() => setEstadoFiltro(activo ? null : nombre)}
                aria-pressed={activo}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${activo
                  ? "border-zinc-900 ring-1 ring-zinc-900 dark:border-zinc-100 dark:ring-zinc-100"
                  : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
              >
                <Badge variant={estadoVariant(color)} className="h-2.5 w-2.5 p-0" aria-hidden />
                {nombre} ({count})
              </button>
            );
          })}
          {(estadoFiltro || busqueda) && (
            <button
              type="button"
              onClick={() => {
                setEstadoFiltro(null);
                setBusqueda("");
              }}
              className="flex items-center gap-1 text-xs text-zinc-500 underline-offset-2 hover:underline"
            >
              <X className="h-3 w-3" /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>
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
        <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-zinc-500">
          <FileText className="h-8 w-8 text-zinc-300" />
          <p>No hay contratos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Nº contrato</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Fecha</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Asociado</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Estado</th>
                <th className="w-8 px-2 py-3">
                  <span className="sr-only">Ver detalle</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtrados.map((d, i) => (
                <tr
                  key={String(d.id ?? i)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalle del contrato ${d.nro_contrato}`}
                  onClick={() => setSeleccionado(d)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSeleccionado(d);
                    }
                  }}
                  className="group cursor-pointer transition-colors hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-zinc-900 dark:focus-visible:bg-zinc-900"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{formatValue(d.nro_contrato)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatFecha(d.fecha_generacion, true)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatValue(d.asociados?.nombre_completo)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <EstadoBadge doc={d} />
                  </td>
                  <td className="px-2 py-3 text-zinc-300 group-hover:text-zinc-500">
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!seleccionado}
        onOpenChange={(open) => !open && setSeleccionado(null)}
        preventOutsideClose={false}
      >
        <DialogContent className="max-h-[85vh] space-y-2 overflow-y-auto sm:max-w-xl">
          {seleccionado && (
            <>
              <DialogHeader className="pr-8">
                <DialogTitle className="text-lg">Contrato {seleccionado.nro_contrato}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2">
                  <EstadoBadge doc={seleccionado} />
                  <span>Código {formatValue(seleccionado.id_publico)}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 pt-2">
                <Seccion titulo="General">
                  <Campo label="Asociado" value={formatValue(seleccionado.asociados?.nombre_completo)} />

                  <Campo label="Tipo de contrato" value={formatValue(seleccionado.tipo_contrato?.tipo_contrato)} />
                  <Campo label="Operación" value={formatValue(seleccionado.operacion?.operacion)} />
                  <Campo label="Plazo" value={seleccionado.plazo != null ? `${seleccionado.plazo} días` : "—"} />
                  <Campo label="Nº propietarios" value={formatValue(seleccionado.nro_propietarios)} />
                  <Campo label="Empresa" value={formatValue(seleccionado.empresa)} />
                  <Campo label="Apoderado" value={formatValue(seleccionado.apoderado)} />
                </Seccion>

                <hr className="border-zinc-100 dark:border-zinc-800" />

                <Seccion titulo="Fechas">
                  <Campo label="Generación" value={formatFecha(seleccionado.fecha_generacion, true)} />
                </Seccion>

                {(seleccionado.descripcion ||
                  seleccionado.justificacion ||
                  seleccionado.motivo_ampliacion_plazo ||
                  seleccionado.motivo_anulacion) && (
                    <>
                      <hr className="border-zinc-100 dark:border-zinc-800" />
                      <Seccion titulo="Notas">
                        {seleccionado.descripcion && <Campo label="Descripción" value={seleccionado.descripcion} />}
                        {seleccionado.justificacion && <Campo label="Justificación" value={seleccionado.justificacion} />}
                        {seleccionado.motivo_ampliacion_plazo && (
                          <Campo label="Motivo de ampliación de plazo" value={seleccionado.motivo_ampliacion_plazo} />
                        )}
                        {seleccionado.motivo_anulacion && (
                          <Campo label="Motivo de anulación" value={seleccionado.motivo_anulacion} />
                        )}
                      </Seccion>
                    </>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
