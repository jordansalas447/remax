"use client"

import * as React from "react"

import type { RowData } from "@tanstack/react-table"
import type { LegacyReactTable } from "@tanstack/react-table/legacy"

import { Input } from "@/components/ui/input"

import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData extends RowData> {
  table: LegacyReactTable<TData>
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTableToolbar<TData extends RowData>({
  table,
  searchKey,
  searchPlaceholder = "Buscar...",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(searchKey)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {isFiltered && (
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => table.resetColumnFilters()}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}