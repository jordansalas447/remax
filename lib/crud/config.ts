import type { TableName } from "@/lib/types/database";
import { tableConfigs } from "@/lib/crud/tables";

export type {
  FieldConfig,
  FieldUiConfig,
  FormConfig,
  FormSectionConfig,
  TableConfig,
} from "@/lib/crud/types";

export const TABLE_CONFIGS: Record<TableName, import("@/lib/crud/types").TableConfig> =
  tableConfigs as Record<TableName, import("@/lib/crud/types").TableConfig>;

export const TABLE_NAMES = Object.keys(TABLE_CONFIGS) as TableName[];

export function getTableConfig(table: string): import("@/lib/crud/types").TableConfig | null {
  if (table in TABLE_CONFIGS) {
    return TABLE_CONFIGS[table as TableName];
  }
  return null;
}

export function isTableName(table: string): table is TableName {
  return table in TABLE_CONFIGS;
}
