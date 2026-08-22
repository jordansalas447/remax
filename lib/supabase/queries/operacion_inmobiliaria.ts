import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type OperacionInmobiliariaRow = Database['public']['Tables']['operacion_inmobiliaria']['Row'];

export async function getOperacionesInmobiliarias(): Promise<OperacionInmobiliariaRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('operacion_inmobiliaria').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getOperacionInmobiliariaById(id: number): Promise<OperacionInmobiliariaRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('operacion_inmobiliaria')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createOperacionInmobiliaria(record: Omit<OperacionInmobiliariaRow, 'id'>): Promise<OperacionInmobiliariaRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('operacion_inmobiliaria')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create operacion_inmobiliaria');
  return data;
}

export async function updateOperacionInmobiliaria(id: number, updates: Partial<OperacionInmobiliariaRow>): Promise<OperacionInmobiliariaRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('operacion_inmobiliaria')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Operacion inmobiliaria not found for update');
  return data;
}

export async function deleteOperacionInmobiliaria(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('operacion_inmobiliaria').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
