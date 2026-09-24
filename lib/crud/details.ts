import { getTableConfig, type DetailCollectionConfig, type FieldConfig, type TableConfig } from "@/lib/crud/config";
import { resolveFieldState, validateBusinessRules } from "@/lib/crud/rules";
import type { FormMode, FormValues } from "@/lib/crud/rules/types";
import { getPrimaryKeys } from "@/lib/crud/utils";

export type DetailScalar = string | number | boolean | null | undefined;
export type DetailRow = Record<string, DetailScalar>;

export function detailsFormKey(name: string): string {
  return `__details__${name}`;
}

export function getDetailCollections(config: TableConfig): DetailCollectionConfig[] {
  return config.details ?? [];
}

export function getDetailFields(childConfig: TableConfig, detail: DetailCollectionConfig): FieldConfig[] {
  return detail.fields
    .map((name) => childConfig.fields.find((field) => field.name === name))
    .filter((field): field is FieldConfig => Boolean(field));
}

export function emptyDetailRow(fields: FieldConfig[]): DetailRow {
  const row: DetailRow = {};
  for (const field of fields) {
    row[field.name] = "";
  }
  return row;
}

export function initialDetailRows(detail: DetailCollectionConfig, childConfig: TableConfig): DetailRow[] {
  const fields = getDetailFields(childConfig, detail);
  const count = Math.max(detail.min ?? 0, 0);
  return Array.from({ length: count }, () => emptyDetailRow(fields));
}

export function parseDetailsFromFormData(
  formData: FormData,
  config: TableConfig,
): Record<string, DetailRow[]> {
  const result: Record<string, DetailRow[]> = {};
  for (const detail of getDetailCollections(config)) {
    const raw = formData.get(detailsFormKey(detail.name));
    if (typeof raw !== "string" || raw.trim() === "") {
      result[detail.name] = [];
      continue;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      result[detail.name] = Array.isArray(parsed) ? (parsed as DetailRow[]) : [];
    } catch {
      result[detail.name] = [];
    }
  }
  return result;
}

export function rowToFormValues(row: DetailRow): FormValues {
  const values: FormValues = {};
  for (const [key, value] of Object.entries(row)) {
    values[key] = value;
  }
  return values;
}

export function validateDetailCollections(
  config: TableConfig,
  collections: Record<string, DetailRow[]>,
  mode: FormMode,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const detail of getDetailCollections(config)) {
    const childConfig = getTableConfig(detail.table);
    if (!childConfig) {
      errors.push(`No se encontró la configuración de "${detail.label}".`);
      continue;
    }

    const rows = collections[detail.name] ?? [];
    if (detail.min != null && rows.length < detail.min) {
      errors.push(`${detail.label}: se requiere al menos ${detail.min} registro(s).`);
    }
    if (detail.max != null && rows.length > detail.max) {
      errors.push(`${detail.label}: no se permiten más de ${detail.max} registro(s).`);
    }

    const fields = getDetailFields(childConfig, detail);
    const childPk = getPrimaryKeys(childConfig)[0];

    rows.forEach((row, index) => {
      const label = `${detail.label} ${index + 1}`;
      const values = rowToFormValues(row);
      const rowMode: FormMode = row[childPk] ? "edit" : "create";
      const formMode = mode === "edit" ? rowMode : "create";

      for (const field of fields) {
        const state = resolveFieldState(
          childConfig,
          { ...field, readOnlyOnEdit: false, hiddenInForm: false },
          formMode,
          values,
        );
        if (state.required) {
          const value = row[field.name];
          if (value === null || value === undefined || value === "") {
            errors.push(`${label}: el campo "${field.label}" es obligatorio.`);
          }
        }
      }

      const validation = validateBusinessRules(childConfig, values, formMode);
      if (!validation.valid) {
        for (const error of validation.errors) {
          errors.push(`${label}: ${error.message}`);
        }
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
