import type { TableName } from "@/lib/types/database";

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "textarea"
  | "select"
  | "custom";

export type SelectPlus = true | false

export interface ForeignKeyConfig {
  table: TableName;
  valueField: string;
  labelField: string;
}

export interface FieldUiConfig {
  placeholder?: string;
  description?: string;
  /** Registry key for `type: "custom"` renderers. */
  component?: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  selectplus?: SelectPlus;
  required?: boolean;
  foreignKey?: ForeignKeyConfig;
  hiddenInList?: boolean;
  readOnlyOnEdit?: boolean;
  ui?: FieldUiConfig;
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

  softDelete?: {
    enabled: boolean;
    field: string;
  };
}
