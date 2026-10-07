import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/database.types";

export type Profile = Tables<"profiles">;
export type Persona = Tables<"personas">;

export type Session = {
  user: User;
  profile: Profile | null;
  persona: Persona | null;
};

/**
 * Devuelve el usuario autenticado con su profile y persona.
 * Se cachea por request (React `cache`) para no repetir consultas.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, persona:personas(*)")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { user, profile: null, persona: null };

  const { persona, ...rest } = profile as Profile & { persona: Persona | null };
  return { user, profile: rest, persona: persona ?? null };
});

/** Exige sesión; si no hay, redirige al login. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Exige que el usuario tenga alguno de los roles indicados. */
export async function requireRole(...roles: string[]): Promise<Session> {
  const session = await requireSession();
  const role = session.profile?.role ?? "";
  if (!roles.includes(role)) redirect("/?error=sin-permiso");
  return session;
}

/** Nombre a mostrar: persona > profile.full_name > email. */
export function getDisplayName(session: Session): string {
  const { persona, profile, user } = session;
  const fromPersona = [persona?.nombre, persona?.apellido_paterno].filter(Boolean).join(" ");
  return fromPersona || profile?.full_name || user.email || "Usuario";
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
