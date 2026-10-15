"use client"

import type { LegacyColumnDef } from "@tanstack/react-table/legacy"
import { DataTableColumnHeader } from "@/components/data-table"
import { LlamadasRowDetalle } from "@/lib/supabase/queries/llamadas"

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "--"
  return String(value)
}

export const columns: LegacyColumnDef<LlamadasRowDetalle, unknown>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="id" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("id"))}</span>
    ),
  },
  {
    accessorKey: "id_remax",
    // id_remax es numérico: el filtro automático usaría "inNumberRange".
    // Forzamos una búsqueda por texto (contiene).
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId)
      if (value === null || value === undefined) return false
      return String(value)
        .toLowerCase()
        .includes(String(filterValue ?? "").trim().toLowerCase())
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID REMAX" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("id_remax"))}</span>
    ),
  },
  {
    accessorKey: "asociado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asociado" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("asociado"))}</span>
    ),
  },
  {
    accessorKey: "tipo_propiedad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Propiedad" />
    ),
    cell: ({ row }) => (
      <span className="font-mono">{formatCell(row.getValue("tipo_propiedad"))}</span>
    ),
  },
  {
    accessorKey: "direccion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Direccion" />
    ),
    cell: ({ row }) => formatCell(row.getValue("direccion")),
  },
  {
    accessorKey: "tipo_negocio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Negocio" />
    ),
    cell: ({ row }) => formatCell(row.getValue("tipo_negocio")),
  },
  {
    accessorKey: "modalidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Contrato / Modalidad" />
    ),
    cell: ({ row }) => formatCell(row.getValue("modalidad")),
  },
  {
    accessorKey: "propietario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propietario" />
    ),
    cell: ({ row }) => formatCell(row.getValue("propietario")),
  },
  {
    accessorKey: "numero_telefono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Numero de Telefono" />
    ),
    cell: ({ row }) => formatCell(row.getValue("numero_telefono")),
  },
  {
    accessorKey: "fecha_contrato_recibido",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Contrato Recibido" />
    ),
    cell: ({ row }) => {
        const value = row.getValue("fecha_contrato_recibido");
        if (!value) return "";
        const date: any = typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : value;
        return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "fecha_bienvenida",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Bienvenida" />
    ),
    cell: ({ row }) => {
        const value = row.getValue("fecha_bienvenida");
        if (!value) return "";
        const date: any = typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : value; // fallback if already Date
        return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "curso_llamada",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Curso de Llamada" />
    ),
    cell: ({ row }) => formatCell(row.getValue("curso_llamada")),
  },
  {
    accessorKey: "observacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Observacion" />
    ),
    cell: ({ row }) => formatCell(row.getValue("observacion")),
  },
  {
    accessorKey: "fecha_seguimiento_llamada",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de Seguimiento de Llamada" />
    ),
    cell: ({ row }) => {
        const value = row.getValue("fecha_seguimiento_llamada");
        if (!value) return "";
        const date: any = typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : value; // fallback if already Date
        return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "observacion_seguimiento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Observacion de Seguimiento" />
    ),
    cell: ({ row }) => formatCell(row.getValue("observacion_seguimiento")),
  },
]
