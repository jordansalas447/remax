"use client";

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

// ── Componente principal ──────────────────────────────────────────────────────

export function CrudFormModal<T extends TableName>({
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
  onCreated?: (insertedRow: Record<string, unknown>) => void;
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

  // Flag para evitar doble-carga en React StrictMode
  const detailsLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasDetails || detailsLoadedRef.current) return;
    detailsLoadedRef.current = true;

    async function loadDetails() {
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
    try {
      const opts = await fetchOptionsForTable(field.foreignKey.table);
      setQuickCreateOptions(opts);
      setQuickCreateField(field);
    } catch {
      toast.add({ title: "Error", description: "No se pudieron cargar las opciones.", type: "error" });
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
        description: mode === "create" ? "Registro creado correctamente." : "Cambios guardados.",
        type: "success",
        timeout: 3000,
      });

      if (mode === "create" && onCreated && result.data) {
        onCreated(result.data as Record<string, unknown>);
      }
      router.refresh();
      onClose();
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
            />
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isPending}>
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
    </>
  );
}
