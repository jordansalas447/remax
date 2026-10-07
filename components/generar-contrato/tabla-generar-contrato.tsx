"use client";

import { DocumentosRow } from "@/lib/supabase/queries/documentos";
import React from "react";


interface TablaGenerarContratoProps {
  documentos: DocumentosRow[];
}

function formatFecha(fecha: string | null | undefined) {
  if (!fecha) return "";
  const d = new Date(fecha);
  return d.toLocaleString();
}

const TablaGenerarContrato: React.FC<TablaGenerarContratoProps> = ({ documentos }) => {
  return (
    <div className="overflow-auto rounded-lg shadow mt-8">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
        <thead className="bg-gray-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-2">N° Contrato</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Asociado</th>
            <th className="px-4 py-2">Propietarios</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Apoderado</th>
            <th className="px-4 py-2">Operación</th>
            {/* <th className="px-4 py-2">Generado</th>
            <th className="px-4 py-2">Asignación</th>
            <th className="px-4 py-2">Uso</th>
            <th className="px-4 py-2">Cierre</th> */}
            <th className="px-4 py-2">Anulado</th>
            <th className="px-4 py-2">Motivo Anulación</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950 divide-y divide-gray-100 dark:divide-zinc-800">
          {documentos && documentos.length > 0 ? (
            documentos.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-2 font-mono">{doc.nro_contrato}</td>
                <td className="px-4 py-2">{doc.id_tipo_contrato ?? "--"}</td>
                <td className="px-4 py-2">{doc.id_estado ?? "--"}</td>
                <td className="px-4 py-2">{doc.id_asociado ?? "--"}</td>
                <td className="px-4 py-2">{doc.nro_propietarios ?? "--"}</td>
                <td className="px-4 py-2">{doc.empresa ? "Sí" : "No"}</td>
                <td className="px-4 py-2">{doc.apoderado ? "Sí" : "No"}</td>
                <td className="px-4 py-2">{doc.id_operacion ?? "--"}</td>
                {/* <td className="px-4 py-2">{formatFecha(doc.fecha_generacion)}</td>
                <td className="px-4 py-2">{formatFecha(doc.fecha_aisgnacion)}</td>
                <td className="px-4 py-2">{formatFecha(doc.fecha_uso)}</td>
                <td className="px-4 py-2">{formatFecha(doc.fecha_cierre)}</td> */}
                <td className="px-4 py-2">{doc.eliminado ? "Sí" : "No"}</td>
                <td className="px-4 py-2">{doc.motivo_anulacion ?? ""}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={14} className="py-4 text-center text-zinc-500">
                No hay contratos generados aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaGenerarContrato;