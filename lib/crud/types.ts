import type { TableName } from "@/lib/types/database";
import type { TableRules, TableRulesConfig } from "@/lib/crud/rules/types";

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "datenative"
  | "textarea"
  | "select"
  | "enum"
  | "inputsearch"
  | "detailselect"
  | "custom";

export type SelectPlus = true | false

export interface ForeignKeyConfig {
  table: TableName;
  valueField: string;
  labelField: string;
  sublabelField?:string;
}

export interface FieldUiConfig {
  placeholder?: string;
  description?: string;
  /** Registry key for `type: "custom"` renderers. */
  component?: string;
}

/**
 * Restricciones de selección para campos `type: "date"`.
 * Se aplican directamente al calendario (DatePicker) como matchers de react-day-picker.
 */
export interface DateConstraints {
  /**
   * Fecha mínima seleccionable (inclusive).
   * Acepta string "YYYY-MM-DD" o una función que lo devuelve (útil para "hoy" dinámico).
   */
  minDate?: string | (() => string);
  /**
   * Fecha máxima seleccionable (inclusive).
   * Acepta string "YYYY-MM-DD" o una función que lo devuelve.
   */
  maxDate?: string | (() => string);
  /**
   * Días de la semana permitidos (0 = Domingo, 1 = Lunes … 6 = Sábado).
   * Si se define, solo esos días serán seleccionables.
   * Ej: [1,2,3,4,5] → solo días hábiles.
   */
  allowedWeekdays?: number[];
  /**
   * Lista exacta de fechas permitidas en formato "YYYY-MM-DD".
   * Si se define, ÚNICAMENTE esas fechas serán seleccionables
   * (ignora minDate / maxDate / allowedWeekdays).
   */
  allowedDates?: string[];
  /**
   * Fechas específicas deshabilitadas en formato "YYYY-MM-DD".
   * Se acumulan sobre cualquier otra restricción.
   */
  disabledDates?: string[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;

  options?: SelectOption[];

  selectplus?: SelectPlus;
  /** Deshabilita el input en create y edit. */
  disabled?: boolean;
  required?: boolean;
  foreignKey?: ForeignKeyConfig;
  hiddenInList?: boolean;
  /** No renderiza el campo en el formulario (sí puede aparecer en la tabla). */
  hiddenInForm?: boolean;
  /** En modo edit, el campo se muestra deshabilitado y no se envía al actualizar. */
  readOnlyOnEdit?: boolean;
  ui?: FieldUiConfig;
  /**
   * Restricciones de selección de fecha para campos `type: "date"`.
   * Permite limitar el calendario a un rango, días específicos o fechas exactas.
   */
  dateConstraints?: DateConstraints;

  /** Array de subcampos, si corresponde (para campos compuestos o anidados) */
  fields?: FieldConfig[];
}

export type FormColumns = 1 | 2 | 3;
export type FormLayout = "stack" | "grid";

export interface FormSectionConfig {
  title?: string;
  description?: string;
  columns?: FormColumns;
  layout?: FormLayout;
  fields: string[];
}

export interface FormConfig {
  title?: string;
  description?: string;
  columns?: FormColumns;
  layout?: FormLayout;
  submitLabel?: string;
  cancelLabel?: string;
  fields?: string[];
  sections?: FormSectionConfig[];
}

export interface TableConfig {
  name: TableName;
  label: string;
  description: string;
  primaryKey: string | string[];
  fields: FieldConfig[];
  form?: FormConfig;
  /**
   * Reglas de negocio por campo (ocultar, deshabilitar, exigir, omitir del payload)
   * y/o validaciones de negocio que bloquean el guardado.
   *
   * Acepta:
   *   - `TableRules`       → { campo: FieldRule | FieldRule[] }
   *   - `TableRulesConfig` → { fields?: TableRules; validations?: BusinessRule[] }
   */
  rules?: TableRules | TableRulesConfig;

  softDelete?: {
    enabled: boolean;
    field: string;
  };
}
