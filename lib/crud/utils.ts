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

export function formatDateTime(value: unknown, fieldType?: string): string | null {
  if (value === null || value === undefined || value === "") return null;

  // Si ya es un objeto Date
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return formatParts(value, true);
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // 1. Fecha pura en formato YYYY-MM-DD (sin hora)
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split("-");
    const numY = Number(y);
    const numM = Number(m);
    const numD = Number(d);
    if (numM >= 1 && numM <= 12 && numD >= 1 && numD <= 31 && numY >= 1000) {
      return `${d}/${m}/${y}`;
    }
    return null;
  }

  // 2. Fecha con hora (ISO 8601, ej. "2025-05-10T19:35:00Z", "2025-05-10 19:35:00+00", etc.)
  const isDateTimePattern =
    /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i.test(
      trimmed,
    );

  const isDateType =
    fieldType === "date" || fieldType === "datenative" || fieldType === "datetime";

  if (!isDateTimePattern && !isDateType) {
    return null;
  }

  // Si el campo es date o datenative y la hora es medianoche (00:00:00),
  // se trata de una fecha pura serializada como ISO medianoche
  if (
    (fieldType === "date" || fieldType === "datenative") &&
    /^\d{4}-\d{2}-\d{2}[T ]00:00(?::00(?:\.0+)?)?(?:Z|[+-]00(?::?00)?)?$/i.test(trimmed)
  ) {
    const datePart = trimmed.slice(0, 10);
    const [y, m, d] = datePart.split("-");
    return `${d}/${m}/${y}`;
  }

  // Normalizar el string para parsing seguro en JS
  let normalized = trimmed.replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/, "$1T$2");
  // Ajustar offsets cortos ej: +00 o -05 -> +00:00 o -05:00
  normalized = normalized.replace(/([+-]\d{2})$/, "$1:00");
  // Si no tiene indicador de zona horaria (ni Z ni +/-HH:MM), viene en UTC
  if (!/(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(normalized)) {
    normalized += "Z";
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;

  const hasSeconds = /T\d{2}:\d{2}:\d{2}/.test(normalized);
  return formatParts(parsed, hasSeconds);
}

function formatParts(date: Date, includeSeconds: boolean): string {
  try {
    const formatter = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const map: Record<string, string> = {};
    for (const p of parts) {
      map[p.type] = p.value;
    }

    const { day, month, year, hour, minute, second } = map;
    if (!day || !month || !year) {
      return date.toLocaleDateString("es-PE", { timeZone: "America/Lima" });
    }

    if (includeSeconds && second !== undefined) {
      return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
    }

    return `${day}/${month}/${year}, ${hour}:${minute}`;
  } catch {
    // Fallback: cálculo manual de UTC - 5 horas
    const utcMs = date.getTime();
    const utcMinus5 = new Date(utcMs - 5 * 60 * 60 * 1000);
    const d = String(utcMinus5.getUTCDate()).padStart(2, "0");
    const m = String(utcMinus5.getUTCMonth() + 1).padStart(2, "0");
    const y = String(utcMinus5.getUTCFullYear());
    const hh = String(utcMinus5.getUTCHours()).padStart(2, "0");
    const mm = String(utcMinus5.getUTCMinutes()).padStart(2, "0");
    const ss = String(utcMinus5.getUTCSeconds()).padStart(2, "0");
    if (includeSeconds) {
      return `${d}/${m}/${y}, ${hh}:${mm}:${ss}`;
    }
    return `${d}/${m}/${y}, ${hh}:${mm}`;
  }
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Sí" : "No";
  if (typeof value === "number") return String(value);

  const formattedDate = formatDateTime(value);
  if (formattedDate !== null) return formattedDate;

  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

export function formatDisplayValue(
  field: FieldConfig,
  value: unknown,
  options?: Record<string, Array<{ value: string; label: string }>>,
): string {
  if (value === null || value === undefined || value === "") return "—";

  // Resolver desde opciones FK (select/inputsearch)
  if (options && options[field.name]) {
    const fieldOptions = options[field.name];
    const stringValue = String(value);
    const matchedOption = fieldOptions.find((opt) => opt.value === stringValue);
    if (matchedOption) {
      return matchedOption.label;
    }
  }

  // Resolver desde opciones estáticas del campo (enum)
  if (field.type === "enum" && field.options) {
    const stringValue = String(value);
    const matchedOption = field.options.find((opt) => opt.value === stringValue);
    if (matchedOption) return matchedOption.label;
  }

  if (typeof value === "boolean") return value ? "Sí" : "No";

  // Formatear fechas y horas (según field.type o si es string ISO)
  const formattedDate = formatDateTime(value, field.type);
  if (formattedDate !== null) {
    return formattedDate;
  }

  return formatCellValue(value);
}

