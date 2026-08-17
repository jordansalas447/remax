import type { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";

type ContratoRow = Database["public"]["Tables"]["contratos"]["Row"];
type PropiedadRow = Database["public"]["Tables"]["propiedades"]["Row"];
type DistritoRow = Database["public"]["Tables"]["distritos"]["Row"];
type TipoPropiedadRow = Database["public"]["Tables"]["tipo_propiedad"]["Row"];

export type Contrato = ContratoRow;

export type ContratoConPropiedad = ContratoRow & {
  propiedades: (PropiedadRow & {
    distritos: Pick<DistritoRow, "distrito"> | null;
    tipo_propiedad: Pick<TipoPropiedadRow, "tipo_propiedad"> | null;
  }) | null;
};

export async function getContratos(): Promise<Contrato[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("contratos").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getContratosByAsociadoId(id_asociado: number): Promise<ContratoConPropiedad[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("contratos")
    .select(
      `
      *,
      propiedades (
        *,
        distritos (distrito),
        tipo_propiedad (tipo_propiedad)
      )
    `,
    )
    .eq("id_asociado", id_asociado)
    .order("fecha_inicio", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
