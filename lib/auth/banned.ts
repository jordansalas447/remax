import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** IDs de usuarios actualmente baneados. Llamar solo tras validar rol admin. */
export async function getBannedUserIds(): Promise<string[]> {
  try {
    const { data, error } = await createAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) return [];
    const now = Date.now();
    return data.users
      .filter((u) => u.banned_until && new Date(u.banned_until).getTime() > now)
      .map((u) => u.id);
  } catch {
    return [];
  }
}

