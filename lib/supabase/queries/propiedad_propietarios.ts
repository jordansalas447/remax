import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/database.types";
import { operacion_inmobiliaria } from "@/lib/types/database";
import { da } from "date-fns/locale";

// Tipos para las filas de cada tabla relevante
type RevisionRow = Database["public"]["Tables"]["revisiones"]["Row"];
type ItemChecklistRow = Database["public"]["Tables"]["items_checklist"]["Row"];
type EstadoRevisionRow = Database["public"]["Tables"]["estados_revision"]["Row"];
type PropiedadPropietarioRow = Database["public"]["Tables"]["propiedad_propietario"]["Row"];
type operacion_inmobiliariaRow = Database["public"]["Tables"]["operacion_inmobiliaria"]["Row"]

// Tipo de detalle de relación según el join requerido
export type PropiedadPropietarioDetalle = PropiedadPropietarioRow & {
  revisiones: Array<RevisionRow & {
    items_checklist: ItemChecklistRow | null;
    estado_oficina: EstadoRevisionRow | null;
    estado_sigi: EstadoRevisionRow | null;
    operacion_inmobiliaria: operacion_inmobiliariaRow | null;
  }>;
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

  return  [];
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
        items_checklist: id_item (*),
        estado_oficina: id_estado_oficina (*),
        estado_sigi: id_estado_sigi (*),
        operacion_inmobiliaria: id_operacion_inmobiliaria(*)
      )
    `);

  if (typeof id_propiedad === "number") {
    query = query.eq("id_propiedad", id_propiedad);
  }
  if (typeof id_contrato === "number") {
    query = query.eq("id_contrato", id_contrato);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando propiedad_propietario y revisiones por propiedad/contrato: ${error.message}`);
  }

 // console.log(data)

  return data ?? [];
}

// Obtiene revisiones detalle usando la vista 'vw_revisiones_detalle' por id_contrato
export async function getRevisionesDetalleByContratoVista(idContrato?: number) : Promise<RevisionDocumentoDetalle[]> {
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