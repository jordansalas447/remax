"use client"

import * as React from "react"
import {
    type LegacyColumn,
    type LegacyColumnDef,
    type LegacyRow,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useLegacyTable,
} from "@tanstack/react-table/legacy"
import {
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type RowData,
    type SortingState,
    flexRender,
} from "@tanstack/react-table"
import { ChevronRight, Pin, PinOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DataTableToolbar, type SearchableColumn } from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"

/** Ids reservados para las columnas que agrega el propio DataTable. */
export const EXPAND_COLUMN_ID = "__expandir"
export const ACTIONS_COLUMN_ID = "__acciones"
export const SYSTEM_COLUMN_IDS = [EXPAND_COLUMN_ID, ACTIONS_COLUMN_ID]

type ColumnPinningInput = { start?: string[]; end?: string[] }

interface DataTableProps<TData extends RowData> {
    columns: LegacyColumnDef<TData, unknown>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    /** Columnas disponibles para búsqueda. Si no se pasan, se autodetectan de las columnas filtrables. */
    searchableColumns?: SearchableColumn[]
    /** Habilita el selector de columna para buscar. Por defecto `true`. */
    enableColumnSearchSelect?: boolean
    onRowClick?: (row: TData) => void

    /* ---------------- Anclado de columnas ---------------- */
    /** Muestra un botón de "anclar" en el encabezado de cada columna. */
    enableColumnPinning?: boolean
    /** Columnas ancladas al iniciar (ids / accessorKey). */
    initialColumnPinning?: ColumnPinningInput

    /* ---------------- Botones por registro ---------------- */
    /** Renderiza botones de acción (ej: "+ Observación") en una columna propia. */
    rowActions?: (row: LegacyRow<TData>) => React.ReactNode
    rowActionsHeader?: string
    /** Ancho de la columna de acciones (px). */
    rowActionsSize?: number
    /** Ancla la columna de acciones a la derecha. Por defecto `true`. */
    pinRowActions?: boolean

    /* ---------------- Sub campo bajo el registro ---------------- */
    /** Contenido que se muestra en una fila inmediatamente debajo del registro. */
    renderSubRow?: (row: LegacyRow<TData>) => React.ReactNode
    /** Decide qué registros pueden desplegar su sub campo. Por defecto todos. */
    getRowCanExpand?: (row: TData) => boolean
}

/** Estilos para que una columna anclada quede fija al hacer scroll horizontal. */
function getPinningProps<TData extends RowData>(column: LegacyColumn<TData, unknown>) {
    const pinned = column.getIsPinned()
    if (!pinned) return { style: undefined, className: undefined, pinned }

    const size = column.getSize()
    const isLastStart = pinned === "start" && column.getIsLastColumn("start")
    const isFirstEnd = pinned === "end" && column.getIsFirstColumn("end")

    return {
        pinned,
        style: {
            position: "sticky",
            left: pinned === "start" ? column.getStart("start") : undefined,
            right: pinned === "end" ? column.getAfter("end") : undefined,
            width: size,
            minWidth: size,
            maxWidth: size,
        } satisfies React.CSSProperties,
        className: cn(
            "z-10 bg-background p-0",
            isLastStart && "shadow-[inset_-1px_0_0_var(--border),4px_0_6px_-4px_rgb(0_0_0/0.15)]",
            isFirstEnd && "shadow-[inset_1px_0_0_var(--border),-4px_0_6px_-4px_rgb(0_0_0/0.15)]"
        ),
    }
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Buscar...",
    searchableColumns,
    enableColumnSearchSelect = true,
    onRowClick,
    enableColumnPinning = false,
    initialColumnPinning,
    rowActions,
    rowActionsHeader = "Acciones",
    rowActionsSize = 150,
    pinRowActions = true,
    renderSubRow,
    getRowCanExpand,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<ColumnVisibilityState>({})
    const [expanded, setExpanded] = React.useState<true | Record<string, boolean>>({})
    const [columnPinning, setColumnPinning] = React.useState(() => ({
        start: [
            ...(renderSubRow ? [EXPAND_COLUMN_ID] : []),
            ...(initialColumnPinning?.start ?? []),
        ],
        end: [
            ...(initialColumnPinning?.end ?? []),
            ...(rowActions && pinRowActions ? [ACTIONS_COLUMN_ID] : []),
        ],
    }))

    // Agrega las columnas de sistema (expandir / acciones) a las del usuario.
    const allColumns = React.useMemo<LegacyColumnDef<TData, unknown>[]>(() => {
        const result: LegacyColumnDef<TData, unknown>[] = []

        if (renderSubRow) {
            result.push({
                id: EXPAND_COLUMN_ID,
                size: 44,
                enableSorting: false,
                enableHiding: false,
                header: () => null,
                cell: ({ row }) =>
                    row.getCanExpand() ? (
                        <button
                            type="button"
                            aria-label={row.getIsExpanded() ? "Ocultar detalle" : "Ver detalle"}
                            aria-expanded={row.getIsExpanded()}
                            onClick={(e) => {
                                e.stopPropagation()
                                row.toggleExpanded()
                            }}
                            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <ChevronRight
                                className={cn(
                                    "size-4 transition-transform duration-200",
                                    row.getIsExpanded() && "rotate-90"
                                )}
                            />
                        </button>
                    ) : null,
            })
        }

        result.push(...columns)

        if (rowActions) {
            result.push({
                id: ACTIONS_COLUMN_ID,
                size: rowActionsSize,
                enableSorting: false,
                enableHiding: false,
                header: () => rowActionsHeader,
                cell: ({ row }) => (
                    <div
                        className="flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {rowActions(row)}
                    </div>
                ),
            })
        }

        return result
    }, [columns, renderSubRow, rowActions, rowActionsHeader, rowActionsSize])

    const table = useLegacyTable({
        data,
        columns: allColumns,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            columnPinning,
            expanded,
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,
        onExpandedChange: setExpanded,

        getRowCanExpand: renderSubRow
            ? (row) => (getRowCanExpand ? getRowCanExpand(row.original) : true)
            : () => false,

        // Evita que la tabla cierre sub campos / vuelva a la página 1
        // cada vez que se actualiza un registro.
        autoResetExpanded: false,
        autoResetPageIndex: false,

        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
    })

    // Une los encabezados en orden: anclados inicio | centro | anclados fin.
    const startGroups = table.getStartHeaderGroups()
    const centerGroups = table.getCenterHeaderGroups()
    const endGroups = table.getEndHeaderGroups()
    const headerGroups = centerGroups.map((group, i) => ({
        id: group.id,
        headers: [
            ...(startGroups[i]?.headers ?? []),
            ...group.headers,
            ...(endGroups[i]?.headers ?? []),
        ],
    }))

    const visibleColumnCount = table.getVisibleLeafColumns().length

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchKey={searchKey}
                searchPlaceholder={searchPlaceholder}
                searchableColumns={searchableColumns}
                enableColumnSearchSelect={enableColumnSearchSelect}
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {headerGroups.map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    const { column } = header
                                    const pin = getPinningProps(column)
                                    const showPinButton =
                                        enableColumnPinning &&
                                        !header.isPlaceholder &&
                                        column.getCanPin() &&
                                        !SYSTEM_COLUMN_IDS.includes(column.id)

                                    const content = header.isPlaceholder
                                        ? null
                                        : flexRender(column.columnDef.header, header.getContext())

                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={pin.style}
                                            className={cn("group/head", pin.className)}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-center gap-1",
                                                    pin.pinned && "h-full overflow-hidden px-2"
                                                )}
                                            >
                                                <div className="min-w-0 truncate">{content}</div>
                                                {showPinButton && (
                                                    <button
                                                        type="button"
                                                        title={pin.pinned ? "Desanclar columna" : "Anclar columna"}
                                                        aria-label={pin.pinned ? "Desanclar columna" : "Anclar columna"}
                                                        onClick={() => column.pin(pin.pinned ? false : "start")}
                                                        className={cn(
                                                            "ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-md transition-all hover:bg-muted",
                                                            pin.pinned
                                                                ? "text-primary"
                                                                : "text-muted-foreground opacity-0 group-hover/head:opacity-100 focus-visible:opacity-100"
                                                        )}
                                                    >
                                                        {pin.pinned ? (
                                                            <PinOff className="size-3.5" />
                                                        ) : (
                                                            <Pin className="size-3.5" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                const cells = [
                                    ...row.getStartVisibleCells(),
                                    ...row.getCenterVisibleCells(),
                                    ...row.getEndVisibleCells(),
                                ]
                                const isExpanded = renderSubRow && row.getIsExpanded()

                                return (
                                    <React.Fragment key={row.id}>
                                        <TableRow
                                            data-state={isExpanded ? "expanded" : undefined}
                                            className={cn(
                                                "group/row",
                                                onRowClick && "cursor-pointer",
                                                isExpanded && "border-b-0 bg-muted/40"
                                            )}
                                            onClick={() => onRowClick?.(row.original)}
                                        >
                                            {cells.map((cell) => {
                                                const pin = getPinningProps(cell.column)
                                                const content = flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )

                                                return (
                                                    <TableCell
                                                        key={cell.id}
                                                        style={pin.style}
                                                        className={cn(
                                                            pin.className,
                                                            pin.pinned && "group-hover/row:bg-muted",
                                                            pin.pinned && isExpanded && "bg-muted"
                                                        )}
                                                    >
                                                        {pin.pinned ? (
                                                            <div className="truncate px-2 py-2">{content}</div>
                                                        ) : (
                                                            content
                                                        )}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>

                                        {isExpanded && (
                                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                                                <TableCell colSpan={visibleColumnCount} className="p-0">
                                                    {/* El sub campo queda fijo a la izquierda aunque la tabla tenga scroll */}
                                                    <div className="sticky left-0 w-full max-w-4xl animate-in fade-in slide-in-from-top-1 px-4 py-3 whitespace-normal duration-200">
                                                        {renderSubRow(row)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleColumnCount}
                                    className="h-24 text-center"
                                >
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}
