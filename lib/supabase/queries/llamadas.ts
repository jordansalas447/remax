import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';
import { PropiedadPropietario } from '@/lib/types/database';

/**
 * Obtiene llamadas propietarios con filtros y paginación
 */

export type LlamadasRow = Database['public']['Tables']['llamadas']['Row'];

export type LlamadasRowDetalle = {
  id?: number; // id_propiedad_propietario
  id_llamada?: number | null;
  id_remax?: string | number | null;
  color?: string;
  asociado?: string; // a.nombre_completo
  tipo_propiedad?: string; // tp.tipo_propiedad
  direccion: string; // i.direccion
  tipo_negocio: string; // op.operacion
  modalidad: string; // tc.tipo_contrato
  id_estado_llamada?: number;
  estado_llamada?: any;
  propietario: string; // p.nombre_completo
  numero_telefono: string; // pe.numero_telefono
  fecha_contrato_recibido: string | null; // c.fecha_contrato_recibido
  fecha_bienvenida: string | null; // l.fecha_bienvenida
  curso_llamada: string | null; // l.curso_llamada
  observacion: string | null; // l.observacion
  fecha_seguimiento_llamada: string | null; // l.fecha_seguimiento_llamada
  observacion_seguimiento: string | null; // l.observacion_seguimiento
  id_seguimiento?: number | null;
  eliminado?: boolean;
};

export type LlamadaType = {
  fecha_bienvenida?: string | null;
  id_estado_llamada?: number | null;
  curso_llamada?: string | null;
  observacion?: string | null;
  fecha_seguimiento_llamada?: string | null;
  observacion_seguimiento?: string | null;
  id_seguimiento?: number | null;
  eliminado?: boolean;
  id?: number;
}

export async function getLlamadasPropietarios(id_asociado?: {}): Promise<LlamadasRowDetalle[]> {
  const supabase = createClient();
  const query = supabase
    .from('vista_llamadas_propietarios')
    .select('*')
    .order('asociado', { ascending: true });

  const [viewRes, propRes] = await Promise.all([
    query,
    supabase
      .from('propiedad_propietario')
      .select('id, id_llamada')
      .not('id_llamada', 'is', null)
  ]);

  if (viewRes.error) throw new Error(viewRes.error.message);

  const llamadaMap = new Map((propRes.data ?? []).map((p) => [p.id, p.id_llamada]));

  return (viewRes.data ?? []).map((item) => ({
    ...item,
    id_llamada: item.id ? (llamadaMap.get(item.id) ?? null) : null,
  })) as LlamadasRowDetalle[];
}

/**
 * Agrega una observación a la llamada (tabla `llamadas`).
 * No reemplaza la observación existente: la nueva se añade en una línea nueva.
 * Devuelve el texto final guardado.
 */
export async function agregarObservacionLlamada(
  idLlamada: number,
  nuevaObservacion: string,
  observacionActual?: string | null,
): Promise<string> {
  const texto = nuevaObservacion.trim();
  if (!texto) throw new Error('La observación no puede estar vacía.');

  const observacion = observacionActual?.trim()
    ? `${observacionActual.trim()}\n${texto}`
    : texto;

  const supabase = createClient();
  const { error } = await supabase
    .from('llamadas')
    .update({ observacion })
    .eq('id', idLlamada);

  if (error) throw new Error(error.message);
  return observacion;
}

/**
 * Actualiza directamente un registro existente en la tabla 'llamadas'.
 */
export async function actualizarLlamada(
  idLlamada: number,
  record: Omit<LlamadaType, 'id'>
): Promise<any> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('llamadas')
    .update(record)
    .eq('id', idLlamada)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Inserta o actualiza un registro en la tabla 'llamadas'.
 * Si ya existe id_llamada (o propiedad_propietario ya tiene uno asociado), lo edita.
 * Si no existe, crea una nueva llamada y la enlaza a 'propiedad_propietario'.
 */
export async function guardarLlamada(
  record: Omit<LlamadaType, 'id'>,
  idPropiedadPropietario: number,
  idLlamadaExistente?: number | null
): Promise<{ data: any; id_propiedad_propietario: number }> {
  const supabase = createClient();
  let targetIdLlamada = idLlamadaExistente;

  // Si no tenemos id_llamada explícito, verificamos en propiedad_propietario
  if (!targetIdLlamada && idPropiedadPropietario) {
    const { data: propData } = await supabase
      .from('propiedad_propietario')
      .select('id_llamada')
      .eq('id', idPropiedadPropietario)
      .maybeSingle();

    if (propData?.id_llamada) {
      targetIdLlamada = propData.id_llamada;
    }
  }

  if (targetIdLlamada) {
    // Modo EDITAR: Actualizar la llamada existente
    const { data, error } = await supabase
      .from('llamadas')
      .update(record)
      .eq('id', targetIdLlamada)
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    return { data, id_propiedad_propietario: idPropiedadPropietario };
  } else {
    // Modo INSERTAR: Crear registro nuevo en 'llamadas'
    const { data, error } = await supabase
      .from('llamadas')
      .insert([record])
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No se pudo crear la llamada.');

    if (idPropiedadPropietario) {
      const { error: updateError } = await supabase
        .from('propiedad_propietario')
        .update({ id_llamada: data.id })
        .eq('id', idPropiedadPropietario)
        .limit(1);

      if (updateError) throw new Error(updateError.message);
    }

    return { data, id_propiedad_propietario: idPropiedadPropietario };
  }
}

/**
 * Inserta un nuevo registro en la tabla 'llamadas' (mantenido por retrocompatibilidad).
 */
export async function insertarLlamada(
  record: Omit<LlamadaType, 'id'>,
  id_propiedad_propietario: number
): Promise<any> {
  return guardarLlamada(record, id_propiedad_propietario);
}


