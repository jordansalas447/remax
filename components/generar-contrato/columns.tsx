"use client"

import type { LegacyColumnDef } from "@tanstack/react-table/legacy"

import { DataTableColumnHeader } from "@/components/data-table"
import type { DocumentosRowDetalle } from "@/lib/supabase/queries/documentos"

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "--"
  return String(value)
}

function formatBoolean(value: boolean | null | undefined) {
  return value ? "Sí" : "No"
}

export const columns: LegacyColumnDef<DocumentosRowDetalle, unknown>[] = [
  {
    accessorKey: "nro_contrato",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Contrato" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("nro_contrato")}</span>
    ),
  },
  {
    accessorKey: "tipo_contrato.tipo_contrato",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Tipo"
      />
    ),
    cell: ({ row }) =>
      formatCell(row.original.tipo_contrato?.tipo_contrato),
  },
  {
    accessorKey: "id_estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => formatCell(row.original.estado_documento?.estado),
  },
  // {
  //   accessorKey: "id_asociado",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Asociado" />
  //   ),
  //   cell: ({ row }) => formatCell(row.getValue("id_asociado")),
  // },
  {
    accessorKey: "nro_propietarios",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propietarios" />
    ),
    cell: ({ row }) => formatCell(row.getValue("nro_propietarios")),
  },
  {
    accessorKey: "empresa",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" />
    ),
    cell: ({ row }) => formatBoolean(row.getValue("empresa")),
  },
  {
    accessorKey: "apoderado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apoderado" />
    ),
    cell: ({ row }) => formatBoolean(row.getValue("apoderado")),
  },
  {
    accessorKey: "operacion.operacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operación" />
    ),
    cell: ({ row }) => formatCell(row.original.operacion?.operacion),
  },
  {
    accessorKey: "eliminado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anulado" />
    ),
    cell: ({ row }) => formatBoolean(row.getValue("eliminado")),
  },
  {
    accessorKey: "motivo_anulacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motivo Anulación" />
    ),
    cell: ({ row }) => row.getValue("motivo_anulacion") ?? "",
  },
]
