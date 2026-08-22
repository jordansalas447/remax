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

// Obtener todos los contratos (READ)
export async function getContratos(): Promise<Contrato[]> {
  const supabase = createClient();

  const { data, error } = await supabase.from("contratos").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

// Obtener contratos por asociado (READ + relaciones)
export async function getContratosByAsociadoId(id_asociado: number): Promise<ContratoConPropiedad[]> {
  const supabase = createClient();

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

// Obtener un contrato por ID (READ ONE)
export async function getContratoById(id_contrato: number): Promise<Contrato | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contratos")
    .select("*")
    .eq("id_contrato", id_contrato)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data ?? null;
}

// Crear un nuevo contrato (CREATE)
export async function createContrato(contrato: Omit<Contrato, "id_contrato">): Promise<Contrato> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contratos")
    .insert([contrato])
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No se pudo crear el contrato");
  }
  return data;
}

// Actualizar un contrato existente (UPDATE)
export async function updateContrato(id_contrato: number, updates: Partial<Contrato>): Promise<Contrato> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contratos")
    .update(updates)
    .eq("id_contrato", id_contrato)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No se encontró el contrato para actualizar");
  }
  return data;
}

// Eliminar un contrato (DELETE)
export async function deleteContrato(id_contrato: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("contratos")
    .delete()
    .eq("id_contrato", id_contrato);

  if (error) {
    throw new Error(error.message);
  }
}