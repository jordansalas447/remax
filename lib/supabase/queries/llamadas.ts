import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

/**
 * Obtiene llamadas propietarios con filtros y paginación
 */
export async function getLlamadasPropietarios(id_asociado?: {}): Promise<any[]> {
  const supabase = createClient();
  let query = supabase
    .from('vista_llamadas_propietarios')
    .select('*')
    .order('asociado', { ascending: true });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}