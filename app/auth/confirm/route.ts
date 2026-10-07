import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Destino de los enlaces de los correos de Supabase
 * (confirmación de cuenta, recuperación de contraseña, magic link…).
 * Soporta tanto el flujo PKCE (`?code=`) como `?token_hash=&type=`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  const supabase = await createClient();
  let error: string | null = null;

  if (code) {
    const res = await supabase.auth.exchangeCodeForSession(code);
    error = res.error?.message ?? null;
  } else if (tokenHash && type) {
    const res = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    error = res.error?.message ?? null;
  } else {
    error = "Enlace inválido";
  }

  if (error) {
    const url = new URL("/login", origin);
    url.searchParams.set("error", "El enlace no es válido o ha expirado.");
    return NextResponse.redirect(url);
  }

  const destination = type === "recovery" ? "/restablecer-contrasena" : next;
  return NextResponse.redirect(new URL(destination, origin));
}
