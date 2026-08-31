"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
import {
  useLegacyTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type LegacyColumnDef,
} from "@tanstack/react-table/legacy";
import { flexRender, type ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type TableConfig } from "@/lib/crud/config";
import { deleteRecord, type SelectOption } from "@/lib/crud/actions";
import { formatDisplayValue, getPrimaryKeys } from "@/lib/crud/utils";
import type { TableName, TableRow } from "@/lib/types/database";
import { TablePagination } from "@/components/crud/TablePagination";
import { CrudFormModal } from "@/components/crud/CrudFormModal";

interface CrudManagerProps<T extends TableName = TableName> {
  table: T;
  config: TableConfig;
  rows: TableRow<T>[];
  options: Record<string, SelectOption[]>;
}

type FormMode = "create" | "edit" | null;

// ---------------------------------------------------------------------------
// ColumnFilterInput
// ---------------------------------------------------------------------------

function ColumnFilterInput({ columnId, value, onChange }: {
  columnId: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="relative mt-1.5" onClick={(e) => e.stopPropagation()}>
      <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
      <input
        id={`filter-${columnId}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filtrar…"
        className="h-7 w-full rounded-md border border-zinc-200 bg-white py-0 pl-6 pr-6 text-xs text-zinc-700 placeholder-zinc-400 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          title="Limpiar filtro"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CrudManager
// ---------------------------------------------------------------------------

export function CrudManager<T extends TableName = TableName>({
  table,
  config,
  rows,
  options,
}: CrudManagerProps<T>) {
  const router = useRouter();
  const [mode, setMode] = useState<FormMode>(null);
  const [selectedRow, setSelectedRow] = useState<TableRow<T> | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });

  const listFields = config.fields.filter((f) => !f.hiddenInList);
  const primaryKeys = getPrimaryKeys(config);

  // -------------------------------------------------------------------------
  // Handlers de filas
  // -------------------------------------------------------------------------

  function openCreate() { setSelectedRow(null); setMode("create"); }
  function openEdit(row: TableRow<T>) { setSelectedRow(row); setMode("edit"); }
  function closeForm() { setMode(null); setSelectedRow(null); }

  function handleDelete(row: TableRow<T>) {
    const label = primaryKeys.map((k) => String((row as Record<string, unknown>)[k])).join(" / ");
    if (!window.confirm(`¿Eliminar el registro ${label}? Esta acción no se puede deshacer.`)) return;

    setDeleteError(null);
    const formData = new FormData();
    for (const key of primaryKeys) {
      formData.append(`__pk__${key}`, String((row as Record<string, unknown>)[key]));
    }

    startDelete(async () => {
      const result = await deleteRecord(table, formData);
      if (!result.success) { setDeleteError(result.error ?? "No se pudo eliminar el registro."); return; }
      router.refresh();
    });
  }

  // -------------------------------------------------------------------------
  // Columnas TanStack Table
  // -------------------------------------------------------------------------

  const columns = useMemo<LegacyColumnDef<TableRow<T>>[]>(() => {
    const dataCols: LegacyColumnDef<TableRow<T>>[] = listFields.map((field) => ({
      id: field.name,
      accessorFn: (row: TableRow<T>) => {
        const raw = (row as Record<string, unknown>)[field.name];
        // Resolver etiqueta FK para que el filtro busque por nombre visible
        if (options[field.name]) {
          const match = options[field.name].find((o) => o.value === String(raw ?? ""));
          if (match) return match.label;
        }
        if (raw === null || raw === undefined) return "";
        if (typeof raw === "boolean") return raw ? "Sí" : "No";
        return String(raw);
      },
      header: field.label,
      filterFn: "includesString" as const,
      cell: ({ row: tableRow }: { row: { original: TableRow<T> } }) =>
        formatDisplayValue(field, (tableRow.original as Record<string, unknown>)[field.name], options),
    }));

    const actionsCol: LegacyColumnDef<TableRow<T>> = {
      id: "__actions__",
      header: "Acciones",
      enableColumnFilter: false,
      cell: ({ row: tableRow }: { row: { original: TableRow<T> } }) => (
        <div className="flex justify-end gap-2">
          <Button
            type="button" variant="ghost" size="sm"
            onClick={() => openEdit(tableRow.original)}
            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <Pencil className="mr-1 h-4 w-4" />Editar
          </Button>
          <Button
            type="button" variant="ghost" size="sm"
            onClick={() => handleDelete(tableRow.original)}
            disabled={isDeleting}
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="mr-1 h-4 w-4" />Eliminar
          </Button>
        </div>
      ),
    };

    return [...dataCols, actionsCol];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFields, options, isDeleting]);

  // -------------------------------------------------------------------------
  // Instancia de tabla (legacy v8-compatible API)
  // -------------------------------------------------------------------------

  const tanTable = useLegacyTable<TableRow<T>>({
    data: rows,
    columns,
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const hasActiveFilters = columnFilters.length > 0;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{config.label}</h1>
          <p className="mt-1 text-sm text-zinc-500">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              type="button" variant="outline" size="sm"
              onClick={() => setColumnFilters([])}
              className="gap-1.5 text-zinc-600 dark:text-zinc-400"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros
            </Button>
          )}
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo registro
          </Button>
        </div>
      </div>

      {deleteError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {deleteError}
        </p>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              {/* THEAD con nombre + filtro por columna */}
              <thead className="bg-zinc-50 dark:bg-zinc-900/60">
                {tanTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isActions = header.id === "__actions__";
                      const filterValue = (header.column.getFilterValue() as string | undefined) ?? "";

                      return (
                        <th
                          key={header.id}
                          className={
                            isActions
                              ? "sticky right-0 z-20 bg-zinc-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] dark:bg-zinc-900 dark:shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.3)]"
                              : "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500"
                          }
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {!isActions && header.column.getCanFilter() && (
                            <ColumnFilterInput
                              columnId={header.id}
                              value={filterValue}
                              onChange={(val) => header.column.setFilterValue(val || undefined)}
                            />
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              {/* TBODY */}
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {tanTable.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-zinc-500">
                      {hasActiveFilters
                        ? "No se encontraron registros con los filtros actuales."
                        : "No hay registros todavía. Crea el primero con el botón de arriba."}
                    </td>
                  </tr>
                ) : (
                  tanTable.getRowModel().rows.map((tableRow) => (
                    <tr key={tableRow.id} className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
                      {tableRow.getVisibleCells().map((cell) => {
                        const isActions = cell.column.id === "__actions__";
                        return (
                          <td
                            key={cell.id}
                            className={
                              isActions
                                ? "sticky right-0 z-10 whitespace-nowrap bg-white px-4 py-3 text-right text-sm shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] group-hover:bg-zinc-50/90 dark:bg-zinc-950 dark:shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.3)] dark:group-hover:bg-zinc-900/90"
                                : "whitespace-nowrap px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300"
                            }
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <TablePagination table={tanTable} />
        </CardContent>
      </Card>

      {/* Modal de formulario */}
      {mode && (
        <CrudFormModal
          table={table}
          config={config}
          mode={mode}
          row={selectedRow ?? undefined}
          options={options}
          onClose={closeForm}
        />
      )}
    </div>
  );
}
