import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type AdministrativoRow = Database['public']['Tables']['administrativos']['Row'];

export async function getAdministrativos(): Promise<AdministrativoRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('administrativos').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdministrativoById(id: number): Promise<AdministrativoRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('administrativos')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createAdministrativo(record: Omit<AdministrativoRow, 'id'>): Promise<AdministrativoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('administrativos')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create administrativo');
  return data;
}

export async function updateAdministrativo(id: number, updates: Partial<AdministrativoRow>): Promise<AdministrativoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('administrativos')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Administrativo not found for update');
  return data;
}

export async function deleteAdministrativo(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('administrativos').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
