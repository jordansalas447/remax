import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

export type EstadoRevisionRow = Database['public']['Tables']['estados_revision']['Row'];

export async function getEstadosRevision(): Promise<EstadoRevisionRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('estados_revision').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEstadoRevisionById(id: number): Promise<EstadoRevisionRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('estados_revision')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createEstadoRevision(record: Omit<EstadoRevisionRow, 'id'>): Promise<EstadoRevisionRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('estados_revision')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create estado_revision');
  return data;
}

export async function updateEstadoRevision(id: number, updates: Partial<EstadoRevisionRow>): Promise<EstadoRevisionRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('estados_revision')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Estado revision not found for update');
  return data;
}

export async function deleteEstadoRevision(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('estados_revision').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
