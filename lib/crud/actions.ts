"use server";

import { revalidatePath } from "next/cache";
import {
  TABLE_CONFIGS,
  type FieldConfig,
  type TableConfig,
} from "@/lib/crud/config";
import { getPrimaryKeys, isAutoIncrementField } from "@/lib/crud/utils";
import { createClient } from "@/lib/supabase/server";
import type {
  RowRecord,
  TableInsert,
  TableName,
  TableRow,
  TableUpdate,
} from "@/lib/types/database";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CrudPageData<T extends TableName = TableName> {
  rows: TableRow<T>[];
  options: Record<string, SelectOption[]>;
}

function parseFieldValue(
  field: FieldConfig,
  raw: FormDataEntryValue | null | undefined,
): string | number | boolean | null {
  if (raw === null || raw === undefined || raw === "") {
    if (field.required) {
      throw new Error(`El campo "${field.label}" es obligatorio.`);
    }
    return field.type === "boolean" ? false : null;
  }

  const value = String(raw);

  switch (field.type) {
    case "number": {
      const parsed = Number(value);
      if (Number.isNaN(parsed)) {
        throw new Error(`"${field.label}" debe ser un número válido.`);
      }
      return parsed;
    }
    case "boolean":
      return value === "true" || value === "on";
    default:
      return value;
  }
}

function buildPayload(
  formData: FormData,
  config: TableConfig,
  mode: "create" | "update",
): RowRecord {
  const payload: RowRecord = {};

  for (const field of config.fields) {
    if (mode === "create" && isAutoIncrementField(field, config)) {
      continue;
    }
    if (mode === "update" && field.readOnlyOnEdit) {
      continue;
    }

    payload[field.name] = parseFieldValue(field, formData.get(field.name));
  }

  return payload;
}

function buildPrimaryKeyFilter(
  config: TableConfig,
  formData: FormData,
): Record<string, string | number> {
  const filter: Record<string, string | number> = {};

  for (const key of getPrimaryKeys(config)) {
    const raw = formData.get(`__pk__${key}`);
    if (raw === null || raw === "") {
      throw new Error(`No se encontró la clave primaria "${key}".`);
    }

    const field = config.fields.find((item) => item.name === key);
    if (field?.type === "number") {
      filter[key] = Number(raw);
    } else {
      filter[key] = String(raw);
    }
  }

  return filter;
}

export async function fetchTableData<T extends TableName>(
  table: T,
): Promise<CrudPageData<T>> {
  const config = TABLE_CONFIGS[table];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select("*")
    //.is("eliminado", false)
    .order(getPrimaryKeys(config)[0], { ascending: true });


  if (error) {
    throw new Error(error.message);
  }

  const options: Record<string, SelectOption[]> = {};

  for (const field of config.fields) {
    if (!field.foreignKey) continue;

    const fkTable = field.foreignKey.table;
    const { data: fkData, error: fkError } = await supabase
      .from(fkTable)
      .select("*")
      .order(field.foreignKey.labelField, { ascending: true });

    
    //console.log({ data: fkData, error: fkError })

    if (fkError) {
      throw new Error(fkError.message);
    }

    const fk = field.foreignKey!;
    let optionsForField: SelectOption[] = [];

    if (fkData && fkData.length > 0) {
      const records = fkData as Array<Record<string, any>>;

      // Try to resolve nested foreign keys dynamically using TABLE_CONFIGS.
      const tableConfigsMap = TABLE_CONFIGS as Record<string, TableConfig>;
      const fkTableConfig = tableConfigsMap[fkTable as string];

      if (fkTableConfig) {

        
        // find a field in the foreign table that itself has a foreignKey
        const nestedField = fkTableConfig.fields.find((f) => f.foreignKey);

        

        if (nestedField && records.some((r) => r && Object.prototype.hasOwnProperty.call(r, nestedField.name))) {
          const nestedFk = nestedField.foreignKey!;
          const ids = Array.from(new Set(records.map((r) => r[nestedField.name]).filter(Boolean)));

          const refMap = new Map<any, Record<string, any>>();
          // if (ids.length > 0) {
          //   const { data: refData, error: refError } = await supabase
          //     .from(nestedFk.table)
          //     .select("*")
          //     .in(nestedFk.valueField, ids as any[]);

          //   if (!refError && refData) {
          //     refData.forEach((d) => refMap.set(d[nestedFk.valueField], d as Record<string, any>)); 
          //   }
          // }
          // console.log(nestedFk)

          // Try to compose a human-friendly label from the referenced table's common name fields
          const refTableConfig = tableConfigsMap[nestedFk.table as string];

          optionsForField = records.map((rec) => {
            const refId = rec[nestedField.name];
            const ref = refId ? refMap.get(refId) : null;



            let label: string | undefined;

            if (ref && refTableConfig) {
              const nameParts: string[] = [];
              const tryFields = ["nombre", "nombres", "first_name", "apellido_paterno", "apellido_materno", "last_name"];
              for (const f of tryFields) {
                if (ref[f]) nameParts.push(String(ref[f]));
              //  console.log(ref[f])
              }
              if (nameParts.length > 0) {
                label = nameParts.join(" ");
                
              }
  
            }

            if (!label && ref) {
              // fallback to the referenced table's labelField if available
              label = String(ref[nestedFk.labelField] ?? "");
             // console.log(label)
            }

            const fallbackLabel = rec[fk.labelField] ?? "";

            return {
              value: String(rec[fk.valueField]),
              label: label ?? String(fallbackLabel),
            };
          });

         // console.log(optionsForField)
        } else {
          optionsForField = records.map((row) => {
            const record = row as Record<string, string | number>;
            return {
              value: String(record[fk.valueField]),
              label: String(record[fk.labelField]),
            };
          });
        }
      } else {
        optionsForField = records.map((row) => {
          const record = row as Record<string, string | number>;
          return {
            value: String(record[fk.valueField]),
            label: String(record[fk.labelField]),
          };
        });
      }
    }

    options[field.name] = optionsForField;
  }

  return {
    rows: (data ?? []) as TableRow<T>[],
    options,
  };
}

export async function fetchFieldOptions<T extends TableName>(
  table: T,
  fieldName: string,
): Promise<SelectOption[]> {
  const config = TABLE_CONFIGS[table];
  if (!config) return [];
  //console.log(table)
  const field = config.fields.find((f) => f.name === fieldName);
  if (!field || !field.foreignKey) return [];

  const supabase = await createClient();
  const fkTable = field.foreignKey.table;
  const fk = field.foreignKey;

  const { data: fkData, error: fkError } = await supabase
    .from(fkTable)
    .select("*")
    .order(fk.labelField, { ascending: true });

  if (fkError || !fkData) return [];

  const records = fkData as Array<Record<string, any>>;
  const tableConfigsMap = TABLE_CONFIGS as Record<string, TableConfig>;
  const fkTableConfig = tableConfigsMap[fkTable as string];

  if (fkTableConfig) {
    const nestedField = fkTableConfig.fields.find((f) => f.foreignKey);

    if (nestedField && records.some((r) => r && Object.prototype.hasOwnProperty.call(r, nestedField.name))) {
      const nestedFk = nestedField.foreignKey!;
      const ids = Array.from(new Set(records.map((r) => r[nestedField.name]).filter(Boolean)));

      const refMap = new Map<any, Record<string, any>>();
      // if (ids.length > 0) {
      //   const { data: refData, error: refError } = await supabase
      //     .from(nestedFk.table)
      //     .select("*")
      //     .in(nestedFk.valueField, ids as any[]);

      //   if (!refError && refData) {
      //     refData.forEach((d) => refMap.set(d[nestedFk.valueField], d as Record<string, any>));
      //   }
      // }

      const refTableConfig = tableConfigsMap[nestedFk.table as string];

      return records.map((rec) => {
        const refId = rec[nestedField.name];
        const ref = refId ? refMap.get(refId) : null;

        let label: string | undefined;

        if (ref && refTableConfig) {
          const nameParts: string[] = [];
          const tryFields = ["nombre", "nombres", "first_name", "apellido_paterno", "apellido_materno", "last_name"];
          for (const f of tryFields) {
            if (ref[f]) nameParts.push(String(ref[f]));
          }
          if (nameParts.length > 0) {
            label = nameParts.join(" ");
          }
        }

        if (!label && ref) {
          label = String(ref[nestedFk.labelField] ?? "");
        }

        const fallbackLabel = rec[fk.labelField] ?? "";

        return {
          value: String(rec[fk.valueField]),
          label: label && label.trim() !== "" ? label : String(fallbackLabel),
        };
      });
    }
  }

  return records.map((row) => {
    const record = row as Record<string, string | number>;
    return {
      value: String(record[fk.valueField]),
      label: String(record[fk.labelField]),
    };
  });
}

export async function fetchOptionsForTable<T extends TableName>(
  table: T,
): Promise<Record<string, SelectOption[]>> {
  const config = TABLE_CONFIGS[table];
  //console.log(config)
  if (!config) return {};

  const options: Record<string, SelectOption[]> = {};

  for (const field of config.fields) {
    if (field.foreignKey) {
      options[field.name] = await fetchFieldOptions(table, field.name);
    }
  }

  return options;
}

export async function createRecord<T extends TableName>(
  table: T,
  formData: FormData,
): Promise<{ success: boolean; data?: any; error?: string }> {
  const config = TABLE_CONFIGS[table];

  try {
    const payload = buildPayload(formData, config, "create") as TableInsert<T>;
    const supabase = await createClient();

    const { data, error } = await supabase.from(table).insert(payload).select();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${table}`);
    return { success: true, data: Array.isArray(data) ? data[0] : data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function updateRecord<T extends TableName>(
  table: T,
  formData: FormData,
): Promise<{ success: boolean; data?: any; error?: string }> {
  const config = TABLE_CONFIGS[table];

  try {
    const payload = buildPayload(formData, config, "update") as TableUpdate<T>;
    const filter = buildPrimaryKeyFilter(config, formData);
    const supabase = await createClient();

    let query = supabase.from(table).update(payload);

    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${table}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function deleteRecord<T extends TableName>(
  table: T,
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const config = TABLE_CONFIGS[table];

  try {
    const filter = buildPrimaryKeyFilter(config, formData);
    const supabase = await createClient();

    let query = supabase.from(table).delete();

    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${table}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
