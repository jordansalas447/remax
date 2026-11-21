import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

type Tables = Database['public']['Tables'];

export type MultaRow = Tables['multas']['Row'];
export type MultaInsert = Tables['multas']['Insert'];
export type MultaUpdate = Tables['multas']['Update'];

export type TipoMultaRow = Tables['tipo_multa']['Row'];
export type JustificacionRow = Tables['justificaciones']['Row'];

/** Multa con sus relaciones (asociado, tipo de multa y justificación). */
export type MultaDetalle = MultaRow & {
  asociado: Pick<Tables['asociados']['Row'], 'id_asociado' | 'nombre_completo'> | null;
  tipo_multa: TipoMultaRow | null;
  justificacion: JustificacionRow | null;
};

export type MultasFiltros = {
  id_asociado?: number;
  id_tipo_multa?: number;
  estado?: string;
  /** Rango sobre fecha, formato 'YYYY-MM-DD' (inclusive). */
  desde?: string;
  hasta?: string;
};

const SELECT_DETALLE = `
  *,
  asociado:asociados!multas_id_asociado_fkey ( id_asociado, nombre_completo ),
  tipo_multa:tipo_multa!multas_id_tipo_multa_fkey ( * ),
  justificacion:justificaciones!multas_id_justificacion_fkey ( * )
`;

/** Lista multas no eliminadas, con filtros opcionales. */
export async function getMultas(filtros: MultasFiltros = {}): Promise<MultaDetalle[]> {
  const supabase = createClient();
  let query = supabase
    .from('multas')
    .select(SELECT_DETALLE)
    .or('eliminado.is.null,eliminado.eq.false')
    .order('fecha', { ascending: false, nullsFirst: false })
    .order('id', { ascending: false });

  if (filtros.id_asociado != null) query = query.eq('id_asociado', filtros.id_asociado);
  if (filtros.id_tipo_multa != null) query = query.eq('id_tipo_multa', filtros.id_tipo_multa);
  if (filtros.estado) query = query.eq('estado', filtros.estado);
  if (filtros.desde) query = query.gte('fecha', filtros.desde);
  if (filtros.hasta) query = query.lte('fecha', filtros.hasta);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as MultaDetalle[];
}

/** Obtiene una multa por id (con relaciones). */
export async function getMultaById(id: number): Promise<MultaDetalle | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('multas')
    .select(SELECT_DETALLE)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as MultaDetalle | null;
}

/** Multas de un asociado. */
export function getMultasByAsociado(idAsociado: number): Promise<MultaDetalle[]> {
  return getMultas({ id_asociado: idAsociado });
}

/** Crea una multa. */
export async function crearMulta(record: MultaInsert): Promise<MultaRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('multas')
    .insert([{ ...record, eliminado: false }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Actualiza una multa. */
export async function actualizarMulta(id: number, cambios: MultaUpdate): Promise<MultaRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('multas')
    .update(cambios)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Crea o actualiza según exista `id`. */
export function guardarMulta(record: MultaInsert & { id?: number }): Promise<MultaRow> {
  const { id, ...resto } = record;
  return id ? actualizarMulta(id, resto) : crearMulta(resto);
}

/** Eliminación lógica (eliminado = true). */
export async function eliminarMulta(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('multas').update({ eliminado: true }).eq('id', id);
  if (error) throw new Error(error.message);
}

/** Catálogo de tipos de multa. */
export async function getTiposMulta(): Promise<TipoMultaRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('tipo_multa').select('*');
  if (error) throw new Error(error.message);
  return data ?? [];
}
