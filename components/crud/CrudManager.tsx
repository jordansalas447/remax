"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getTableConfig, type FieldConfig, type TableConfig } from "@/lib/crud/config";
import {
  createRecord,
  deleteRecord,
  fetchFieldOptions,
  fetchOptionsForTable,
  type SelectOption,
  updateRecord,
} from "@/lib/crud/actions";
import { formatDisplayValue, getPrimaryKeys, isAutoIncrementField } from "@/lib/crud/utils";
import type { TableName, TableRow } from "@/lib/types/database";
import { TablePagination } from "@/components/crud/TablePagination";

interface CrudManagerProps<T extends TableName = TableName> {
  table: T;
  config: TableConfig;
  rows: TableRow<T>[];
  options: Record<string, SelectOption[]>;
}

type FormMode = "create" | "edit" | null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRowPrimaryKeys<T extends TableName>(
  config: TableConfig,
  row: TableRow<T>,
): Record<string, string | number | boolean> {
  const keys = getPrimaryKeys(config);
  const result: Record<string, string | number | boolean> = {};
  for (const key of keys) {
    const value = (row as Record<string, unknown>)[key];
    result[key] = value === null || value === undefined ? "" : (value as string | number | boolean);
  }
  return result;
}

function normalizeInputValue(field: FieldConfig, value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) return "";

  if (field.type === "date") {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return "";
      const datePart = trimmed.includes("T") ? trimmed.split("T")[0] : trimmed;
      const normalized = datePart.includes(" ") ? datePart.split(" ")[0] : datePart;
      if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
      const parsed = new Date(trimmed);
      if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
      return "";
    }
    return String(value);
  }

  return String(value);
}

// ---------------------------------------------------------------------------
// FieldInput
// ---------------------------------------------------------------------------

function FieldInput({
  field,
  value,
  options,
  disabled,
  onChange,
  onQuickCreate,
}: {
  field: FieldConfig;
  value: string | number | boolean | null | undefined;
  options: SelectOption[];
  disabled?: boolean;
  onChange?: (val: string) => void;
  onQuickCreate?: (field: FieldConfig) => void;
}) {
  const baseClass = "w-full";
  const inputValue = normalizeInputValue(field, value);

  if (field.type === "textarea") {
    return (
      <Textarea
        id={field.name}
        name={field.name}
        rows={3}
        value={inputValue}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <Select
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={baseClass}
      >
        <option value="false">No</option>
        <option value="true">Sí</option>
      </Select>
    );
  }

  if (field.type === "select") {
    const showQuickCreate = !disabled && Boolean(field.foreignKey) && Boolean(onQuickCreate);
    const selectElement = (
      <Select
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(e) => onChange?.(e.target.value)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      >
        <option value="">Seleccionar…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    if (showQuickCreate) {
      const targetTableConfig = field.foreignKey ? getTableConfig(field.foreignKey.table) : null;
      const targetLabel = targetTableConfig?.label ?? field.label;
      return (
        <div className="flex items-center gap-2">
          {selectElement}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onQuickCreate?.(field)}
            title={`Crear nuevo (${targetLabel})`}
            className="shrink-0 border-zinc-300 dark:border-zinc-700 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            <Plus className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </div>
      );
    }

    return selectElement;
  }

  if (field.type === "date") {
    return (
      <DatePicker
        id={field.name}
        name={field.name}
        value={inputValue}
        onChange={(newDate) => onChange?.(newDate)}
        required={field.required}
        disabled={disabled}
        className={baseClass}
      />
    );
  }

  return (
    <Input
      id={field.name}
      name={field.name}
      type={field.type === "number" ? "number" : "text"}
      step={field.type === "number" ? "any" : undefined}
      value={inputValue}
      onChange={(e) => onChange?.(e.target.value)}
      required={field.required}
      disabled={disabled}
      className={baseClass}
    />
  );
}

// ---------------------------------------------------------------------------
// RecordForm
// ---------------------------------------------------------------------------

function RecordForm<T extends TableName>({
  table,
  config,
  mode,
  row,
  options,
  onClose,
  onCreated,
}: {
  table: T;
  config: TableConfig;
  mode: "create" | "edit";
  row?: TableRow<T>;
  options: Record<string, SelectOption[]>;
  onClose: () => void;
  onCreated?: (insertedRow: any) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [optionsState, setOptionsState] = useState<Record<string, SelectOption[]>>(options);
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    for (const field of config.fields) {
      const val = row ? (row as Record<string, unknown>)[field.name] : undefined;
      initial[field.name] = val !== undefined && val !== null ? val : "";
    }
    return initial;
  });
  const [quickCreateField, setQuickCreateField] = useState<FieldConfig | null>(null);
  const [quickCreateOptions, setQuickCreateOptions] = useState<Record<string, SelectOption[]>>({});

  useEffect(() => { setOptionsState(options); }, [options]);

  const editableFields = config.fields.filter((field) => {
    if (mode === "create" && isAutoIncrementField(field, config)) return false;
    if (mode === "edit" && field.readOnlyOnEdit) return false;
    return true;
  });

  const primaryKeys = row ? getRowPrimaryKeys(config, row) : null;

  function handleFieldChange(fieldName: string, value: any) {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  async function handleOpenQuickCreate(field: FieldConfig) {
    if (!field.foreignKey) return;
    try {
      const opts = await fetchOptionsForTable(field.foreignKey.table);
      setQuickCreateOptions(opts);
      setQuickCreateField(field);
    } catch {
      toast.add({ title: "Error", description: "No se pudieron cargar las opciones.", type: "error" });
    }
  }

  async function handleQuickCreateCreated(field: FieldConfig, insertedRow: any) {
    if (!field.foreignKey || !insertedRow) return;
    const fk = field.foreignKey;
    const targetTableConfig = getTableConfig(fk.table);
    const fallbackPk = targetTableConfig ? getPrimaryKeys(targetTableConfig)[0] : "id";
    const newId = insertedRow[fk.valueField] ?? insertedRow[fallbackPk] ?? insertedRow.id;

    try {
      const updatedFieldOpts = await fetchFieldOptions(table, field.name);
      setOptionsState((prev) => ({ ...prev, [field.name]: updatedFieldOpts }));
    } catch (e) { console.error(e); }

    if (newId !== undefined && newId !== null) {
      setFormValues((prev) => ({ ...prev, [field.name]: String(newId) }));
    }

    toast.add({
      title: "Registro creado",
      description: `${targetTableConfig?.label ?? field.label} creado y autoseleccionado.`,
      type: "success",
      timeout: 4000,
    });
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const loadingId = toast.add({
      title: mode === "create" ? "Creando…" : "Guardando…",
      description: "Por favor espere",
      type: "loading",
      timeout: 0,
    });

    startTransition(async () => {
      const result = mode === "create"
        ? await createRecord(table, formData)
        : await updateRecord(table, formData);

      if (!result.success) {
        setError(result.error ?? "No se pudo guardar el registro.");
        toast.update(loadingId, {
          title: "Error al guardar",
          description: result.error ?? "No se pudo guardar el registro.",
          type: "error",
          timeout: 5000,
        });
        return;
      }

      toast.update(loadingId, {
        title: "Guardado",
        description: mode === "create" ? "Registro creado correctamente." : "Cambios guardados.",
        type: "success",
        timeout: 3000,
      });

      if (mode === "create" && onCreated && result.data) onCreated(result.data);
      router.refresh();
      onClose();
    });
  }

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === "create" ? "Nuevo registro" : "Editar registro"}</DialogTitle>
            <DialogDescription>{config.label}</DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            {primaryKeys &&
              Object.entries(primaryKeys).map(([key, value]) => (
                <input key={key} type="hidden" name={`__pk__${key}`} value={String(value)} />
              ))}
            {editableFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {field.label}{field.required ? " *" : ""}
                </label>
                <FieldInput
                  field={field}
                  value={formValues[field.name]}
                  options={optionsState[field.name] ?? []}
                  onChange={(val) => handleFieldChange(field.name, val)}
                  onQuickCreate={handleOpenQuickCreate}
                />
              </div>
            ))}
            {mode === "edit" &&
              config.fields.filter((f) => f.readOnlyOnEdit).map((field) => (
                <div key={field.name}>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {field.label}
                  </label>
                  <FieldInput field={field} value={formValues[field.name]} options={optionsState[field.name] ?? []} disabled />
                </div>
              ))}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Guardando…" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {quickCreateField && quickCreateField.foreignKey && (
        <RecordForm
          table={quickCreateField.foreignKey.table}
          config={getTableConfig(quickCreateField.foreignKey.table)!}
          mode="create"
          options={quickCreateOptions}
          onClose={() => setQuickCreateField(null)}
          onCreated={(row) => handleQuickCreateCreated(quickCreateField, row)}
        />
      )}
    </>
  );
}

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
        <RecordForm
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
