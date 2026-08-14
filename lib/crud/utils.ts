import type { FieldConfig, TableConfig } from "@/lib/crud/config";

export function getPrimaryKeys(config: TableConfig): string[] {
  return Array.isArray(config.primaryKey)
    ? config.primaryKey
    : [config.primaryKey];
}

export function isAutoIncrementField(
  field: FieldConfig,
  config: TableConfig,
): boolean {
  const pks = getPrimaryKeys(config);
  return (
    field.type === "number" &&
    pks.length === 1 &&
    pks[0] === field.name &&
    field.readOnlyOnEdit === true
  );
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "number") return String(value);
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

export function formatDisplayValue(
  field: FieldConfig,
  value: unknown,
  options?: Record<string, Array<{ value: string; label: string }>>,
): string {
  if (value === null || value === undefined) return "—";

  if (options && options[field.name]) {
    const fieldOptions = options[field.name];
    const stringValue = String(value);
    const matchedOption = fieldOptions.find((opt) => opt.value === stringValue);
    if (matchedOption) {
      return matchedOption.label;
    }
  }

  return formatCellValue(value);
}

