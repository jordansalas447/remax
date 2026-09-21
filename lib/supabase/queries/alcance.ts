import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type AlcanceRow = Database['public']['Tables']['alcances']['Row'];
type AlcanceInsert = Database['public']['Tables']['alcances']['Insert'];

export type AlcanceDetalle = AlcanceRow;

export async function getAlcances(): Promise<AlcanceRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('alcances')
    .select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAlcanceById(id: number): Promise<AlcanceRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('alcances')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createAlcance(record: AlcanceInsert): Promise<AlcanceRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('alcances')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create alcance');
  return data;
}

export async function updateAlcance(id: number, updates: Partial<AlcanceRow>): Promise<AlcanceRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('alcances')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('alcance not found for update');
  return data;
}

export async function deleteAlcance(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('alcance').delete().eq('id', id);
  if (error) throw new Error(error.message);
}