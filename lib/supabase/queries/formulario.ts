import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

export type FormularioRow = Database['public']['Tables']['formulario']['Row'];

export async function createFormulario(record: Omit<FormularioRow, 'id'>): Promise<FormularioRow> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('formulario')
      .insert([record])
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create estado_revision');
    return data;
  }