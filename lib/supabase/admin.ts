import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con service role. SOLO para Server Actions / rutas de servidor,
 * siempre después de validar que quien llama es admin (requireRole).
 * Sin sesión persistente y con flujo implícito: los correos enviados
 * no dependen de cookies del admin (usan token_hash en /auth/confirm).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, flowType: "implicit" },
  });
}

/** Cliente anónimo sin sesión, para disparar correos (magic link / recovery). */
export function createStatelessClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false, flowType: "implicit" },
  });
}

