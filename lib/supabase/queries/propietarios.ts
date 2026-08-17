import { createClient } from "@/lib/supabase/client";
import type { Propietario } from "@/lib/types/database";
import type { Database } from "@/database.types";

type PersonaRow = Database["public"]["Tables"]["personas"]["Row"];

export type PropietarioDetalle = Propietario & {
  personas: PersonaRow | null;
};

export async function getPropietarios(): Promise<Propietario[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("propietarios").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPropietariosByPropiedadId(id_propiedad: number): Promise<PropietarioDetalle[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("propiedad_propietario")
    .select(
      `
      propietarios (
        *,
        personas (*)
      )
    `,
    )
    .eq("id_propiedad", id_propiedad);

  if (error) {
    throw new Error(error.message);
  }

  type PropietarioJoinRow = {
    propietarios: PropietarioDetalle | PropietarioDetalle[] | null;
  };

  return ((data ?? []) as unknown as PropietarioJoinRow[]).flatMap((row) => {
    if (!row.propietarios) return [];
    return Array.isArray(row.propietarios) ? row.propietarios : [row.propietarios];
  });
}
