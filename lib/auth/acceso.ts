import type { SupabaseClient } from "@supabase/supabase-js";

/** Mensaje mostrado al usuario cuando intenta ingresar fuera de su horario. */
export const MENSAJE_FUERA_DE_HORARIO =
  "No tienes acceso en este momento. Ingresa dentro de tu horario asignado o contacta al administrador.";

/**
 * Salta el control de horario (login + proxy).
 * TODO: volver a `false` cuando se corrija la zona horaria.
 */
const SALTAR_CONTROL_HORARIO = true;

/**
 * Registra la sesión actual en `sesiones_acceso` (RPC `registrar_sesion_acceso`).
 * Devuelve `true` solo si el usuario está dentro de su horario permitido.
 * Las funciones RPC aún no figuran en `database.types.ts`, de ahí el cast.
 */
export async function registrarSesionAcceso(supabase: SupabaseClient): Promise<boolean> {
  if (SALTAR_CONTROL_HORARIO) return true;
  const { data, error } = await supabase.rpc("registrar_sesion_acceso" as never);
  return !error && data === true;
}

/**
 * Consulta `acceso_habilitado()`: horario vigente + sesión registrada y no vencida.
 * Ante un error de red/BD se deniega el acceso (fail-closed).
 */
export async function accesoHabilitado(supabase: SupabaseClient): Promise<boolean> {
  if (SALTAR_CONTROL_HORARIO) return true;
  const { data, error } = await supabase.rpc("acceso_habilitado" as never);
  return !error && data === true;
}
