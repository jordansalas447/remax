import type { TableConfig } from "@/lib/crud/types";

import type {
  BusinessRule,
  BusinessRuleError,
  FormMode,
  FormValues,
  ValidationResult,
} from "./types";

import {
  whenMatches,
} from "./conditions";

/**
 * Obtiene las validaciones configuradas
 * para la tabla.
 */
function getBusinessRules(
  config: TableConfig,
): BusinessRule[] {
  const rules = config.rules;

  if (!rules) {
    return [];
  }

  /**
   * Nueva estructura:
   *
   * rules: {
   *   validations: [...]
   * }
   */
  if (
    typeof rules === "object" &&
    "validations" in rules
  ) {
    return (
      rules.validations ?? []
    ) as BusinessRule[];
  }

  return [];
}

/**
 * Ejecuta todas las reglas de negocio.
 *
 * Devuelve los errores encontrados.
 */
export function validateBusinessRules(
  config: TableConfig,
  values: FormValues,
  mode: FormMode | "update",
): ValidationResult {
  const formMode =
    mode === "update"
      ? "edit"
      : mode;

  const rules =
    getBusinessRules(config);

  const errors: BusinessRuleError[] =
    [];

  for (const rule of rules) {
    /**
     * Si la condición se cumple,
     * significa que la regla se activa
     * y debemos impedir el guardado.
     */
    if (
      whenMatches(
        rule.when,
        formMode,
        values,
      )
    ) {
      errors.push({
        ruleId: rule.id,
        message: rule.message,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}