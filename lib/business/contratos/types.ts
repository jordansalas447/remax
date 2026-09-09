import type {
  Contrato,
  Asociados,
  Propiedad,
} from "@/lib/types/database";

// ---------------------------------------------------------------------------
// Contratos con relaciones expandidas
// ---------------------------------------------------------------------------

/**
 * Contrato con sus relaciones principales expandidas.
 *
 * Devuelto por `getContratoConDetalle`.
 */
export interface ContratoDetalle {
  contrato: Contrato;
  propiedad: Propiedad | null;
  asociado: Asociados | null;
}

// ---------------------------------------------------------------------------
// Cambio de estado
// ---------------------------------------------------------------------------

/**
 * Identificadores de estado de contrato (deben coincidir con los ids
 * de la tabla `estado` en la base de datos).
 *
 * TODO: completar con los ids reales de tu tabla `estado`.
 */
export const ESTADO_CONTRATO = {
  ACTIVO: 1,
  EN_PROCESO: 2,
  CERRADO: 3,
  CANCELADO: 4,
} as const;

export type EstadoContratoId =
  (typeof ESTADO_CONTRATO)[keyof typeof ESTADO_CONTRATO];

/**
 * Transiciones de estado permitidas.
 *
 * Clave = estado actual, valor = lista de estados a los que puede moverse.
 *
 * TODO: ajusta las transiciones según las reglas reales del negocio.
 */
export const TRANSICIONES_PERMITIDAS: Record<EstadoContratoId, EstadoContratoId[]> = {
  [ESTADO_CONTRATO.ACTIVO]:    [ESTADO_CONTRATO.EN_PROCESO, ESTADO_CONTRATO.CANCELADO],
  [ESTADO_CONTRATO.EN_PROCESO]:[ESTADO_CONTRATO.CERRADO, ESTADO_CONTRATO.CANCELADO],
  [ESTADO_CONTRATO.CERRADO]:   [],                          // estado terminal
  [ESTADO_CONTRATO.CANCELADO]: [],                          // estado terminal
};

/**
 * Payload para cambiar el estado de un contrato.
 */
export interface CambiarEstadoInput {
  idContrato: number;
  nuevoEstado: EstadoContratoId;
}

// ---------------------------------------------------------------------------
// Cerrar contrato
// ---------------------------------------------------------------------------

/**
 * Payload para cerrar un contrato.
 */
export interface CerrarContratoInput {
  idContrato: number;
  /** Precio final acordado. */
  precioVenta: number;
  /** Comisión aplicada. */
  comision: number;
  /** Fecha en que se firmó el contrato final. */
  fechaContratoEntregado: string; // YYYY-MM-DD
}
