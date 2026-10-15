import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';
import { PropiedadPropietario } from '@/lib/types/database';

/**
 * Obtiene llamadas propietarios con filtros y paginación
 */

export type LlamadasRow = Database['public']['Tables']['llamadas']['Row'];

export type LlamadasRowDetalle = {
  id?:number;
  id_remax?:string;
  asociado?: string; // a.nombre_completo
  tipo_propiedad?: string; // tp.tipo_propiedad
  direccion: string; // i.direccion
  tipo_negocio: string; // op.operacion
  modalidad: string; // tc.tipo_contrato
  propietario: string; // p.nombre_completo
  numero_telefono: string; // pe.numero_telefono
  fecha_contrato_recibido: string | null; // c.fecha_contrato_recibido
  fecha_bienvenida: string | null; // l.fecha_bienvenida
  curso_llamada: string | null; // l.curso_llamada
  observacion: string | null; // l.observacion
  fecha_seguimiento_llamada: string | null; // l.fecha_seguimiento_llamada
  observacion_seguimiento: string | null; // l.observacion_seguimiento
};

export type LlamadaType = {
  fecha_bienvenida?: string | null;
  curso_llamada?: string | null;
  observacion?: string | null;
  fecha_seguimiento_llamada?: string | null;
  observacion_seguimiento?: string | null;
  id_seguimiento?: number | null;
  eliminado?: boolean;
  id?: number;
}



export async function getLlamadasPropietarios(id_asociado?: {}): Promise<any[]> {
  const supabase = createClient();
  let query = supabase
    .from('vista_llamadas_propietarios')
    .select('*')
    .order('asociado', { ascending: true });

  const { data, error } = await query;
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
 * Inserta un nuevo registro en la tabla 'llamadas'.
 * Luego, obtiene el id del registro insertado y actualiza la tabla 'propiedad_propietario'
 * para referenciar la nueva llamada creada, asociándola probablemente mediante la llave foránea indicada por negocio.
 * 
 * @param record Los datos para insertar una nueva llamada (sin el id)
 * @returns El registro completo insertado en 'llamadas'
 */
export async function insertarLlamada(
  record: Omit<LlamadaType, 'id'>,id_propiedad_propietario:number
): Promise<LlamadaType> {
  const supabase = createClient();

  // 1. Insertar la llamada y obtener el registro insertado con su nuevo id
  const { data, error } = await supabase
    .from('llamadas')
    .insert([record])
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create Llamadas');

  // 2. Actualizar la tabla propiedad_propietario con el nuevo id de llamada
  // NOTA: Debes cambiar 'id_propiedad_propietario' por el campo correcto para hacer la relación
  // y 'llamada_id' por el campo de la tabla 'propiedad_propietario' que debe actualizarse.
  // Ajusta estos nombres según tu modelo real.

  if (id_propiedad_propietario) {
    const { error: updateError } = await supabase
      .from('propiedad_propietario')
      .update({ id_llamada: data.id }) // <-- ajusta 'llamada_id' según tu schema
      .eq('id', id_propiedad_propietario) // <-- ajusta 'id_propiedad_propietario' y 'id' según tu schema
      .limit(1);

    if (updateError) throw new Error(updateError.message);
  }

  return data;
}

