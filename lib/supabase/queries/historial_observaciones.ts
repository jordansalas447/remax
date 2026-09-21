import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type HistorialObservacionesRow = Database['public']['Tables']['historial_observaciones']['Row'];
type HistorialObservacionesInsert = Database['public']['Tables']['historial_observaciones']['Insert'];


export type HistorialObservacionesDetalle = HistorialObservacionesRow;

export async function getHistorialObservaciones(): Promise<HistorialObservacionesRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_observaciones')
    .select(`
      *,
      operacion_inmobiliaria (*)
    `);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getHistorialObservacionById(id: number): Promise<HistorialObservacionesRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_observaciones')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function getHistorialObservacionByIdInmueblePropietarioContrato(id_inmueble_propietario_contrato: number): Promise<HistorialObservacionesDetalle[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_observaciones')
    .select(`*,
      alcance:id_alcance(*)
      `)
    .eq('id_inmueble_propietario_contrato', id_inmueble_propietario_contrato)
    .eq('eliminado',false);
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createHistorialObservacion(record: HistorialObservacionesInsert): Promise<HistorialObservacionesRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_observaciones')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create historial_observaciones');
  return data;
}

export async function updateHistorialObservacion(id: number, updates: Partial<HistorialObservacionesRow>): Promise<HistorialObservacionesRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('historial_observaciones')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('historial_observaciones not found for update');
  return data;
}

export async function deleteHistorialObservacion(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('historial_observaciones').delete().eq('id', id);
  if (error) throw new Error(error.message);
}