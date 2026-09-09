import { isAutoIncrementField } from "@/lib/crud/utils";
import type { FieldConfig, TableConfig } from "@/lib/crud/types";
import type {
  FieldCondition,
  FieldRule,
  FormMode,
  FormValues,
  ModeFlag,
  ResolvedFieldState,
  TableRules,
} from "@/lib/crud/rules/types";

export function toFormMode(mode: FormMode | "update"): FormMode {
  return mode === "update" ? "edit" : mode;
}

function asRuleList(rule: FieldRule | FieldRule[] | undefined): FieldRule[] {
  if (!rule) return [];
  return Array.isArray(rule) ? rule : [rule];
}

function modeMatches(allowed: FormMode | FormMode[] | undefined, mode: FormMode): boolean {
  if (!allowed) return true;
  return Array.isArray(allowed) ? allowed.includes(mode) : allowed === mode;
}

function flagApplies(flag: ModeFlag | undefined, mode: FormMode): boolean {
  if (flag === undefined || flag === false) return false;
  if (flag === true) return true;
  return modeMatches(flag, mode);
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

function scalarEquals(left: unknown, right: unknown): boolean {
  if (isEmptyValue(left) && isEmptyValue(right)) return true;
  if (typeof left === "boolean" || typeof right === "boolean") {
    return String(left) === String(right);
  }
  return String(left) === String(right);
}

function conditionMatches(condition: FieldCondition, mode: FormMode, values: FormValues): boolean {
  if (!modeMatches(condition.mode, mode)) return false;

  if (!condition.field) return true;

  const value = values[condition.field];

  if (condition.empty !== undefined) {
    if (isEmptyValue(value) !== condition.empty) return false;
  }
  if (condition.filled !== undefined) {
    if (isEmptyValue(value) === condition.filled) return false;
  }
  if (condition.eq !== undefined && !scalarEquals(value, condition.eq)) return false;
  if (condition.neq !== undefined && scalarEquals(value, condition.neq)) return false;
  if (condition.in && !condition.in.some((item) => scalarEquals(value, item))) return false;

  if (condition.gtField !== undefined) {
    const other = values[condition.gtField];
    if (isEmptyValue(value) || isEmptyValue(other)) return false;
    if (!(String(value) > String(other))) return false;
  }

  if (condition.ltField !== undefined) {
    const other = values[condition.ltField];
    if (isEmptyValue(value) || isEmptyValue(other)) return false;
    if (!(String(value) < String(other))) return false;
  }

  return true;
}

function whenMatches(rule: FieldRule, mode: FormMode, values: FormValues): boolean {
  if (!rule.when) return true;
  const conditions = Array.isArray(rule.when) ? rule.when : [rule.when];
  return conditions.every((condition) => conditionMatches(condition, mode, values));
}

export function resolveFieldState(
  config: TableConfig,
  field: FieldConfig,
  mode: FormMode | "update",
  values: FormValues = {},
): ResolvedFieldState {
  const formMode = toFormMode(mode);

  const state: ResolvedFieldState = {
    hidden: Boolean(field.hiddenInForm),
    disabled: Boolean(field.disabled || (formMode === "edit" && field.readOnlyOnEdit)),
    required: Boolean(field.required),
    omit: Boolean(
      field.hiddenInForm ||
        (formMode === "edit" && (field.readOnlyOnEdit || field.disabled)),
    ),
  };

  if (formMode === "create" && isAutoIncrementField(field, config)) {
    state.hidden = true;
    state.omit = true;
    state.required = false;
  }

  /**
   * Extrae las reglas de campo de forma segura,
   * soportando la estructura legacy (TableRules)
   * y la nueva (TableRulesConfig con { fields, validations }).
   */
  const fieldRulesMap: TableRules = (() => {
    const r = config.rules;
    if (!r) return {};
    if (typeof r === "object" && "fields" in r) {
      return (r.fields ?? {}) as TableRules;
    }
    return r as TableRules;
  })();

  for (const rule of asRuleList(fieldRulesMap[field.name])) {
    if (!whenMatches(rule, formMode, values)) continue;
    if (flagApplies(rule.hide, formMode)) state.hidden = true;
    if (flagApplies(rule.disable, formMode)) state.disabled = true;
    if (flagApplies(rule.require, formMode)) state.required = true;
    if (flagApplies(rule.omit, formMode)) state.omit = true;
  }

  if (state.hidden) {
    state.omit = true;
    state.required = false;
  }
  if (state.disabled) {
    state.omit = true;
    state.required = false;
  }

  return state;
}

export function formDataToValues(formData: FormData, config: TableConfig): FormValues {
  const values: FormValues = {};
  for (const field of config.fields) {
    const raw = formData.get(field.name);
    values[field.name] = raw === null ? "" : String(raw);
  }
  return values;
}
