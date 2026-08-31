import { createClient } from "@/lib/supabase/client";

/**
 * Update a revision record with given fields.
 * @param id Revision ID to update.
 * @param updates Partial fields to update. Expected keys: id_estado_oficina, id_estado_sigi, etc.
 */
export async function updateRevision(
  id: number,
  updates: Partial<RevisionRow>
): Promise<RevisionRow> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('revisiones')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Revision not found for update');
  return data;
}

import type { Database } from "@/database.types";

// Tipos para las filas de cada tabla relevante
type RevisionRow = Database["public"]["Tables"]["revisiones"]["Row"];
type ChecklistEstadoRow = Database["public"]["Tables"]["checklist_estado"]["Row"];
type ItemChecklistRow = Database["public"]["Tables"]["items_checklist"]["Row"];
type EstadoRevisionRow = Database["public"]["Tables"]["estados_revision"]["Row"];

// Tipo de detalle de revisión según la relación y los joins requeridos
export type RevisionDetalle = RevisionRow & {
    items_checklist: ItemChecklistRow | null;
    estado_oficina: EstadoRevisionRow | null;
    estado_sigi: EstadoRevisionRow | null;
};


export async function getRevisionesDetallePropiedad(id?: number,operacion_inmobiliaria?:string): Promise<RevisionDetalle[]> {
  const supabase = createClient();
  let query = supabase
    .from("revisiones")
    .select(`
      *,
        items_checklist: id_item (*),
        estado_oficina: id_estado_oficina (*),
        estado_sigi: id_estado_sigi (*)
    `)
    .eq("id_propiedad", id);
  const { data, error } = await query;
  if (error) {
    throw new Error(`Error consultando revisiones: ${error.message}`);
  }
  // data ya queda en la estructura RevisionDetalle[]
  return data ?? [];
}

export async function getRevisionesDetallePropietario(id_ref_propiedad_propietario_contrato: number): Promise<RevisionDetalle[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("revisiones")
    .select(`
      *,
      propiedad_propietario:id_propiedad_propietario_contrato (
        *,
        propietario: id_propietario (
          *
        )
      ),
      operacion_inmobiliaria: id_operacion_inmobiliaria (
        *
      ),
      items_checklist: id_item (
        *
      ),
      estado_oficina: id_estado_oficina (
        *
      ),
      estado_sigi: id_estado_sigi (
        *
      )
    `)
    .eq("id_ref_propiedad_propietario_contrato", id_ref_propiedad_propietario_contrato);

  if (error) {
    throw new Error(`Error consultando revisiones y propietarios: ${error.message}`);
  }

  // Normalizamos salida: cada registro es una revisión ya enriquecida con todas las relaciones pedidas
  // Se ajusta a tipo RevisionDetalle (que asume tener inner join con todo lo relevante)
  const revisiones: RevisionDetalle[] = (data ?? []) as RevisionDetalle[];

  return revisiones;
}

export async function getVistaRevisiones(
  id_ref_propiedad_propietario_contrato: Number,
  id_operacion: Number
): Promise<any[]> {
  const supabase = createClient();

  let query = supabase
    .from("vista_revisiones")
    .select("*")
    .eq("id_ref_propiedad_propietario_contrato", id_ref_propiedad_propietario_contrato)
    .eq("id_operacion", id_operacion); // Agrega la condición AND id_operacion


  const { data, error } = await query;

  if (error) {
    throw new Error(`Error consultando vista_revisiones: ${error.message}`);
  }

 // console.log(data)

  return data ?? [];
}


// /**
//  * Obtiene las revisiones junto con los datos completos de checklist_estado, items_checklist,
//  * estados_revision (oficina), y estados_revision (sigi).
//  * Si se pasa id, filtra solo esa revisión.
//  */
// export async function getRevisionesDetallePropiedad(id?: number): Promise<RevisionDetalle[]> {
//   const supabase = createClient();

//   let query = supabase
//     .from("revisiones")
//     .select(`
//       *,
//         items_checklist: id_item (*),
//         estado_oficina: id_estado_oficina (*),
//         estado_sigi: id_estado_sigi (*)
//     `)
//     .eq("id_propiedad", id);

//   const { data, error } = await query;

//   if (error) {
//     throw new Error(`Error consultando revisiones: ${error.message}`);
//   }
//   // data ya queda en la estructura RevisionDetalle[]
//   return data ?? [];
// }

// export async function getRevisionesDetallePropietario(ids?: number | number[]): Promise<RevisionDetalle[]> {
//     const supabase = createClient();

//     let query = supabase
//       .from("revisiones")
//       .select(`
//         *,
//           items_checklist: id_item (*),
//           estado_oficina: id_estado_oficina (*),
//           estado_sigi: id_estado_sigi (*)
//       `);

//     if (typeof ids === "number") {
//       query = query.in("id_propietario", [ids]);
//     } else if (Array.isArray(ids) && ids.length > 0) {
//       query = query.in("id_propietario", ids);
//     } else if (ids === undefined) {
//       // Si no se pasa ningún id, retornar vacío o considerar quitar el filtro
//       return [];
//     }

//     const { data, error } = await query;

//     if (error) {
//       throw new Error(`Error consultando revisiones: ${error.message}`);
//     }
//     // data ya queda en la estructura RevisionDetalle[]
//     return data ?? [];
//   }

  
//   export async function getRevisionesDetalleContrato(id?: number): Promise<RevisionDetalle[]> {
//     const supabase = createClient();
  
//     let query = supabase
//       .from("revisiones")
//       .select(`
//         *,
//           items_checklist: id_item (*),
//           estado_oficina: id_estado_oficina (*),
//           estado_sigi: id_estado_sigi (*)
//       `)
//       .eq("id_contrato", id);
  
//     const { data, error } = await query;
  
//     if (error) {
//       throw new Error(`Error consultando revisiones: ${error.message}`);
//     }
//     // data ya queda en la estructura RevisionDetalle[]
//     return data ?? [];
//   }
  