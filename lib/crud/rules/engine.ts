import { isAutoIncrementField } from "@/lib/crud/utils";

import type {
  FieldConfig,
  TableConfig,
} from "@/lib/crud/types";

import type {
  FieldRule,
  FormMode,
  FormValues,
  ModeFlag,
  ResolvedFieldState,
  TableRules,
} from "./types";

import {
  modeMatches,
  whenMatches,
} from "./conditions";

/**
 * Normaliza "update" a "edit".
 */
export function toFormMode(
  mode: FormMode | "update",
): FormMode {
  return mode === "update"
    ? "edit"
    : mode;
}

/**
 * Convierte una regla individual
 * en una lista de reglas.
 */
function asRuleList(
  rule:
    | FieldRule
    | FieldRule[]
    | undefined,
): FieldRule[] {
  if (!rule) {
    return [];
  }

  return Array.isArray(rule)
    ? rule
    : [rule];
}

/**
 * Determina si un flag debe aplicarse.
 */
function flagApplies(
  flag: ModeFlag | undefined,
  mode: FormMode,
): boolean {
  if (
    flag === undefined ||
    flag === false
  ) {
    return false;
  }

  if (flag === true) {
    return true;
  }

  return modeMatches(flag, mode);
}

/**
 * Obtiene las reglas de campos
 * de la configuración.
 *
 * Mantiene compatibilidad con tu
 * estructura anterior:
 *
 * rules: {
 *   campo: {...}
 * }
 *
 * y también permite:
 *
 * rules: {
 *   fields: {
 *     campo: {...}
 *   }
 * }
 */
function getFieldRules(
  config: TableConfig,
): TableRules {
  const rules = config.rules;

  if (!rules) {
    return {};
  }

  /**
   * Nueva estructura:
   *
   * rules: {
   *   fields: {...}
   * }
   */
  if (
    typeof rules === "object" &&
    "fields" in rules
  ) {
    return (
      rules.fields ?? {}
    ) as TableRules;
  }

  /**
   * Compatibilidad con la estructura
   * anterior.
   */
  return rules as TableRules;
}

/**
 * Calcula el estado final de un campo.
 */
export function resolveFieldState(
  config: TableConfig,
  field: FieldConfig,
  mode: FormMode | "update",
  values: FormValues = {},
): ResolvedFieldState {
  const formMode = toFormMode(mode);

  /**
   * Estado inicial basado en
   * la configuración del campo.
   */
  const state: ResolvedFieldState = {
    hidden: Boolean(
      field.hiddenInForm,
    ),

    disabled: Boolean(
      field.disabled ||
        (
          formMode === "edit" &&
          field.readOnlyOnEdit
        ),
    ),

    required: Boolean(
      field.required,
    ),

    omit: Boolean(
      field.hiddenInForm ||
        (
          formMode === "edit" &&
          (
            field.readOnlyOnEdit ||
            field.disabled
          )
        ),
    ),
  };

  /**
   * Los campos autoincrementales
   * no se muestran al crear.
   */
  if (
    formMode === "create" &&
    isAutoIncrementField(
      field,
      config,
    )
  ) {
    state.hidden = true;
    state.omit = true;
    state.required = false;
  }

  /**
   * Aplicar reglas dinámicas.
   */
  const fieldRules =
    getFieldRules(config);

  for (
    const rule of asRuleList(
      fieldRules[field.name],
    )
  ) {
    /**
     * Si la condición no se cumple,
     * pasamos a la siguiente regla.
     */
    if (
      !whenMatches(
        rule.when,
        formMode,
        values,
      )
    ) {
      continue;
    }

    if (
      flagApplies(
        rule.hide,
        formMode,
      )
    ) {
      state.hidden = true;
    }

    if (
      flagApplies(
        rule.disable,
        formMode,
      )
    ) {
      state.disabled = true;
    }

    if (
      flagApplies(
        rule.require,
        formMode,
      )
    ) {
      state.required = true;
    }

    if (
      flagApplies(
        rule.omit,
        formMode,
      )
    ) {
      state.omit = true;
    }
  }

  /**
   * Un campo oculto no puede ser
   * requerido.
   */
  if (state.hidden) {
    state.omit = true;
    state.required = false;
  }

  /**
   * Un campo deshabilitado tampoco
   * debe enviarse.
   */
  if (state.disabled) {
    state.omit = true;
    state.required = false;
  }

  return state;
}

/**
 * Convierte FormData en FormValues.
 */
export function formDataToValues(
  formData: FormData,
  config: TableConfig,
): FormValues {
  const values: FormValues = {};

  for (
    const field of config.fields
  ) {
    const raw = formData.get(
      field.name,
    );

    values[field.name] =
      raw === null
        ? ""
        : String(raw);
  }

  return values;
}