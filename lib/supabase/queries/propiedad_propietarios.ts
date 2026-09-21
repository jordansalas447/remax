import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/database.types";
import { Propiedad } from "@/lib/types/database";
import { da } from "date-fns/locale";

// Tipos para las filas de cada tabla relevante
type RevisionRow = Database["public"]["Tables"]["revisiones"]["Row"];
type ItemChecklistRow = Database["public"]["Tables"]["items_checklist"]["Row"];
type EstadoRevisionRow = Database["public"]["Tables"]["estados_revision"]["Row"];
type PropiedadPropietarioRow = Database["public"]["Tables"]["propiedad_propietario"]["Row"];
type ContratoRow = Database["public"]["Tables"]["contratos"]["Row"];
type PropietariosRow = Database["public"]["Tables"]["propietarios"]["Row"];
type InmueblesRow = Database["public"]["Tables"]["inmuebles"]["Row"];
type operacion_inmobiliariaRow = Database["public"]["Tables"]["operacion_inmobiliaria"]["Row"]
type DistritoRow = Database["public"]["Tables"]["distritos"]["Row"];
type TipoInmueblesRow = Database["public"]["Tables"]["tipo_propiedad"]["Row"];

// Tipo de detalle de relación según el join requerido
export type PropiedadPropietarioDetalle = PropiedadPropietarioRow & {
  revisiones: Array<RevisionRow & {
    items_checklist: ItemChecklistRow | null;
    estado_oficina: EstadoRevisionRow | null;
    estado_sigi: EstadoRevisionRow | null;
    operacion_inmobiliaria: operacion_inmobiliariaRow | null;
  }>;
};


export type InmuebleDetalle = PropiedadPropietarioRow & {
  historial_observacioness:  any[] | null;
  inmueble: Propiedad & {
    distritos: Pick<DistritoRow, "distrito"> | null;
    tipo_propiedad: Pick<TipoInmueblesRow, "tipo_propiedad"> | null;
    id_resource_est_titulo?: {
      url_resource: string;
    } | null;
    conformidad?: {
      tipo: string;
      descripcion: string;
    } | null;
    captacion_mes?: {
      mes:string;
    } | null
  };
  observaciones:string[] | null;
}

export type PropiedadInmueblePropietarioContrato = PropiedadPropietarioRow & {
  propietarios: PropietariosRow;
  contrato: ContratoRow;
  inmueble: InmueblesRow;
};

export type RevisionDocumentoDetalle = {
  id_revision: number;
  nombre_item: string;
  id_operacion: number;
  id_operacion_inmobiliaria: number;
  operacion: string;
  rev: string;
  estado_oficina: string;
  color_estado_oficina: string;
  estado_sigi: string;
  color_estado_sigi: string;
  observacion: string;
  fecha_creado: Date;
  id_contrato: number;
  id_propiedad: number;
  id_propietario: number;
};

/**
 * Consulta para obtener todos los datos de propiedad_propietario junto con la revisión relacionada y sus joins,
 * filtrando por r.id_ref_propiedad_propietario_contrato = id (si se pasa id).
 */
// Por ref id (como estaba)
// Por ref id (y también filtra por propieddad si se pasa id_propiedad opcional)
export async function getPropietarioRevisionesDetalleByRefId(
  id_ref?: number,
  id_propiedad?: number
): Promise<PropiedadPropietarioDetalle[]> {
  const supabase = createClient();

  //   let query = supabase
  //     .from("propiedad_propietario")
  //     .select(`
  //       *,
  //       revision:revisiones (
  //         *,
  //         items_checklist: id_item (*),
  //         estado_oficina: id_estado_oficina (*),
  //         estado_sigi: id_estado_sigi (*)
  //       )
  //     `)
  //     .neq("revisiones.id", null);

  //   if (typeof id_ref === "number") {
  //     query = query.eq("revisiones.id_ref_propiedad_propietario_contrato", id_ref);
  //   }
  //   if (typeof id_propiedad === "number") {
  //     query = query.eq("id_propiedad", id_propiedad);
  //   }

  //   const { data, error } = await query;

  //   if (error) {
  //     throw new Error(`Error consultando propiedad_propietario y revisiones: ${error.message}`);
  //   }

  return [];
}

// Por propiedad (id_propiedad)
export async function getRevisionesDetalleByPropiedadId(
  id_propiedad?: number,
  id_contrato?: number
): Promise<PropiedadPropietarioDetalle[]> {
  const supabase = createClient();

  let query = supabase
    .from("propiedad_propietario")
    .select(`
      *,
      revisiones (
        *,
        items_checklist: id_revisiones_configuracion (*),
        estado_oficina: id_estado_oficina (*),
        estado_sigi: id_estado_sigi (*)
      )
    `);

  if (typeof id_propiedad === "number") {
    query = query
      .eq("id_propiedad", id_propiedad)
      .eq("eliminado", false);
  }
  if (typeof id_contrato === "number") {
    query = query
      .eq("id_contrato", id_contrato)
      .eq("eliminado", false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando propiedad_propietario y revisiones por propiedad/contrato: ${error.message}`);
  }

  return data ?? [];
}


export async function getRevisionesDetalleByInmueblesContratosPropietarios(
): Promise<PropiedadInmueblePropietarioContrato[]> {
  const supabase = createClient();

  let query = supabase
    .from("propiedad_propietario")
    .select(`
      *,
      inmueble:id_propiedad(*),
      propietarios:id_propietario(*),
      contrato:id_contrato(*)
    `)
    .eq("eliminado", false);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando propiedad_propietario y revisiones por propiedad/contrato: ${error.message}`);
  }

  return data ?? [];
}

export async function getPropiedadPropietarioInmueblesByContrato(
  id_contrato: number
): Promise<InmuebleDetalle[]> {
  const supabase = createClient();

  // Consulta las filas de propiedad_propietario por id_contrato
  let query = supabase
    .from("propiedad_propietario")
    .select(`
      *,
      inmueble:id_propiedad(
        *,
        distritos (distrito),
        tipo_propiedad (tipo_propiedad),
        conformidad:id_conformidad(*),
        id_resource_partida(*),
        id_resource_est_titulo(*),
        captacion_mes:id_mes_captacion(mes)
      )
    `)
    .eq("id_contrato", id_contrato)
    .eq("eliminado", false)

  const { data, error } = await query;


  console.log(data)

  if (error) {
    throw new Error(`Error consultando propiedad_propietario + inmuebles por contrato: ${error.message}`);
  }

  // filtrar los que tengan id_propiedad igual
  // asumimos que data es un array de propiedad_propietario (cada uno puede tener el campo id_propiedad)
  if (!data) {
    return [];
  }

  // Integramos objetos duplicados por id_propiedad, agrupando campos repetidos en arrays

  const integrated: any[] = [];
  const groupedByPropiedad = new Map<number, any[]>();

  for (const item of data) {
    const idProp = item.id_propiedad;
    if (typeof idProp === "number") {
      if (!groupedByPropiedad.has(idProp)) {
        groupedByPropiedad.set(idProp, []);
      }
      groupedByPropiedad.get(idProp)!.push(item);
    }
  }

  for (const [idProp, items] of groupedByPropiedad.entries()) {
    if (!Array.isArray(items) || items.length === 0) continue;

    // Usamos el primer objeto como base para los campos "simples"
    const merged: any = { ...items[0] };

    // Recorremos todas las claves, y si un campo tiene valores distintos lo agrupamos en array
    for (const key of Object.keys(items[0])) {
      const values = items.map(obj => obj[key]).filter(v => v !== undefined && v !== null);

      const unique = Array.from(new Set(values.map(v => typeof v === "object" ? JSON.stringify(v) : v)));

      // Si hay más de un valor, crear un array (parsear si es object)
      if (unique.length > 1 || Array.isArray(values[0])) {
        // restaurar objetos si era JSON.stringify
        merged[key + "s"] = unique.map(v => {
          if (typeof values[0] === "object" && typeof v === "string") {
            try {
              return JSON.parse(v);
            } catch {
              return v;
            }
          }
          return v;
        });
      } else if (unique.length === 1) {
        // unico valor, asignar directamente
        merged[key] = typeof values[0] === "string" && values[0].startsWith("{") ? (()=>{try{return JSON.parse(values[0])}catch{return values[0]}})() : values[0];
      }
    }

    // Adicionalmente, para observacion: juntar no vacíos en un array "observaciones"
    const observaciones = items
      .map(i => i.observacion)
      .filter(s => typeof s === 'string' && s.trim() !== "");
    merged["observaciones"] = observaciones;

    integrated.push(merged);
  }

  const filtered = integrated;

  return filtered;
}



// Obtiene revisiones detalle usando la vista 'vw_revisiones_detalle' por id_contrato
export async function getRevisionesDetalleByContratoVista(idContrato?: number): Promise<RevisionDocumentoDetalle[]> {
  const supabase = createClient();

  let query = supabase
    .from("vw_revisiones_detalle")
    .select("*");

  if (typeof idContrato === "number") {
    query = query.eq("id_contrato", idContrato);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando vw_revisiones_detalle: ${error.message}`);
  }

  // console.log(data,idContrato)

  return data ?? [];
}



export async function getRevisionesDetalleByContratoVistaall(): Promise<RevisionDocumentoDetalle[]> {
  const supabase = createClient();

  let query = supabase
    .from("vw_revisiones_detalle")
    .select("*")
    .eq("eliminado", false); // Filtrar por eliminado = false

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando vw_revisiones_detalle: ${error.message}`);
  }

  // console.log(data,idContrato)

  return data ?? [];
}

// Por contrato (id_contrato)
export async function getContratoRevisionesDetalleByContratoId(
  id_contrato?: number
): Promise<PropiedadPropietarioDetalle[]> {
  const supabase = createClient();

  //   let query = supabase
  //     .from("propiedad_propietario")
  //     .select(`
  //       *,
  //       revisiones (
  //         *,
  //         items_checklist: id_item (*),
  //         estado_oficina: id_estado_oficina (*),
  //         estado_sigi: id_estado_sigi (*)
  //       )
  //     `)
  //     .neq("revisiones.id", null);

  //   if (typeof id_contrato === "number") {
  //     query = query.eq("id_contrato", id_contrato);
  //   }

  //   const { data, error } = await query;

  //   if (error) {
  //     throw new Error(`Error consultando propiedad_propietario y revisiones por contrato: ${error.message}`);
  //   }

  return [];
}