import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type ItemChecklistRow = Database['public']['Tables']['items_checklist']['Row'];

export async function getItemChecklists(): Promise<ItemChecklistRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
  .from('items_checklist')
  .select(`
    *,
    operacion_inmobiliaria (*)
    `);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getItemChecklistById(id: number): Promise<ItemChecklistRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('items_checklist')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function createItemChecklist(record: Omit<ItemChecklistRow, 'id'>): Promise<ItemChecklistRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('items_checklist')
    .insert([record])
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create items_checklist');
  return data;
}

export async function updateItemChecklist(id: number, updates: Partial<ItemChecklistRow>): Promise<ItemChecklistRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('items_checklist')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('items_checklist not found for update');
  return data;
}

export async function deleteItemChecklist(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('items_checklist').delete().eq('id', id);
  if (error) throw new Error(error.message);
}