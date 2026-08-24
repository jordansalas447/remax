import type { TableName } from "@/lib/types/database";

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "textarea"
  | "select";

export interface ForeignKeyConfig {
  table: TableName;
  valueField: string;
  labelField: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  foreignKey?: ForeignKeyConfig;
  hiddenInList?: boolean;
  readOnlyOnEdit?: boolean;
}

export interface TableConfig {
  name: TableName;
  label: string;
  description: string;
  primaryKey: string | string[];
  fields: FieldConfig[];

  softDelete?: {
    enabled: boolean;
    field: string;
  };
}
