import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type DistritoRow = Database['public']['Tables']['distritos']['Row'];

export async function getDistritos(): Promise<DistritoRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('distritos').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDistritoById(id: number): Promise<DistritoRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('distritos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createDistrito(record: Omit<DistritoRow, 'id'>): Promise<DistritoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('distritos')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create distrito');
  return data;
}

export async function updateDistrito(id: number, updates: Partial<DistritoRow>): Promise<DistritoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('distritos')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Distrito not found for update');
  return data;
}

export async function deleteDistrito(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('distritos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
