"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
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
  fetchFieldOptions,
  fetchOptionsForTable,
  type SelectOption,
  updateRecord,
} from "@/lib/crud/actions";
import { getPrimaryKeys } from "@/lib/crud/utils";
import type { TableName, TableRow } from "@/lib/types/database";
import { cn } from "@/lib/utils";

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
  return Boolean(form.sections?.some((section) => (section.columns ?? form.columns ?? 1) > 1));
}

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
  const [optionOverrides, setOptionOverrides] = useState<Record<string, SelectOption[]>>({});
  const optionsState = useMemo(
    () => ({ ...options, ...optionOverrides }),
    [options, optionOverrides],
  );
  const [formValues, setFormValues] = useState<Record<string, string | number | boolean | null | undefined>>(
    () => {
      const initial: Record<string, string | number | boolean | null | undefined> = {};
      for (const field of config.fields) {
        const val = row ? (row as Record<string, unknown>)[field.name] : undefined;
        initial[field.name] =
          val !== undefined && val !== null ? (val as string | number | boolean) : "";
      }
      return initial;
    },
  );
  const [quickCreateField, setQuickCreateField] = useState<FieldConfig | null>(null);
  const [quickCreateOptions, setQuickCreateOptions] = useState<Record<string, SelectOption[]>>({});

  const primaryKeys = row ? getRowPrimaryKeys(config, row) : null;
  const form = config.form;
  const title = form?.title ?? (mode === "create" ? "Nuevo registro" : "Editar registro");
  const description = form?.description ?? config.label;
  const submitLabel = form?.submitLabel ?? "Guardar";
  const cancelLabel = form?.cancelLabel ?? "Cancelar";

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

  return (
    <>
      <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
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
              onChange={handleFieldChange}
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
