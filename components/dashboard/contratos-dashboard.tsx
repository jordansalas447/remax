"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDocumentosxEmitidos } from "@/lib/supabase/queries/documentos";

type DocumentoEmitido = Record<string, unknown>;

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Vista ampliada de Contratos: lista los documentos emitidos (v_documentos). */
export default function ContratosDashboard() {
  const [documentos, setDocumentos] = useState<DocumentoEmitido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

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

  // Las columnas se toman de la vista, así se adapta a lo que devuelva
  const columnas = useMemo(
    () => (documentos[0] ? Object.keys(documentos[0]) : []),
    [documentos],
  );

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return documentos;
    return documentos.filter((d) =>
      Object.values(d).some((v) => formatCell(v).toLowerCase().includes(q)),
    );
  }, [documentos, busqueda]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contratos emitidos</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {!isLoading && !errorMsg && `${filtrados.length} de ${documentos.length}`}
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar contrato"
            aria-label="Buscar contrato"
            className="h-9 w-64 rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="h-56 animate-pulse rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" />
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
        <p className="py-16 text-center text-sm text-zinc-500">No hay contratos para mostrar.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-900">
              <tr>
                {columnas.map((c) => (
                  <th key={c} className="whitespace-nowrap px-3 py-2 font-medium">
                    {c.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((d, i) => (
                <tr key={String(d.id ?? i)} className="border-t border-zinc-100 dark:border-zinc-800">
                  {columnas.map((c) => (
                    <td key={c} className="whitespace-nowrap px-3 py-2">
                      {formatCell(d[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
