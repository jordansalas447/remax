"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { createAdminClient, createStatelessClient } from "@/lib/supabase/admin";

export type UserActionResult = { ok: true; message: string } | { ok: false; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** ~100 años: equivalente a baneo indefinido. */
const BAN_INDEFINIDO = "876000h";

async function getOrigin() {
  const h = await headers();
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`
  );
}

function fail(e: unknown): UserActionResult {
  const msg = e instanceof Error ? e.message : String(e);
  if (/rate limit|too many/i.test(msg)) {
    return { ok: false, error: "Demasiados correos enviados. Intenta de nuevo en unos minutos." };
  }
  return { ok: false, error: msg };
}

/** Envía correo de restablecimiento de contraseña al usuario. */
export async function enviarResetPassword(email: string): Promise<UserActionResult> {
  await requireRole("admin");
  if (!EMAIL.test(email)) return { ok: false, error: "Correo inválido." };
  try {
    const { error } = await createStatelessClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${await getOrigin()}/auth/confirm?next=/restablecer-contrasena`,
    });
    if (error) return fail(error);
    return { ok: true, message: `Enlace de restablecimiento enviado a ${email}.` };
  } catch (e) {
    return fail(e);
  }
}

/** Envía un magic link (el usuario debe existir). */
export async function enviarMagicLink(email: string): Promise<UserActionResult> {
  await requireRole("admin");
  if (!EMAIL.test(email)) return { ok: false, error: "Correo inválido." };
  try {
    const { error } = await createStatelessClient().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${await getOrigin()}/auth/confirm?next=/`,
      },
    });
    if (error) return fail(error);
    return { ok: true, message: `Magic link enviado a ${email}.` };
  } catch (e) {
    return fail(e);
  }
}

/** Banea o desbanea a un usuario (Supabase `ban_duration`). */
export async function cambiarBaneo(userId: string, banear: boolean): Promise<UserActionResult> {
  const session = await requireRole("admin");
  if (userId === session.user.id) {
    return { ok: false, error: "No puedes banearte a ti mismo." };
  }
  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(userId, {
      ban_duration: banear ? BAN_INDEFINIDO : "none",
    });
    if (error) return fail(error);
    revalidatePath("/accesos");
    return { ok: true, message: banear ? "Usuario baneado." : "Usuario desbaneado." };
  } catch (e) {
    return fail(e);
  }
}

export type InvitarInput = {
  email: string;
  nombre: string;
  apellido_paterno?: string;
  apellido_materno?: string;
};

/** Envía una invitación por correo; crea el usuario (trigger handle_new_user crea la persona). */
export async function invitarUsuario(input: InvitarInput): Promise<UserActionResult> {
  await requireRole("admin");
  const email = input.email.trim();
  if (!EMAIL.test(email)) return { ok: false, error: "Correo inválido." };
  if (!input.nombre.trim()) return { ok: false, error: "El nombre es obligatorio." };
  try {
    const { error } = await createAdminClient().auth.admin.inviteUserByEmail(email, {
      redirectTo: `${await getOrigin()}/auth/confirm?next=/restablecer-contrasena`,
      data: {
        nombre: input.nombre.trim(),
        apellido_paterno: input.apellido_paterno?.trim() ?? "",
        apellido_materno: input.apellido_materno?.trim() ?? "",
      },
    });
    if (error) {
      if (/already|registered/i.test(error.message)) {
        return { ok: false, error: "Ya existe un usuario con ese correo." };
      }
      return fail(error);
    }
    revalidatePath("/accesos");
    return { ok: true, message: `Invitación enviada a ${email}.` };
  } catch (e) {
    return fail(e);
  }
}
