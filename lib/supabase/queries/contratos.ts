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
  operacion?: {
    operacion: string;
  } | null;
  tipo_contrato?: {
    tipo_contrato: string;
  } | null;
  tipo_moneda?: {
    tipo_moneda: string;
    simbolo: string;
  } | null;
  tipo_moneda_comision?: {
    tipo_moneda_comision: string;
    simbolo: string;
  } | null;
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

  // Especificar explícitamente cada relación de tipo_moneda por el nombre de la clave foránea para evitar ambigüedad.
  // Suponiendo los nombres de las FK según estructura del modelo: 'id_tipo_moneda' y 'id_tipo_moneda_comision'
  const { data, error } = await supabase
    .from("contratos")
    .select(
      `
      *,
      operacion (*),
      tipo_contrato(tipo_contrato),
      tipo_moneda:id_tipo_moneda (
        tipo_moneda,
        simbolo
      ),
      tipo_moneda_comision:id_tipo_moneda_comision (
        tipo_moneda,
        simbolo
      ),
      propiedades (
        *,
        distritos (distrito),
        tipo_propiedad (tipo_propiedad)
      )
      `
    )
    .eq("id_asociado", id_asociado)
    .order("fecha_inicio", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}
