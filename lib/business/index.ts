/**
 * Barrel de la capa de lógica de negocio.
 *
 * Importa desde aquí en los Server Actions:
 *
 * ```ts
 * import { cambiarEstadoContrato } from "@/lib/business";
 * ```
 *
 * Para añadir un nuevo módulo de dominio:
 * 1. Crea `lib/business/<dominio>/types.ts`
 * 2. Crea `lib/business/<dominio>/service.ts`
 * 3. Re-exporta aquí las funciones públicas.
 */

// Utilidades Result
export type { Result } from "./result";
export { ok, fail, mapResult, tryCatch } from "./result";

// Tipos compartidos
export type { DbClient, BusinessError, BusinessErrorCode } from "./types";
export { BusinessErrors } from "./types";

// ---------------------------------------------------------------------------
// Módulo: Contratos
// ---------------------------------------------------------------------------
export type {
  ContratoDetalle,
  CambiarEstadoInput,
  CerrarContratoInput,
  EstadoContratoId,
} from "./contratos/types";

export {
  ESTADO_CONTRATO,
  TRANSICIONES_PERMITIDAS,
} from "./contratos/types";

export {
  getContratoConDetalle,
  cambiarEstadoContrato,
  cerrarContrato,
} from "./contratos/service";

// ---------------------------------------------------------------------------
// TODO: Módulo: Inmuebles
// ---------------------------------------------------------------------------
// export { ... } from "./inmuebles/service";

// ---------------------------------------------------------------------------
// TODO: Módulo: Revisiones
// ---------------------------------------------------------------------------
// export { ... } from "./revisiones/service";
