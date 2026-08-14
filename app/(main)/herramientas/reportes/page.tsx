"use client";

import { useEffect, useState } from "react";
import { obtenerReporteContratos } from "@/lib/supabase/queries/reportes";

// Importa xlsx sólo cuando se exporta, para SSR
async function exportToExcel(data: any[], fileName: string) {
  if (typeof window === "undefined") return;
  const XLSX = await import("xlsx");

  // Convierte data a worksheet y lo descarga como archivo Excel
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".xlsx") ? fileName : fileName + ".xlsx";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

export default function ReportesPage() {
  const [reporte, setReporte] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReporte() {
      try {
        const data = await obtenerReporteContratos();
        setReporte(data);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchReporte();
  }, []);

  const handleExport = async () => {
    if (reporte.length === 0) return;
    await exportToExcel(reporte, "reporte-contratos.xlsx");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      {!loading && !error && reporte.length > 0 && (
        <button
          onClick={handleExport}
          className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors duration-200"
        >
          Exportar a Excel
        </button>
      )}
      {loading && (
        <p className="text-zinc-600 dark:text-zinc-300">Cargando reporte...</p>
      )}
      {error && (
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      )}
      {!loading && !error && reporte.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-300">
          No se encontraron resultados para el reporte.
        </p>
      )}
      {!loading && !error && reporte.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded">
            <thead>
              <tr>
                {Object.keys(reporte[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b border-zinc-300 dark:border-zinc-700 text-left font-semibold bg-zinc-100 dark:bg-zinc-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reporte.map((row, idx) => (
                <tr key={idx} className="even:bg-zinc-50 dark:even:bg-zinc-900">
                  {Object.values(row).map((value, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-2 border-b border-zinc-300 dark:border-zinc-700"
                    >
                      {value !== null && value !== undefined
                        ? value.toString()
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}