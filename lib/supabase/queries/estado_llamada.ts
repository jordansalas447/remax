import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type EstadoLlamadaRow = Database['public']['Tables']['estado_llamada']['Row'];

export type EstadoLlamadas = EstadoLlamadaRow & {
  estado_llamadas:[] | []
}

export async function getEstadoLlamadas(): Promise<EstadoLlamadaRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('estado_llamada').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}
