import { createClient } from '@/lib/supabase/client';
import type { LlamadasRow } from '@/lib/supabase/queries/llamadas';

export type PropietarioResumen = {
  id_propietario: number;
  nombre_completo: string | null;
  documento_identidad: string | null;
  numero_telefono: string | null;
  create_at: string | null; // fecha (YYYY-MM-DD)
};

export type ContratoInmuebleResumen = {
  id_propiedad_propietario: number;
  id_llamada: number | null;
  id_remax: string | number | null;
  n_partida: string | null;
  nro_contrato: string | null;
  create_at: string | null;
};

const toDate = (v?: string | null) => (v ? v.slice(0, 10) : null);
const one = <T,>(v: T | T[] | null | undefined): T | null =>
  Array.isArray(v) ? (v[0] ?? null) : (v ?? null);

/**
 * Query 1: propietarios distintos (con persona) ordenados por fecha desc y nombre.
 * Equivale a:
 *  select distinct pr.id_propietario, pe.nombre_completo, pe.documento_identidad,
 *  pe.numero_telefono, pp.create_at::date
 *  from propietarios pr join personas pe ... join propiedad_propietario pp ...
 */
export async function getPropietariosConPropiedades(): Promise<PropietarioResumen[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('propiedad_propietario')
    .select(
      `create_at,
       propietarios:id_propietario!inner (
         id_propietario,
         personas:id_personas!inner ( nombre_completo, documento_identidad, numero_telefono )
       )`
    )
    .order('create_at', { ascending: false });

  if (error) throw new Error(error.message);

  // DISTINCT por (id_propietario, fecha)
  const seen = new Set<string>();
  const result: PropietarioResumen[] = [];
  for (const row of (data ?? []) as any[]) {
    const pr = one<any>(row.propietarios);
    const pe = one<any>(pr?.personas);
    if (!pr) continue;
    const fecha = toDate(row.create_at);
    const key = `${pr.id_propietario}|${fecha}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      id_propietario: pr.id_propietario,
      nombre_completo: pe?.nombre_completo ?? null,
      documento_identidad: pe?.documento_identidad ?? null,
      numero_telefono: pe?.numero_telefono ?? null,
      create_at: fecha,
    });
  }

  result.sort((a, b) => {
    const d = (b.create_at ?? '').localeCompare(a.create_at ?? '');
    return d !== 0 ? d : (a.nombre_completo ?? '').localeCompare(b.nombre_completo ?? '');
  });
  return result;
}

/**
 * Query 2: contratos e inmuebles de un propietario, ordenados por fecha asc.
 */
export async function getContratosInmueblesByPropietario(
  idPropietario: number
): Promise<ContratoInmuebleResumen[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('propiedad_propietario')
    .select(
      `id, id_llamada, create_at,
       contratos:id_contrato!inner ( nro_contrato ),
       inmuebles:id_propiedad!inner ( id_remax, n_partida )`
    )
    .eq('id_propietario', idPropietario)
    .order('create_at', { ascending: true });

  if (error) throw new Error(error.message);

  return ((data ?? []) as any[]).map((row) => {
    const c = one<any>(row.contratos);
    const i = one<any>(row.inmuebles);
    return {
      id_propiedad_propietario: row.id,
      id_llamada: row.id_llamada ?? null,
      id_remax: i?.id_remax ?? null,
      n_partida: i?.n_partida ?? null,
      nro_contrato: c?.nro_contrato ?? null,
      create_at: toDate(row.create_at),
    };
  });
}

/**
 * Query 3: llamadas realizadas asociadas a un id_llamada.
 */
export async function getLlamadasByIdLlamada(idLlamada: number): Promise<LlamadasRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('propiedad_propietario')
    .select('llamadas:id_llamada!inner (*)')
    .eq('id_llamada', idLlamada);

  if (error) throw new Error(error.message);

  // DISTINCT por id de llamada
  const map = new Map<number, LlamadasRow>();
  for (const row of (data ?? []) as unknown as { llamadas: LlamadasRow | LlamadasRow[] | null }[]) {
    const l = one<LlamadasRow>(row.llamadas);
    if (l) map.set(l.id, l);
  }
  return Array.from(map.values());
}
