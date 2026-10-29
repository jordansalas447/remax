"use client"

import type { LegacyColumnDef } from "@tanstack/react-table/legacy"

import { DataTableColumnHeader } from "@/components/data-table"
import type { DocumentosRowDetalle } from "@/lib/supabase/queries/documentos"
import { Badge, BadgeVariant } from "../ui/badge"

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
    accessorKey: "operacion.operacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operación" />
    ),
    cell: ({ row }) => formatCell(row.original.operacion?.operacion),
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
  // {
  //   accessorKey: "id_asociado",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Asociado" />
  //   ),
  //   cell: ({ row }) => formatCell(row.getValue("id_asociado")),
  // },

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
    accessorKey: "nro_propietarios",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nro Propietario(s)" />
    ),
    cell: ({ row }) => formatCell(row.getValue("nro_propietarios")),
  },
  {
    accessorKey: "plazo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plazo (días)" />
    ),
    cell: ({ row }) => formatCell(row.getValue("plazo")),
  },
  {
    accessorKey: "eliminado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anulado" />
    ),
    cell: ({ row }) => formatBoolean(row.getValue("eliminado")),
  },
  {
    accessorKey: "id_estado",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Expiración" />
    ),
    cell: ({ row }) => {
      const estado =  formatCell(row.original.estado_documento?.estado)
      const color = formatCell(row.original.estado_documento?.color)
      const emitido = row.getValue("created_at");
      const plazo:number = row.getValue("plazo") ?? 0;
      
      const fechaVencimiento = emitido
      ? new Date(emitido as string | Date)
      : null;
    
    if (fechaVencimiento) {
      fechaVencimiento.setDate(fechaVencimiento.getDate() + plazo);
    }
    
    const fechaFormateada = fechaVencimiento
      ? fechaVencimiento.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";
    
    return fechaFormateada
    },
  },
  {
    accessorKey: "motivo_anulacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Motivo Anulación" />
    ),
    cell: ({ row }) => row.getValue("motivo_anulacion") ?? "",
  },
  {
    accessorKey: "id_publico",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id_publico") ?? "",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Emisión" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("created_at");
      if (!value) return "";
      
      const date =
        typeof value === "string" || typeof value === "number"
          ? new Date(value)
          : value as Date; // Si ya es Date
      
      return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
]
