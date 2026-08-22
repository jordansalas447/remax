import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type DetalleAsociadoRow = Database['public']['Tables']['detalle_asociado']['Row'];

export async function getDetalleAsociados(): Promise<DetalleAsociadoRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('detalle_asociado').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDetalleAsociadoById(id: number): Promise<DetalleAsociadoRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('detalle_asociado')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createDetalleAsociado(record: Omit<DetalleAsociadoRow, 'id'>): Promise<DetalleAsociadoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('detalle_asociado')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create detalle_asociado');
  return data;
}

export async function updateDetalleAsociado(id: number, updates: Partial<DetalleAsociadoRow>): Promise<DetalleAsociadoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('detalle_asociado')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('detalle_asociado not found for update');
  return data;
}

export async function deleteDetalleAsociado(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('detalle_asociado').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
