import type { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";
import type { Propiedad } from "@/lib/types/database";

type DistritoRow = Database["public"]["Tables"]["distritos"]["Row"];
type TipoPropiedadRow = Database["public"]["Tables"]["tipo_propiedad"]["Row"];

export type PropiedadDetalle = Propiedad & {
  distritos: Pick<DistritoRow, "distrito"> | null;
  tipo_propiedad: Pick<TipoPropiedadRow, "tipo_propiedad"> | null;
  id_resource_est_titulo?: {
    url_resource: string;
  } | null;
  conformidad?: {
    tipo: string;
    descripcion:string;
  } | null;
};

export async function getPropiedades(): Promise<Propiedad[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("propiedades").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPropiedadById(id_propiedad: number): Promise<Propiedad | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("propiedades")
    .select("*")
    .eq("id_propiedad", id_propiedad)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPropiedadDetalleById(id_propiedad: number): Promise<PropiedadDetalle | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("propiedades")
    .select(
      `
      *,
      distritos (distrito),
      tipo_propiedad (tipo_propiedad),
      conformidad:id_conformidad(*),
      id_resource_partida(*),
      id_resource_est_titulo(*)
    `,
    )
    .eq("id_propiedad", id_propiedad)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
