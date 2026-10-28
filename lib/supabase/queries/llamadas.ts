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
  nro_contrato: string;
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
  fecha_registro:string | null;
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

/**
 * Obtiene llamadas propietarios con filtros opcionales de id_asociado y/o fecha_registro.
 * Si no se proporciona fecha_registro, retorna todos los registros.
 * 
 * @param filtros Puede tener id_asociado y/o fecha_registro (en formato 'YYYY-MM-DD')
 */
export async function getLlamadasPropietarios(filtros?: { fecha_registro?: string }): Promise<LlamadasRowDetalle[]> {
  const supabase = createClient();
  let query = supabase
    .from('vista_llamadas_propietarios')
    .select('*')
    .order('fecha_registro', { ascending: false });

  if (filtros?.fecha_registro) {
    // asume que fecha_registro es string 'YYYY-MM-DD'
    query = query.eq('fecha_registro', filtros.fecha_registro);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}


export async function getResumenLlamadas(): Promise<LlamadasRowDetalle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('vista_resumen_llamadas')
    .select('*')
    //.eq('(fecha_registro - '05:00:00'::interval)::date = CURRENT_DATE')
    .order('fecha_registro', { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
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


