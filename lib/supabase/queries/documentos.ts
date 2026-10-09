import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

export type DocumentosRow = Database['public']['Tables']['documentos']['Row'];


export type DocumentosRowDetalle = DocumentosRow & {
  operacion?: {
    operacion: string;
  } | null;
  tipo_contrato?: {
    tipo_contrato: string;
  } | null;
  estado_documento?: {
    estado: string;
  } | null;
};


export async function getDocumentoss(): Promise<DocumentosRow[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from('documentos').select('*');
    if (error) throw new Error(error.message);
    return data ?? [];
  }
  
  export async function getDocumentosById(id: number): Promise<DocumentosRow | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? null;
  }

  export async function getDocumentosByAsociado(id: number): Promise<DocumentosRow[] | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documentos')
      .select(`
        *,
        tipo_contrato(*),
        asociados(*),
        operacion(*),
        estado_documento(*)
        `)
      .eq('id_asociado', id);
    if (error) throw new Error(error.message);
    return data ?? null;
  }
  
  export async function createDocumentos(record: Omit<DocumentosRow, 'id'>): Promise<DocumentosRow> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documentos')
      .insert([record])
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to create Documentos');
    return data;
  }