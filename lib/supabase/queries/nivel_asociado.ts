import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type NivelAsociadoRow = Database['public']['Tables']['nivel_asociado']['Row'];

export async function getNivelAsociados(): Promise<NivelAsociadoRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('nivel_asociado').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getNivelAsociadoById(id: number): Promise<NivelAsociadoRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('nivel_asociado')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createNivelAsociado(record: Omit<NivelAsociadoRow, 'id'>): Promise<NivelAsociadoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('nivel_asociado')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create nivel_asociado');
  return data;
}

export async function updateNivelAsociado(id: number, updates: Partial<NivelAsociadoRow>): Promise<NivelAsociadoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('nivel_asociado')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('nivel_asociado not found for update');
  return data;
}

export async function deleteNivelAsociado(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('nivel_asociado').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
