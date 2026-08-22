import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type PersonaRow = Database['public']['Tables']['personas']['Row'];

export async function getPersonas(): Promise<PersonaRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('personas').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPersonaById(id: number): Promise<PersonaRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createPersona(record: Omit<PersonaRow, 'id'>): Promise<PersonaRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('personas')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create persona');
  return data;
}

export async function updatePersona(id: number, updates: Partial<PersonaRow>): Promise<PersonaRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('personas')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Persona not found for update');
  return data;
}

export async function deletePersona(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('personas').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
