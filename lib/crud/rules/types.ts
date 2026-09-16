export type FormMode = "create" | "edit";

/**
 * true = siempre
 * false = nunca
 * "create" = solo creación
 * "edit" = solo edición
 * array = varios modos
 */
export type ModeFlag = boolean | FormMode | FormMode[];

/**
 * Valores actuales del formulario.
 */
export type FormValues = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Condición que puede utilizar una regla.
 *
 * Ejemplos:
 *
 * { field: "estado", eq: "activo" }
 * { field: "ruc", empty: true }
 * { field: "tipo", in: ["empresa", "proveedor"] }
 */
export interface FieldCondition {
  /**
   * Restringe la condición a create y/o edit.
   */
  mode?: FormMode | FormMode[];

  /**
   * Campo que será evaluado.
   *
   * Si se omite, solamente se evalúa "mode".
   */
  field?: string;

  /**
   * Igual a.
   */
  eq?: unknown;

  /**
   * Diferente de.
   */
  neq?: unknown;

  /**
   * Pertenece a una lista.
   */
  in?: unknown[];

  /**
   * El campo está vacío.
   */
  empty?: boolean;

  /**
   * El campo tiene un valor.
   */
  filled?: boolean;

  /**
   * El valor del campo es estrictamente mayor al valor de otro campo.
   *
   * Útil para comparar fechas: { field: "fecha_recibido", gtField: "fecha_entregado" }
   * → activa la condición si fecha_recibido > fecha_entregado.
   *
   * La comparación se hace lexicográficamente (válido para strings "YYYY-MM-DD").
   */
  gtField?: string;

  /**
   * El valor del campo es estrictamente menor al valor de otro campo.
   *
   * { field: "fecha_inicio", ltField: "fecha_fin" }
   * → activa la condición si fecha_inicio < fecha_fin.
   */
  ltField?: string;


  ltFieldMayor?: string;

  /**
   * Lista de campos que forman el grupo de exclusión mutua.
   *
   * Se usa junto a `onlyOneSelected: true`.
   * Ejemplo: ["id_propietarios", "id_contratos", "id_inmuebles"]
   */
  groupFields?: string[];

  /**
   * Si es `true`, deshabilita todos los demás campos del grupo
   * (`groupFields`) en cuanto alguno de ellos tenga un valor.
   *
   * Cada campo del grupo debe tener una regla con:
   *   when: { onlyOneSelected: true, groupFields: [...] }
   *   disable: true
   */
  onlyOneSelected?: boolean;
}

/**
 * Regla relacionada con el comportamiento de un campo.
 */
export interface FieldRule {
  /**
   * Condición que debe cumplirse para ejecutar la regla.
   *
   * Si se omite, la regla siempre aplica.
   */
  when?: FieldCondition | FieldCondition[];

  /**
   * Ocultar el campo.
   */
  hide?: ModeFlag;

  /**
   * Deshabilitar el campo.
   */
  disable?: ModeFlag;

  /**
   * Hacer obligatorio el campo.
   */
  require?: ModeFlag;

  /**
   * No incluir el campo en el payload.
   */
  omit?: ModeFlag;
}

/**
 * Reglas de campos.
 *
 * Ejemplo:
 *
 * {
 *   ruc: {
 *     when: {
 *       field: "tipo_persona",
 *       eq: "empresa"
 *     },
 *     require: true
 *   }
 * }
 */
export type TableRules = Record<
  string,
  FieldRule | FieldRule[]
>;

/**
 * Regla de validación de negocio.
 *
 * A diferencia de FieldRule, esta regla no modifica
 * la interfaz del formulario.
 *
 * Sirve para determinar si una operación es válida.
 */
export interface BusinessRule {
  /**
   * Identificador único de la regla.
   */
  id: string;

  /**
   * Condición que provoca el error.
   */
  when: FieldCondition | FieldCondition[];

  /**
   * Mensaje que se mostrará al usuario.
   */
  message: string;
}

/**
 * Configuración completa de reglas de una tabla.
 */
export interface TableRulesConfig {
  /**
   * Reglas relacionadas con los campos.
   */
  fields?: TableRules;

  /**
   * Reglas de negocio que deben cumplirse
   * antes de guardar.
   */
  validations?: BusinessRule[];
}

/**
 * Estado final calculado para un campo.
 */
export interface ResolvedFieldState {
  hidden: boolean;
  disabled: boolean;
  required: boolean;
  omit: boolean;
}

/**
 * Resultado de una validación de negocio.
 */
export interface BusinessRuleError {
  ruleId: string;
  message: string;
}

/**
 * Resultado completo del motor de validaciones.
 */
export interface ValidationResult {
  valid: boolean;
  errors: BusinessRuleError[];
}