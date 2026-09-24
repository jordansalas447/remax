"use server";

import { revalidatePath } from "next/cache";
import {
  TABLE_CONFIGS,
  type FieldConfig,
  type TableConfig,
} from "@/lib/crud/config";
import { getPrimaryKeys, isAutoIncrementField } from "@/lib/crud/utils";
import { formDataToValues, resolveFieldState } from "@/lib/crud/rules";
import {
  getDetailCollections,
  getDetailFields,
  parseDetailsFromFormData,
  type DetailRow,
} from "@/lib/crud/details";
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
  sublabel?: string;
}

export interface CrudPageData<T extends TableName = TableName> {
  rows: TableRow<T>[];
  options: Record<string, SelectOption[]>;
}

function parseFieldValue(
  field: FieldConfig,
  raw: FormDataEntryValue | null | undefined,
  required: boolean,
): string | number | boolean | null {
  if (raw === null || raw === undefined || raw === "") {
    if (required) {
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
  const formMode = mode === "update" ? "edit" : "create";
  const values = formDataToValues(formData, config);

  for (const field of config.fields) {
    const state = resolveFieldState(config, field, formMode, values);
    if (state.omit || state.hidden) continue;
    if (mode === "create" && isAutoIncrementField(field, config)) continue;

    payload[field.name] = parseFieldValue(field, formData.get(field.name), state.required);
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
    .is("eliminado", false)
    .order(getPrimaryKeys(config)[0], { ascending: false });

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
      .is("eliminado", false)
      .order(field.foreignKey.labelField, { ascending: false });


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
            const sublabelRaw = fk.sublabelField ? String(rec[fk.sublabelField] ?? "") : "";

            return {
              value: String(rec[fk.valueField]),
              label: label ?? String(fallbackLabel),
              sublabel: sublabelRaw || undefined,
            };
          });

          // console.log(optionsForField)
        } else {
          optionsForField = records.map((row) => {
            const record = row as Record<string, string | number>;
            const sublabelRaw = fk.sublabelField ? String(record[fk.sublabelField] ?? "") : "";
            return {
              value: String(record[fk.valueField]),
              label: String(record[fk.labelField]),
              sublabel: sublabelRaw || undefined,
            };
          });
        }
      } else {
        optionsForField = records.map((row) => {
          const record = row as Record<string, string | number>;
          const sublabelRaw = fk.sublabelField ? String(record[fk.sublabelField] ?? "") : "";
          return {
            value: String(record[fk.valueField]),
            label: String(record[fk.labelField]),
            sublabel: sublabelRaw || undefined,
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
    .is("eliminado", false)
    .order(fk.labelField, { ascending: false });

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
        const sublabelRaw = fk.sublabelField ? String(rec[fk.sublabelField] ?? "") : "";

        return {
          value: String(rec[fk.valueField]),
          label: label && label.trim() !== "" ? label : String(fallbackLabel),
          sublabel: sublabelRaw || undefined,
        };
      });
    }
  }

  return records.map((row) => {
    const record = row as Record<string, string | number>;
    const sublabelRaw = fk.sublabelField ? String(record[fk.sublabelField] ?? "") : "";
    return {
      value: String(record[fk.valueField]),
      label: String(record[fk.labelField]),
      sublabel: sublabelRaw || undefined,
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

function coerceFieldValue(
  field: FieldConfig | undefined,
  raw: unknown,
): string | number | boolean | null {
  if (raw === null || raw === undefined || raw === "") {
    return field?.type === "boolean" ? false : null;
  }
  if (field?.type === "number") {
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (field?.type === "boolean") {
    return raw === true || raw === "true" || raw === "on";
  }
  return raw as string | number | boolean;
}

function detailFieldForState(field: FieldConfig): FieldConfig {
  return { ...field, readOnlyOnEdit: false, hiddenInForm: false };
}

function buildChildPayload(
  childConfig: TableConfig,
  detail: ReturnType<typeof getDetailCollections>[number],
  row: DetailRow,
  parentRecord: Record<string, unknown>,
  mode: "create" | "update",
): RowRecord {
  const payload: RowRecord = {};
  const parentKeyField = childConfig.fields.find((field) => field.name === detail.parentKey);
  payload[detail.parentKey] = coerceFieldValue(parentKeyField, parentRecord.__parentKey__);

  for (const [childFieldName, parentFieldName] of Object.entries(detail.copyFromParent ?? {})) {
    const childField = childConfig.fields.find((field) => field.name === childFieldName);
    payload[childFieldName] = coerceFieldValue(childField, parentRecord[parentFieldName]);
  }

  const formMode = mode === "update" ? "edit" : "create";
  const values = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value ?? ""]),
  );

  for (const field of getDetailFields(childConfig, detail)) {
    const state = resolveFieldState(childConfig, detailFieldForState(field), formMode, values);
    if (state.hidden) continue;
    if (mode === "create" && isAutoIncrementField(field, childConfig)) continue;
    payload[field.name] = parseFieldValue(
      field,
      row[field.name] === null || row[field.name] === undefined ? null : String(row[field.name]),
      state.required,
    );
  }

  return payload;
}

async function persistDetailCollections(
  formData: FormData,
  parentConfig: TableConfig,
  parentRecord: Record<string, unknown>,
): Promise<{ success: boolean; error?: string }> {
  const collections = getDetailCollections(parentConfig);
  if (collections.length === 0) return { success: true };

  const parsed = parseDetailsFromFormData(formData, parentConfig);
  const supabase = await createClient();
  const parentPkField = getPrimaryKeys(parentConfig)[0];

  for (const detail of collections) {
    const childConfig = TABLE_CONFIGS[detail.table];
    if (!childConfig) {
      return { success: false, error: `No se encontró la tabla de detalle "${detail.table}".` };
    }

    const childPk = getPrimaryKeys(childConfig)[0];
    const parentValueField = detail.parentValueField ?? parentPkField;
    const parentKeyValue = parentRecord[parentValueField];
    if (parentKeyValue === undefined || parentKeyValue === null || parentKeyValue === "") {
      return {
        success: false,
        error: `No se pudo resolver "${parentValueField}" para guardar ${detail.label}.`,
      };
    }

    const parentKeyField = childConfig.fields.find((field) => field.name === detail.parentKey);
    const coercedParentKey = coerceFieldValue(parentKeyField, parentKeyValue);
    const incoming = parsed[detail.name] ?? [];

    const { data: existing, error: existingError } = await supabase
      .from(detail.table)
      .select(childPk)
      .eq(detail.parentKey, coercedParentKey as string | number)
      .is("eliminado", false);

    if (existingError) {
      return { success: false, error: existingError.message };
    }

    const existingIds = new Set(
      (existing ?? []).map((item) => String((item as unknown as Record<string, unknown>)[childPk])),
    );
    const keptIds = new Set<string>();

    for (const row of incoming) {
      const isUpdate = row[childPk] !== undefined && row[childPk] !== null && row[childPk] !== "";
      const payload = buildChildPayload(
        childConfig,
        detail,
        row,
        { ...parentRecord, __parentKey__: parentKeyValue },
        isUpdate ? "update" : "create",
      );

      if (isUpdate) {
        const id = coerceFieldValue(
          childConfig.fields.find((field) => field.name === childPk),
          row[childPk],
        );
        keptIds.add(String(id));
        const { error } = await supabase.from(detail.table).update(payload).eq(childPk, id as string | number);
        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await supabase.from(detail.table).insert(payload);
        if (error) return { success: false, error: error.message };
      }
    }

    for (const id of existingIds) {
      if (keptIds.has(id)) continue;
      const { error } = await supabase
        .from(detail.table)
        .update({ eliminado: true })
        .eq(childPk, coerceFieldValue(childConfig.fields.find((field) => field.name === childPk), id) as string | number);
      if (error) return { success: false, error: error.message };
    }
  }

  return { success: true };
}

export async function fetchDetailRows(
  table: TableName,
  parentKey: string,
  parentValue: string | number,
): Promise<DetailRow[]> {
  const config = TABLE_CONFIGS[table];
  if (!config) return [];

  const supabase = await createClient();
  const parentField = config.fields.find((field) => field.name === parentKey);
  const coerced = coerceFieldValue(parentField, parentValue);

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq(parentKey, coerced as string | number)
    .is("eliminado", false)
    .order(getPrimaryKeys(config)[0], { ascending: true });

  if (error || !data) return [];
  return data as DetailRow[];
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

    const inserted = (Array.isArray(data) ? data[0] : data) as Record<string, unknown> | undefined;
    const persist = await persistDetailCollections(formData, config, {
      ...(payload as Record<string, unknown>),
      ...(inserted ?? {}),
    });
    if (!persist.success) {
      return {
        success: false,
        error: persist.error ?? "El registro se creó, pero no se pudieron guardar los detalles.",
      };
    }

    revalidatePath(`/${table}`);
    return { success: true, data: inserted };
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

    let query = supabase
      .from(table)
      .update(payload)
      .is("eliminado", false);

    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    const persist = await persistDetailCollections(formData, config, {
      ...(payload as Record<string, unknown>),
      ...filter,
    });
    if (!persist.success) {
      return {
        success: false,
        error: persist.error ?? "Los cambios de cabecera se guardaron, pero no los detalles.",
      };
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

    let query = supabase
      .from(table)
      .update({
        eliminado: true,
      });

    for (const [key, value] of Object.entries(filter)) {
      query = query.eq(key, value);
    }

    const { error } = await query;

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath(`/${table}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido",
    };
  }
}
