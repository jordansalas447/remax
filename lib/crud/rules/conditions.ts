import type {
  FieldCondition,
  FormMode,
  FormValues,
} from "./types";

/**
 * Determina si un valor está vacío.
 */
export function isEmptyValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === ""
  );
}

/**
 * Compara dos valores de forma segura para formularios.
 *
 * Por ejemplo:
 *
 * 1 === "1" → true
 *
 * Esto es útil porque FormData normalmente
 * devuelve strings.
 */
export function scalarEquals(
  left: unknown,
  right: unknown,
): boolean {
  if (
    isEmptyValue(left) &&
    isEmptyValue(right)
  ) {
    return true;
  }

  return String(left) === String(right);
}

/**
 * Determina si el modo actual coincide
 * con el modo permitido.
 */
export function modeMatches(
  allowed: FormMode | FormMode[] | undefined,
  mode: FormMode,
): boolean {
  if (!allowed) {
    return true;
  }

  return Array.isArray(allowed)
    ? allowed.includes(mode)
    : allowed === mode;
}

/**
 * Evalúa una condición individual.
 */
export function conditionMatches(
  condition: FieldCondition,
  mode: FormMode,
  values: FormValues,
): boolean {
  /**
   * Primero verificamos el modo.
   */
  if (!modeMatches(condition.mode, mode)) {
    return false;
  }

  /**
   * Si no tiene campo, la condición
   * solamente depende del modo.
   */
  if (!condition.field) {
    return true;
  }

  const value = values[condition.field];

  /**
   * empty
   */
  if (condition.empty !== undefined) {
    if (
      isEmptyValue(value) !== condition.empty
    ) {
      return false;
    }
  }

  /**
   * filled
   */
  if (condition.filled !== undefined) {
    if (
      isEmptyValue(value) === condition.filled
    ) {
      return false;
    }
  }

  /**
   * eq
   */
  if (condition.eq !== undefined) {
    if (
      !scalarEquals(value, condition.eq)
    ) {
      return false;
    }
  }

  /**
   * neq
   */
  if (condition.neq !== undefined) {
    if (
      scalarEquals(value, condition.neq)
    ) {
      return false;
    }
  }

  /**
   * in
   */
  if (condition.in) {
    const matches = condition.in.some(
      (item) =>
        scalarEquals(value, item),
    );

    if (!matches) {
      return false;
    }
  }

  /**
   * gtField / ltField
   *
   * Compara el valor del campo actual contra el valor
   * de otro campo del formulario.
   *
   * Funciona correctamente con fechas "YYYY-MM-DD"
   * porque el orden lexicográfico coincide con el cronológico.
   */
  if (condition.gtField !== undefined) {
    const otherValue = values[condition.gtField];
    if (isEmptyValue(value) || isEmptyValue(otherValue)) {
      return false;
    }
    if (!(String(value) > String(otherValue))) {
      return false;
    }
  }

  if (condition.ltField !== undefined) {
    const otherValue = values[condition.ltField];
    if (isEmptyValue(value) || isEmptyValue(otherValue)) {
      return false;
    }
    if (!(String(value) < String(otherValue))) {
      return false;
    }
  }

  /**
   * onlyOneSelected: true
   *
   * Cuando esta opción está activa, la condición devuelve `true`
   * (es decir, la regla asociada — normalmente `disable: true` — se aplica)
   * si algún campo del grupo que NO sea el campo actual ya tiene un valor.
   *
   * En otras palabras: "desactiva este campo si otro del grupo ya fue seleccionado".
   *
   * El campo actual se identifica mediante `condition.field`.
   * El grupo se define con `groupFields: string[]`.
   *
   * Ejemplo de regla completa en la config de tabla:
   *
   *   id_propietarios: {
   *     when: {
   *       field: "id_propietarios",
   *       onlyOneSelected: true,
   *       groupFields: ["id_propietarios", "id_contratos", "id_inmuebles"]
   *     },
   *     disable: true
   *   }
   */
  if (condition.onlyOneSelected && Array.isArray(condition.groupFields)) {
    // El campo actual es el definido en condition.field.
    // Verificamos si algún campo DIFERENTE al actual tiene valor.
    const otherFieldHasValue = condition.groupFields.some((fieldName) => {
      // Ignorar el campo actual
      if (fieldName === condition.field) return false;
      return !isEmptyValue(values[fieldName]);
    });

    // Si otro campo del grupo tiene valor → la condición se cumple
    // (la regla disable:true se activará → este campo queda deshabilitado).
    // Si ningún otro campo tiene valor → la condición no se cumple
    // (la regla disable:true no aplica → el campo permanece habilitado).
    if (!otherFieldHasValue) {
      return false;
    }
  }

  return true;
}

/**
 * Evalúa una condición o un conjunto
 * de condiciones.
 *
 * Cuando hay varias condiciones,
 * TODAS deben cumplirse.
 */
export function whenMatches(
  when:
    | FieldCondition
    | FieldCondition[]
    | undefined,
  mode: FormMode,
  values: FormValues,
): boolean {
  if (!when) {
    return true;
  }

  const conditions = Array.isArray(when)
    ? when
    : [when];

  return conditions.every(
    (condition) =>
      conditionMatches(
        condition,
        mode,
        values,
      ),
  );
}