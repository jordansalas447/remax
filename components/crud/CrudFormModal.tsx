"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { DynamicForm } from "@/components/crud/DynamicForm";
import { getTableConfig, type FieldConfig, type TableConfig } from "@/lib/crud/config";
import {
  createRecord,
  fetchDetailRows,
  fetchFieldOptions,
  fetchOptionsForTable,
  fetchRecordByField,
  type SelectOption,
  updateRecord,
} from "@/lib/crud/actions";
import { getPrimaryKeys } from "@/lib/crud/utils";
import { validateBusinessRules, formDataToValues } from "@/lib/crud/rules";
import type { TableName, TableRow } from "@/lib/types/database";
import { cn } from "@/lib/utils";
import {
  detailsFormKey,
  getDetailCollections,
  initialDetailRows,
  validateDetailCollections,
  type DetailRow,
} from "@/lib/crud/details";

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function isWideForm(config: TableConfig): boolean {
  const form = config.form;
  if (!form) return false;
  if ((form.columns ?? 1) > 1) return true;
  if (Boolean(form.sections?.some((section) => (section.columns ?? form.columns ?? 1) > 1))) return true;
  // Si tiene colecciones de detalle, siempre usar ancho amplio
  if ((config.details?.length ?? 0) > 0) return true;
  return false;
}

function FormLoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-48 flex-col items-center justify-center gap-3 py-10 text-sm text-muted-foreground"
    >
      <Loader2 className="size-8 animate-spin" />
      <span>Cargando formulario…</span>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function CrudFormModal<T extends TableName>({
  table,
  config,
  mode,
  row,
  options,
  onClose,
  onCreated,
  onUpdated,
}: {
  table: T;
  config: TableConfig;
  mode: "create" | "edit";
  row?: TableRow<T>;
  options: Record<string, SelectOption[]>;
  onClose: () => void;
  onCreated?: (insertedRow: Record<string, unknown>) => void;
  onUpdated?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // ── Opciones FK de la cabecera ──────────────────────────────────────────
  const [optionOverrides, setOptionOverrides] = useState<Record<string, SelectOption[]>>({});
  const optionsState = useMemo(
    () => ({ ...options, ...optionOverrides }),
    [options, optionOverrides],
  );

  // ── Modo de envío (guardar y cerrar vs guardar y continuar) ─────────────
  const submitActionRef = useRef<"save_and_close" | "save_and_continue">("save_and_close");

  // ── Valores de campos de la cabecera ────────────────────────────────────
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean | null | undefined>>(
    () => {
      const initial: Record<string, string | number | boolean | null | undefined> = {};
      for (const field of config.fields) {
        const val = row ? (row as Record<string, unknown>)[field.name] : undefined;
        initial[field.name] =
          val !== undefined && val !== null
            ? (val as string | number | boolean)
            : (field.defaultValue !== undefined ? field.defaultValue : "");
      }
      return initial;
    },
  );

  // ── Quick-create (modal anidado) ────────────────────────────────────────
  const [quickCreateField, setQuickCreateField] = useState<FieldConfig | null>(null);
  const [quickCreateOptions, setQuickCreateOptions] = useState<Record<string, SelectOption[]>>({});
  const [quickEdit, setQuickEdit] = useState<{ field: FieldConfig; row: Record<string, unknown> } | null>(null);

  // ── Master / Detail state ───────────────────────────────────────────────
  const detailCollections = getDetailCollections(config);
  const hasDetails = detailCollections.length > 0;

  /** Filas por colección: { [detail.name]: DetailRow[] } */
  const [detailRows, setDetailRows] = useState<Record<string, DetailRow[]>>(() => {
    const init: Record<string, DetailRow[]> = {};
    for (const detail of detailCollections) {
      const childConfig = getTableConfig(detail.table);
      init[detail.name] = childConfig ? initialDetailRows(detail, childConfig) : [];
    }
    return init;
  });

  /** Opciones FK para campos de cada tabla hija: { [detail.name]: { [fieldName]: SelectOption[] } } */
  const [detailOptions, setDetailOptions] = useState<Record<string, Record<string, SelectOption[]>>>({});

  // ── Estado de carga del modal ───────────────────────────────────────────
  // `contentReady` deja que el modal pinte primero (con spinner) y monte
  // el formulario pesado en el siguiente frame.
  const [contentReady, setContentReady] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(hasDetails);
  const [quickCreateLoading, setQuickCreateLoading] = useState(false);
  const isFormLoading = !contentReady || detailsLoading;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTimeout(() => setContentReady(true), 0);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Flag para evitar doble-carga en React StrictMode
  const detailsLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasDetails || detailsLoadedRef.current) return;
    detailsLoadedRef.current = true;

    async function loadDetails() {
      try {
        await loadDetailsInner();
      } finally {
        setDetailsLoading(false);
      }
    }

    async function loadDetailsInner() {
      // 1. Cargar opciones FK de las tablas hijas
      const newDetailOptions: Record<string, Record<string, SelectOption[]>> = {};
      for (const detail of detailCollections) {
        try {
          newDetailOptions[detail.name] = await fetchOptionsForTable(detail.table);
        } catch {
          newDetailOptions[detail.name] = {};
        }
      }
      setDetailOptions(newDetailOptions);

      // 2. En modo edit: cargar filas existentes de cada colección
      if (mode === "edit" && row) {
        const parentPk = getPrimaryKeys(config)[0];
        const newDetailRows: Record<string, DetailRow[]> = {};

        for (const detail of detailCollections) {
          const parentValueField = detail.parentValueField ?? parentPk;
          const parentValue = (row as Record<string, unknown>)[parentValueField];

          if (parentValue !== undefined && parentValue !== null && parentValue !== "") {
            try {
              const rows = await fetchDetailRows(
                detail.table,
                detail.parentKey,
                parentValue as string | number,
              );
              newDetailRows[detail.name] = rows;
            } catch {
              const childConfig = getTableConfig(detail.table);
              newDetailRows[detail.name] = childConfig ? initialDetailRows(detail, childConfig) : [];
            }
          } else {
            const childConfig = getTableConfig(detail.table);
            newDetailRows[detail.name] = childConfig ? initialDetailRows(detail, childConfig) : [];
          }
        }
        setDetailRows(newDetailRows);
      }
    }

    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDetailChange(name: string, rows: DetailRow[]) {
    setDetailRows((prev) => ({ ...prev, [name]: rows }));
  }

  // ── Derived ─────────────────────────────────────────────────────────────
  const primaryKeys = row ? getRowPrimaryKeys(config, row) : null;
  const form = config.form;
  const title = form?.title ?? (mode === "create" ? "Nuevo registro" : "Editar registro");
  const description = form?.description ?? config.label;
  const submitLabel = form?.submitLabel ?? "Guardar";
  const cancelLabel = form?.cancelLabel ?? "Cancelar";

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleFieldChange(fieldName: string, value: string) {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  async function handleOpenQuickCreate(field: FieldConfig) {
    if (!field.foreignKey) return;
    setQuickCreateLoading(true);
    try {
      const opts = await fetchOptionsForTable(field.foreignKey.table);
      setQuickCreateOptions(opts);
      setQuickCreateField(field);
    } catch {
      toast.add({ title: "Error", description: "No se pudieron cargar las opciones.", type: "error" });
    } finally {
      setQuickCreateLoading(false);
    }
  }

  async function handleOpenQuickEdit(field: FieldConfig) {
    if (!field.foreignKey) return;
    const selected = formValues[field.name];
    if (selected === undefined || selected === null || selected === "") return;

    setQuickCreateLoading(true);
    try {
      const fk = field.foreignKey;
      const [opts, record] = await Promise.all([
        fetchOptionsForTable(fk.table),
        fetchRecordByField(fk.table, fk.valueField, selected as string | number),
      ]);
      if (!record) {
        toast.add({ title: "Error", description: "No se encontró el registro seleccionado.", type: "error" });
        return;
      }
      setQuickCreateOptions(opts);
      setQuickEdit({ field, row: record as Record<string, unknown> });
    } catch {
      toast.add({ title: "Error", description: "No se pudo cargar el registro.", type: "error" });
    } finally {
      setQuickCreateLoading(false);
    }
  }

  async function handleQuickEditUpdated(field: FieldConfig) {
    try {
      const updatedFieldOpts = await fetchFieldOptions(table, field.name);
      setOptionOverrides((prev) => ({ ...prev, [field.name]: updatedFieldOpts }));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleQuickCreateCreated(field: FieldConfig, insertedRow: Record<string, unknown>) {
    if (!field.foreignKey || !insertedRow) return;
    const fk = field.foreignKey;
    const targetTableConfig = getTableConfig(fk.table);
    const fallbackPk = targetTableConfig ? getPrimaryKeys(targetTableConfig)[0] : "id";
    const newId = insertedRow[fk.valueField] ?? insertedRow[fallbackPk] ?? insertedRow.id;

    try {
      const updatedFieldOpts = await fetchFieldOptions(table, field.name);
      setOptionOverrides((prev) => ({ ...prev, [field.name]: updatedFieldOpts }));
    } catch (e) {
      console.error(e);
    }

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

    // 1. Validar reglas de negocio de la cabecera
    const values = formDataToValues(formData, config);
    const formMode = mode === "create" ? "create" : "edit";
    const validation = validateBusinessRules(config, values, formMode);

    if (!validation.valid) {
      const msg = validation.errors.map((e: { ruleId: string; message: string }) => e.message).join(" — ");
      setError(msg);
      toast.add({
        title: "No se puede guardar",
        description: msg,
        type: "error",
        timeout: 6000,
      });
      return;
    }

    // 2. Validar colecciones de detalle (min/max + campos requeridos + reglas negocio hija)
    if (hasDetails) {
      const detailValidation = validateDetailCollections(config, detailRows, formMode);
      if (!detailValidation.valid) {
        const msg = detailValidation.errors.join(" — ");
        setError(msg);
        toast.add({
          title: "No se puede guardar",
          description: msg,
          type: "error",
          timeout: 6000,
        });
        return;
      }

      // 3. Serializar los detalles como campo oculto JSON en el FormData
      for (const detail of detailCollections) {
        const rows = detailRows[detail.name] ?? [];
        formData.set(detailsFormKey(detail.name), JSON.stringify(rows));
      }
    }

    const loadingId = toast.add({
      title: mode === "create" ? "Creando…" : "Guardando…",
      description: "Por favor espere",
      type: "loading",
      timeout: 0,
    });

    const isSaveAndContinue = submitActionRef.current === "save_and_continue" && mode === "create";

    startTransition(async () => {
      const result =
        mode === "create" ? await createRecord(table, formData) : await updateRecord(table, formData);

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
        description: isSaveAndContinue
          ? "Registro creado correctamente. Listo para agregar el siguiente."
          : mode === "create"
            ? "Registro creado correctamente."
            : "Cambios guardados.",
        type: "success",
        timeout: 3000,
      });

      if (mode === "create" && onCreated && result.data) {
        onCreated(result.data as Record<string, unknown>);
      }
      if (mode === "edit") onUpdated?.();
      router.refresh();

      if (isSaveAndContinue) {
        const clearFields = config.form?.clearOnSaveAndContinue;
        const keepFields = config.form?.keepOnSaveAndContinue;

        setFormValues((prev) => {
          const next: Record<string, string | number | boolean | null | undefined> = {};
          for (const field of config.fields) {
            if (clearFields && clearFields.includes(field.name)) {
              next[field.name] = "";
            } else if (keepFields && !keepFields.includes(field.name)) {
              next[field.name] = "";
            } else {
              next[field.name] = prev[field.name] ?? "";
            }
          }
          return next;
        });

        // Limpiar colecciones de detalle para el nuevo registro
        const resetDetails: Record<string, DetailRow[]> = {};
        for (const detail of detailCollections) {
          const childConfig = getTableConfig(detail.table);
          resetDetails[detail.name] = childConfig ? initialDetailRows(detail, childConfig) : [];
        }
        setDetailRows(resetDetails);
        submitActionRef.current = "save_and_close";
      } else {
        onClose();
      }
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Dialog 
       open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent    
        showCloseButton = {false}
          className={cn(
            "max-h-[90vh] overflow-y-auto",
            isWideForm(config) ? "sm:max-w-4xl lg:max-w-5xl" : "lg:max-w-[90vh]",
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            {primaryKeys &&
              Object.entries(primaryKeys).map(([key, value]) => (
                <input key={key} type="hidden" name={`__pk__${key}`} value={String(value)} />
              ))}
            {isFormLoading ? (
              <FormLoadingState />
            ) : (
              <DynamicForm
                config={config}
                mode={mode}
                values={formValues}
                options={optionsState}
                details={detailRows}
                detailOptions={detailOptions}
                onChange={handleFieldChange}
                onDetailChange={handleDetailChange}
                onQuickCreate={handleOpenQuickCreate}
                onQuickEdit={handleOpenQuickEdit}
              />
            )}
            {quickCreateLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-[1px]">
                <Loader2 className="size-8 animate-spin text-muted-foreground" aria-label="Cargando" />
              </div>
            )}
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}
            <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                {cancelLabel}
              </Button>
              {mode === "create" && config.form?.allowSaveAndContinue && (
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    submitActionRef.current = "save_and_continue";
                  }}
                  className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                >
                  {config.form?.saveAndContinueLabel ?? "Guardar y agregar otro"}
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending || isFormLoading}
                onClick={() => {
                  submitActionRef.current = "save_and_close";
                }}
              >
                {isPending ? "Guardando…" : submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {quickCreateField && quickCreateField.foreignKey && (
        <CrudFormModal
          table={quickCreateField.foreignKey.table}
          config={getTableConfig(quickCreateField.foreignKey.table)!}
          mode="create"
          options={quickCreateOptions}
          onClose={() => setQuickCreateField(null)}
          onCreated={(createdRow) => handleQuickCreateCreated(quickCreateField, createdRow)}
        />
      )}
      {quickEdit && quickEdit.field.foreignKey && (
        <CrudFormModal
          table={quickEdit.field.foreignKey.table}
          config={getTableConfig(quickEdit.field.foreignKey.table)!}
          mode="edit"
          row={quickEdit.row as TableRow<typeof quickEdit.field.foreignKey.table>}
          options={quickCreateOptions}
          onClose={() => setQuickEdit(null)}
          onUpdated={() => handleQuickEditUpdated(quickEdit.field)}
        />
      )}
    </>
  );
}
