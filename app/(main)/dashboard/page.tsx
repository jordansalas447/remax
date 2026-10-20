"use client";

import { getResumenLlamadas, LlamadasRowDetalle } from "@/lib/supabase/queries/llamadas";
import React, { useEffect, useState } from "react";



type ResumenLlamadas = {
  asociado: string;
  tipo_propiedad: string | null;
  direccion: string | null;
  tipo_negocio: string | null;
  modalidad: string | null;
  propietario: string | null;
  Estado_Llamada: string | null;
  color: string | null;
  conformidad: string | null;
  numero_telefono: string | null;
  documento_identidad: string | null;
  fecha_contrato_recibido: string | null;
  renovacion: string | null;
  fecha_bienvenida: string | null;
  curso_llamada: string | null;
  observacion: string | null;
  fecha_seguimiento_llamada: string | null;
  observacion_seguimiento: string | null;
  fecha_registro: string | null;
};

export default function DashboardPage() {
  const [resumen, setResumen] = useState<LlamadasRowDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // This function should perform the query from supabase
        const data = await getResumenLlamadas();
        setResumen(data || []);
      } catch (error: any) {
        setErrorMsg(error?.message || "Error cargando la información del Dashboard.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="w-full mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 my-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-300 text-center">
        Dashboard de Llamadas de Propietarios
      </h2>
      {isLoading ? (
        <div className="text-center text-base py-8">Cargando datos...</div>
      ) : errorMsg ? (
        <div className="bg-red-100 text-red-800 p-2 rounded">{errorMsg}</div>
      ) : resumen.length === 0 ? (
        <div className="text-gray-600 text-center">No hay datos del dashboard.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 text-xs md:text-sm rounded-lg bg-white dark:bg-zinc-800">
            <thead>
              <tr className="bg-blue-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100">
                <th className="border px-2 py-1">Asociado</th>
                <th className="border px-2 py-1">Tipo Propiedad</th>
                <th className="border px-2 py-1">Dirección</th>
                <th className="border px-2 py-1">Negocio</th>
                <th className="border px-2 py-1">Modalidad</th>
                <th className="border px-2 py-1">Propietario</th>
                <th className="border px-2 py-1">Estado Llamada</th>
                <th className="border px-2 py-1">F. Bienvenida</th>
                <th className="border px-2 py-1">Observación</th>
                <th className="border px-2 py-1">F. Seguimiento</th>
                <th className="border px-2 py-1">Obs. Seguimiento</th>
                <th className="border px-2 py-1">F. Registro</th>
              </tr>
            </thead>
            <tbody>
              {resumen.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-zinc-700">
                  <td className="border px-2 py-1">{row.asociado ?? "--"}</td>
                  <td className="border px-2 py-1">{row.tipo_propiedad ?? "--"}</td>
                  <td className="border px-2 py-1">{row.direccion ?? "--"}</td>
                  <td className="border px-2 py-1">{row.tipo_negocio ?? "--"}</td>
                  <td className="border px-2 py-1">{row.modalidad ?? "--"}</td>
                  <td className="border px-2 py-1">{row.propietario ?? "--"}</td>
                  <td className="border px-2 py-1">
                    <span
                      className="font-semibold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: row.color || "#cbd5e1",
                        color: row.color === "yellow" ? "#78350f" : "#1e293b"
                      }}
                    >
                      {row.Estado_Llamada ?? "Pendiente"}
                    </span>
                  </td>           
                  <td className="border px-2 py-1">{row.fecha_bienvenida ?? "--"}</td>
                  <td className="border px-2 py-1">{row.observacion ?? "--"}</td>
                  <td className="border px-2 py-1">{row.fecha_seguimiento_llamada ?? "--"}</td>
                  <td className="border px-2 py-1">{row.observacion_seguimiento ?? "--"}</td>
                  <td className="border px-2 py-1">{row.fecha_registro ?? "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}