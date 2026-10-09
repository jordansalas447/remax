"use client"

import { DataTable } from "@/components/data-table"
import type { DocumentosRow } from "@/lib/supabase/queries/documentos"

import { columns } from "./columns"

interface TablaGenerarContratoProps {
  documentos: DocumentosRow[]
}

export default function TablaGenerarContrato({
  documentos,
}: TablaGenerarContratoProps) {
  return (
    <div className="bg-white p-8 shadow rounded-lg border">
      <DataTable
        columns={columns}
        data={documentos}
        searchKey="nro_contrato"
        searchPlaceholder="Filtrar n° contrato..."
      />
    </div>
  )
}
