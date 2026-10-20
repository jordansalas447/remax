"use client"

import * as React from "react"

import type { RowData } from "@tanstack/react-table"
import type { LegacyColumn, LegacyReactTable } from "@tanstack/react-table/legacy"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SYSTEM_COLUMN_IDS } from "./data-table"
import { DataTableViewOptions } from "./data-table-view-options"

export interface SearchableColumn {
  id: string
  title: string
}

interface DataTableToolbarProps<TData extends RowData> {
  table: LegacyReactTable<TData>
  searchKey?: string
  searchPlaceholder?: string
  searchableColumns?: SearchableColumn[]
  enableColumnSearchSelect?: boolean
}

function getColumnTitle<TData extends RowData>(
  column: LegacyColumn<TData, unknown>
): string {
  const meta = column.columnDef.meta as { title?: string } | undefined
  if (meta?.title) return meta.title

  if (typeof column.columnDef.header === "string") {
    return column.columnDef.header
  }

  if (typeof column.columnDef.header === "function") {
    try {
      const rendered = (column.columnDef.header as any)({
        column,
        header: undefined,
        table: undefined,
      })
      if (rendered && typeof rendered === "object") {
        if (typeof rendered.props?.title === "string") {
          return rendered.props.title
        }
        if (typeof rendered.props?.children === "string") {
          return rendered.props.children
        }
      }
    } catch {
      // Ignorar si falla la resolución del header
    }
  }

  const rawId = column.id.split(".").pop() || column.id
  return rawId
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function DataTableToolbar<TData extends RowData>({
  table,
  searchKey,
  searchPlaceholder = "Buscar...",
  searchableColumns,
  enableColumnSearchSelect = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Obtener columnas disponibles para búsqueda
  const availableColumns = React.useMemo<SearchableColumn[]>(() => {
    if (searchableColumns && searchableColumns.length > 0) {
      return searchableColumns
    }

    const cols = table.getAllLeafColumns().filter((col) => {
      if (SYSTEM_COLUMN_IDS.includes(col.id)) return false
      return col.getCanFilter()
    })

    return cols.map((col) => ({
      id: col.id,
      title: getColumnTitle(col),
    }))
  }, [table, searchableColumns])

  // Columna seleccionada actualmente para filtrar
  const [selectedColumnId, setSelectedColumnId] = React.useState<string>(() => {
    if (searchKey && availableColumns.some((col) => col.id === searchKey)) {
      return searchKey
    }
    return availableColumns[0]?.id ?? searchKey ?? ""
  })

  // Sincronizar si cambian las columnas disponibles o searchKey
  React.useEffect(() => {
    if (selectedColumnId && availableColumns.some((col) => col.id === selectedColumnId)) {
      return
    }
    if (searchKey && availableColumns.some((col) => col.id === searchKey)) {
      setSelectedColumnId(searchKey)
    } else if (availableColumns.length > 0) {
      setSelectedColumnId(availableColumns[0].id)
    }
  }, [availableColumns, searchKey, selectedColumnId])

  const selectedColObj = availableColumns.find((col) => col.id === selectedColumnId)
  const selectedColumn = selectedColumnId ? table.getColumn(selectedColumnId) : undefined
  const filterValue = (selectedColumn?.getFilterValue() as string) ?? ""

  const handleColumnChange = (newColId: string) => {
    if (selectedColumnId && selectedColumnId !== newColId) {
      const currentVal = (table.getColumn(selectedColumnId)?.getFilterValue() as string) ?? ""
      // Limpiar filtro de la columna previa
      table.getColumn(selectedColumnId)?.setFilterValue(undefined)

      // Transferir el valor ingresado a la nueva columna si existe
      if (currentVal.trim()) {
        table.getColumn(newColId)?.setFilterValue(currentVal)
      }
    }
    setSelectedColumnId(newColId)
  }

  // Placeholder dinámico según la columna seleccionada
  const computedPlaceholder = React.useMemo(() => {
    if (selectedColObj?.title) {
      return `Buscar por ${selectedColObj.title.toLowerCase()}...`
    }
    return searchPlaceholder
  }, [selectedColObj, searchPlaceholder])

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {enableColumnSearchSelect && availableColumns.length > 0 ? (
          <>
            <Select
              value={selectedColumnId}
              onValueChange={(val: any) => {
                if (val) handleColumnChange(String(val))
              }}
            >
              <SelectTrigger className="h-8 w-[160px] sm:w-[190px]">
                <SelectValue placeholder="Seleccionar columna" />
              </SelectTrigger>
              <SelectContent>
                {availableColumns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder={computedPlaceholder}
              value={filterValue}
              onChange={(event) =>
                selectedColumn?.setFilterValue(event.target.value)
              }
              className="h-8 w-[160px] sm:w-[220px] lg:w-[280px]"
              disabled={!selectedColumn}
            />
          </>
        ) : searchKey ? (
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
        ) : null}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpiar filtros
            <X className="ml-1 size-3.5" />
          </Button>
        )}
      </div>

      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}