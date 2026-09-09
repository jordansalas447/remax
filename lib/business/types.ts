import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/database.types";

/**
 * Cliente Supabase tipado con el schema de la base de datos.
 *
 * Se pasa como parámetro a cada función de servicio para
 * facilitar las pruebas y evitar crear múltiples instancias.
 */
export type DbClient = SupabaseClient<Database>;

/**
 * Categorías de error de negocio.
 *
 * Permiten al llamador diferenciar el tipo de falla
 * sin necesidad de parsear mensajes de texto.
 */
export type BusinessErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "TRANSITION_NOT_ALLOWED"
  | "DB_ERROR"
  | "UNAUTHORIZED";

/**
 * Error estructurado de negocio.
 *
 * Combina un código legible por máquina con un mensaje
 * legible por humanos para mostrar en la UI.
 */
export interface BusinessError {
  code: BusinessErrorCode;
  message: string;
}

/**
 * Helpers para construir BusinessErrors sin repetir código.
 */
export const BusinessErrors = {
  notFound: (entity: string, id?: string | number): BusinessError => ({
    code: "NOT_FOUND",
    message: id
      ? `No se encontró ${entity} con id "${id}".`
      : `No se encontró ${entity}.`,
  }),

  validation: (message: string): BusinessError => ({
    code: "VALIDATION_ERROR",
    message,
  }),

  transitionNotAllowed: (from: string, to: string): BusinessError => ({
    code: "TRANSITION_NOT_ALLOWED",
    message: `No se puede pasar del estado "${from}" a "${to}".`,
  }),

  dbError: (message: string): BusinessError => ({
    code: "DB_ERROR",
    message: `Error de base de datos: ${message}`,
  }),

  unauthorized: (action: string): BusinessError => ({
    code: "UNAUTHORIZED",
    message: `No tiene permiso para "${action}".`,
  }),
} as const;
