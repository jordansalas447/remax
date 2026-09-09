/**
 * Tipo discriminado que representa el resultado de una operación de negocio.
 *
 * Los servicios NUNCA lanzan excepciones; siempre devuelven un Result.
 *
 * Ejemplo de uso:
 *
 * ```ts
 * const result = await cambiarEstadoContrato(id, nuevoEstado, supabase);
 *
 * if (!result.ok) {
 *   return { success: false, error: result.error };
 * }
 *
 * return { success: true, data: result.value };
 * ```
 */
export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Construye un resultado exitoso.
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * Construye un resultado fallido.
 */
export function fail<E = string>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Transforma el valor de un Result exitoso.
 *
 * Si es un error, lo propaga tal cual.
 */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (!result.ok) {
    return result;
  }

  return ok(fn(result.value));
}

/**
 * Convierte un bloque async que puede lanzar en un Result.
 *
 * Útil para envolver llamadas a Supabase que podrían fallar.
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  onError?: (err: unknown) => string,
): Promise<Result<T, string>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (err) {
    const message = onError
      ? onError(err)
      : err instanceof Error
        ? err.message
        : "Error desconocido";

    return fail(message);
  }
}
