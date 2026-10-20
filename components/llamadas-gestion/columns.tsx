"use client"

import type { LegacyColumnDef } from "@tanstack/react-table/legacy"
import { DataTableColumnHeader } from "@/components/data-table"
import { LlamadasRowDetalle } from "@/lib/supabase/queries/llamadas"
import { Badge, BadgeVariant } from "../ui/badge"


function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "--"
  return String(value)
}

export const columns: LegacyColumnDef<LlamadasRowDetalle, unknown>[] = [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="id" />
  //   ),
  //   cell: ({ row }) => (
  //     <span className="font-mono">{formatCell(row.getValue("id"))}</span>
  //   ),
  // },
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
    accessorKey: "propietario",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propietario" />
    ),
    cell: ({ row }) => formatCell(row.getValue("propietario")),
  },
  {
    accessorKey: "documento_identidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documento Identidad" />
    ),
    cell: ({ row }) => formatCell(row.getValue("documento_identidad")),
  },
  {
    accessorKey: "renovacion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Renovacion" />
    ),
    cell: ({ row }) => formatCell(row.getValue("renovacion")),
  },
   {
     accessorKey: "fecha_contrato_recibido",
     header: ({ column }) => (
       <DataTableColumnHeader column={column} title="Fecha Contrato Recibido" />
     ),
     cell: ({ row }) => {
       const value = row.getValue("fecha_contrato_recibido");
       if (!value) return "";
       const date: any =
         typeof value === "string" || typeof value === "number"
           ? new Date(value)
           : value;
       // Cálculo de días pasados
       const now = new Date();
       // Limpiar HH:MM:SS para ambos para obtener solo días completos
       const msPerDay = 1000 * 60 * 60 * 24;
       const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
       const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       const diff = Math.floor((end.getTime() - start.getTime()) / msPerDay);
       return (
         <span className="flex items-center gap-2">
           {date.toLocaleDateString("es-PE", {
             timeZone: "UTC",
             year: "numeric",
             month: "2-digit",
             day: "2-digit"
           })}
      
           <Badge variant="outline" className="ml-1">
             {diff} días
           </Badge>
         </span>
       );
     },
   },
   {
    accessorKey: "numero_telefono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Numero de Telefono" />
    ),
    cell: ({ row }) => formatCell(row.getValue("numero_telefono")),
  },
  {
    accessorKey: "conformidad",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conformidad" />
    ),
    cell: ({ row }) => formatCell(row.getValue("conformidad")),
  },
  {
    accessorKey: "estado_llamada",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado Llamada" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("estado_llamada");
    //  const color:BadgeVariant = row.getValue("color") || "default";
      const color:BadgeVariant = row?.original?.color as BadgeVariant || "default"
      if (!value) return null;
      return (
        <>
        <Badge variant={color}>
            {formatCell(value)}
        </Badge>
        </>
      );
    },
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
        return    date.toLocaleDateString("es-PE", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
    },
  }
]
