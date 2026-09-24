"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/components/crud/FormField";
import { Button } from "@/components/ui/button";
import { getTableConfig, type DetailCollectionConfig, type FieldConfig } from "@/lib/crud/config";
import type { SelectOption } from "@/lib/crud/actions";
import {
  emptyDetailRow,
  getDetailFields,
  type DetailRow,
} from "@/lib/crud/details";
import { resolveFieldState } from "@/lib/crud/rules";
import { getPrimaryKeys } from "@/lib/crud/utils";

export function DetailsRepeater({
  detail,
  rows,
  options,
  onChange,
  onQuickCreate,
}: {
  detail: DetailCollectionConfig;
  rows: DetailRow[];
  options: Record<string, SelectOption[]>;
  onChange: (rows: DetailRow[]) => void;
  onQuickCreate?: (field: FieldConfig, index: number) => void;
}) {
  const childConfig = getTableConfig(detail.table);
  if (!childConfig) return null;

  const fields = getDetailFields(childConfig, detail);
  const childPk = getPrimaryKeys(childConfig)[0];
  const canAdd = detail.max == null || rows.length < detail.max;
  const canRemove = detail.min == null || rows.length > detail.min;

  function updateRow(index: number, fieldName: string, value: string) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [fieldName]: value } : row)));
  }

  function addRow() {
    if (!canAdd) return;
    onChange([...rows, emptyDetailRow(fields)]);
  }

  function removeRow(index: number) {
    if (!canRemove) return;
    onChange(rows.filter((_, i) => i !== index));
  }

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{detail.label}</h3>
          {detail.description ? (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{detail.description}</p>
          ) : null}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={!canAdd}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {detail.addLabel ?? "Agregar"}
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
          No hay registros. Usa “{detail.addLabel ?? "Agregar"}” para añadir el primero.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={String(row[childPk] ?? `new-${index}`)}
              className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {detail.label} {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={!canRemove}
                  title="Quitar"
                  className="h-8 w-8 text-zinc-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((field) => {
                  const state = resolveFieldState(
                    childConfig,
                    { ...field, readOnlyOnEdit: false, hiddenInForm: false },
                    row[childPk] ? "edit" : "create",
                    row,
                  );
                  if (state.hidden) return null;
                  const htmlId = `d-${detail.name}-${index}-${field.name}`;
                  return (
                    <FormField
                      key={field.name}
                      field={field}
                      value={row[field.name]}
                      options={options[field.name] ?? []}
                      required={state.required}
                      disabled={state.disabled}
                      htmlId={htmlId}
                      htmlName={htmlId}
                      onChange={(val) => updateRow(index, field.name, val)}
                      onQuickCreate={onQuickCreate ? (f) => onQuickCreate(f, index) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
