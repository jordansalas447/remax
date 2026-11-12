import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

export type DocumentosRow = Database['public']['Tables']['documentos']['Row'];


export type DocumentosRowDetalle = DocumentosRow & {
  asociados?: {
    nombre_completo: string
  } | null;
  operacion?: {
    operacion: string;
    color?: string | null;
  } | null;
  tipo_contrato?: {
    tipo_contrato: string;
  } | null;
  estado_documento?: {
    estado: string;
    color: string;
  } | null;
};


export type LimiteDiarioDocumentosxAsesorRow = {
  id_asociado: string | null;
  limite_diario: string | null;
  total_generados: string | null;
  disponibles: string | null;
}

export async function getDocumentoss(): Promise<DocumentosRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('documentos').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDocumentosxCodigo(codigo: string): Promise<DocumentosRowDetalle | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('documentos')
    .select(`*,
      operacion(*),
        tipo_contrato(*),
        asociados:id_asociado(*)`)
    .eq('id_publico', codigo)
    .single();

  if (!data) return null

  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function getDocumentosxEmitidos(codigo?: string): Promise<DocumentosRowDetalle[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('documentos')
    .select(`*,
        operacion(*),
        tipo_contrato(*),
        asociados:id_asociado(*),
        estado_documento(*)`)
    .not("id_asociado", "is", null)
    .order('fecha_generacion', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as unknown as DocumentosRowDetalle[]) ?? null;
}

export async function getDocumentosById(id: number): Promise<DocumentosRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('documentos')
    .select(`*`)
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function getDocumentosByAsociado(id: number): Promise<DocumentosRowDetalle[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('documentos')
    .select(`
        *,
        tipo_contrato(*),
        asociados:id_asociado(*),
        operacion(*),
        estado_documento(*)
        `)
    .eq('id_asociado', id)
    .order('fecha_generacion', { ascending: false });
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

export async function LimiteDiarioDocumentosxAsesor(id: number): Promise<LimiteDiarioDocumentosxAsesorRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vista_limite_diario_documentos')
    .select('*')
    .eq('id_asociado', id);
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create Documentos');
  return data;
}