import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type EstadoDocumentoRow = Database['public']['Tables']['estado_documento']['Row'];

export async function getEstadoDocumentos(): Promise<EstadoDocumentoRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('estado_documento').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getEstadoDocumentoById(id: number): Promise<EstadoDocumentoRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('estado_documento')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createEstadoDocumento(record: Omit<EstadoDocumentoRow, 'id'>): Promise<EstadoDocumentoRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('estado_documento')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create EstadoDocumento');
  return data;
}