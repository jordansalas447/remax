import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type OperacionesRow = Database['public']['Tables']['operacion']['Row'];

export async function getOperaciones(): Promise<OperacionesRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('operacion').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getOperacionesById(id: number): Promise<OperacionesRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('operacion')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createOperaciones(record: Omit<OperacionesRow, 'id'>): Promise<OperacionesRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('operacion')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create Operaciones');
  return data;
}