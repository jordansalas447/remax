import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

export type TipoContratoRow = Database['public']['Tables']['tipo_contrato']['Row'];

export async function getTiposContrato(): Promise<TipoContratoRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('tipo_contrato').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTipoContratoById(id: number): Promise<TipoContratoRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tipo_contrato')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createTipoContrato(record: Omit<TipoContratoRow, 'id'>): Promise<TipoContratoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('tipo_contrato')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create TipoContrato');
  return data;
}