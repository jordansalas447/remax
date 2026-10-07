"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
  /** Valores enviados, para no perderlos si hay error. */
  fields?: Record<string, string>;
};

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** Solo permite redirecciones internas (evita open-redirect). */
const safeNext = (next: string | null | undefined) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

async function getOrigin() {
  const h = await headers();
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    h.get("origin") ??
    `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`
  );
}

/** Traduce los mensajes de error más comunes de Supabase Auth. */
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed")) return "Debes confirmar tu correo antes de iniciar sesión.";
  if (m.includes("user already registered")) return "Ya existe una cuenta con este correo.";
  if (m.includes("password should be at least")) return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many")) return "Demasiados intentos. Intenta de nuevo en unos minutos.";
  if (m.includes("same password") || m.includes("should be different"))
    return "La nueva contraseña debe ser distinta a la actual.";
  return message;
}

// ---------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------
export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = str(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(str(formData, "next"));

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña.", fields: { email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: translateAuthError(error.message), fields: { email } };

  revalidatePath("/", "layout");
  redirect(next);
}

// ---------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------
export async function signup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const fields = {
    nombre: str(formData, "nombre"),
    apellido_paterno: str(formData, "apellido_paterno"),
    apellido_materno: str(formData, "apellido_materno"),
    email: str(formData, "email"),
  };
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");

  if (!fields.nombre || !fields.email) return { error: "Nombre y correo son obligatorios.", fields };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres.", fields };
  if (password !== confirm) return { error: "Las contraseñas no coinciden.", fields };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: fields.email,
    password,
    options: {
      // Estos datos los usa el trigger handle_new_user para crear la persona
      data: {
        nombre: fields.nombre,
        apellido_paterno: fields.apellido_paterno,
        apellido_materno: fields.apellido_materno,
      },
      emailRedirectTo: `${await getOrigin()}/auth/confirm?next=/`,
    },
  });

  if (error) return { error: translateAuthError(error.message), fields };

  // Si la confirmación de correo está desactivada, ya hay sesión
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  return {
    success: `Te enviamos un correo a ${fields.email}. Confirma tu cuenta para poder ingresar.`,
  };
}

// ---------------------------------------------------------------------
// Cerrar sesión
// ---------------------------------------------------------------------
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ---------------------------------------------------------------------
// Recuperar contraseña (envía el correo)
// ---------------------------------------------------------------------
export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = str(formData, "email");
  if (!email) return { error: "Ingresa tu correo.", fields: { email } };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await getOrigin()}/auth/confirm?next=/restablecer-contrasena`,
  });

  if (error) return { error: translateAuthError(error.message), fields: { email } };

  // Mensaje genérico: no revelamos si el correo existe
  return { success: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña." };
}

// ---------------------------------------------------------------------
// Actualizar contraseña (desde el enlace de recuperación o el perfil)
// ---------------------------------------------------------------------
export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  const redirectAfter = str(formData, "redirect_to");

  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };
  if (password !== confirm) return { error: "Las contraseñas no coinciden." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateAuthError(error.message) };

  if (redirectAfter) redirect(safeNext(redirectAfter));
  return { success: "Contraseña actualizada correctamente." };
}

// ---------------------------------------------------------------------
// Actualizar datos personales (tabla personas, vía RPC segura)
// ---------------------------------------------------------------------
const PERSONA_FIELDS = [
  "nombre",
  "apellido_paterno",
  "apellido_materno",
  "documento_identidad",
  "fecha_nacimiento",
  "numero_telefono",
  "numero_telefono_2",
  "correo_electronico_2",
  "direccion",
] as const;

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const payload = Object.fromEntries(PERSONA_FIELDS.map((k) => [k, str(formData, k)]));

  if (!payload.nombre) return { error: "El nombre es obligatorio.", fields: payload };

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_my_persona" as never, { payload } as never);

  if (error) return { error: `No se pudo guardar: ${error.message}`, fields: payload };

  revalidatePath("/", "layout");
  return { success: "Datos actualizados correctamente.", fields: payload };
}
