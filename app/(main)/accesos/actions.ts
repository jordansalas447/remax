"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { registrarSesionAcceso } from "@/lib/auth/acceso";
import type { HorarioDia } from "./types";

export type GuardarAccesoResult = { ok: true } | { ok: false; error: string };

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function guardarAcceso(
  userId: string,
  activo: boolean,
  horarios: HorarioDia[],
): Promise<GuardarAccesoResult> {
  // Doble verificación: la RPC también valida es_admin()
  const session = await requireRole("admin");

  const vistos = new Set<number>();
  for (const h of horarios) {
    if (!Number.isInteger(h.dia_semana) || h.dia_semana < 0 || h.dia_semana > 6) {
      return { ok: false, error: "Día de la semana inválido." };
    }
    if (vistos.has(h.dia_semana)) return { ok: false, error: "Hay días duplicados." };
    vistos.add(h.dia_semana);
    if (!HORA.test(h.hora_inicio) || !HORA.test(h.hora_fin)) {
      return { ok: false, error: "Formato de hora inválido." };
    }
    if (h.hora_inicio >= h.hora_fin) {
      return { ok: false, error: "La hora de inicio debe ser menor que la hora de fin." };
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc(
    "admin_guardar_acceso" as never,
    { p_user_id: userId, p_activo: activo, p_horarios: horarios } as never,
  );
  if (error) return { ok: false, error: `No se pudo guardar: ${error.message}` };

  // Guardar elimina las sesiones registradas del usuario. Si el admin se
  // editó a sí mismo, se vuelve a registrar la sesión actual para no expulsarlo.
  if (userId === session.user.id) await registrarSesionAcceso(supabase);

  revalidatePath("/accesos");
  return { ok: true };
}
