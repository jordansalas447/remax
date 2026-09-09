import type { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/client";

type ContratoRow = Database["public"]["Tables"]["contratos"]["Row"];
type InmueblesRow = Database["public"]["Tables"]["inmuebles"]["Row"];
type DistritoRow = Database["public"]["Tables"]["distritos"]["Row"];
type TipoInmueblesRow = Database["public"]["Tables"]["tipo_propiedad"]["Row"];

export type Contrato = ContratoRow;

export type ContratoConPropiedad = ContratoRow & {
  inmuebles: (InmueblesRow & {
    distritos: Pick<DistritoRow, "distrito"> | null;
    tipo_propiedad: Pick<TipoInmueblesRow, "tipo_propiedad"> | null;
  }) | null;
  operacion?: {
    operacion: string;
  } | null;
  tipo_contrato?: {
    tipo_contrato: string;
  } | null;
  tipo_moneda_precio_inicial?: {
    tipo_moneda: string;
    simbolo: string;
  } | null;
  tipo_moneda_comision?: {
    tipo_moneda_comision: string;
    simbolo: string;
  } | null;
  tipo_moneda_precio_venta?: {
    tipo_moneda_comision: string;
    simbolo: string;
  } | null;
  estado?: {
    estado: string;
    color: string;
  } | null;
};

export type ContratoMulta = {
  nombre_completo: string; // s.nombre_completo - del asociado (JOIN)
  nro_contrato: string;    // c.nro_contrato
  n_partida: string | null;      // p.n_partida - de la propiedad (JOIN)
  fecha_contrato: string | null; // c.fecha_contrato
  fecha_contrato_recibido: string | null; // c.fecha_contrato_recibido
  fecha_contrato_entregado: string | null; // c.fecha_contrato_entregado
  fecha_contrato_sigi: string | null;      // c.fecha_contrato_sigi
  fecha_est_titulo:string | null;
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
      tipo_moneda_precio_inicial:id_tipo_moneda (
        tipo_moneda,
        simbolo
      ),
      tipo_moneda_comision:id_tipo_moneda_comision (
        tipo_moneda,
        simbolo
      ),
      tipo_moneda_precio_venta:id_tipo_moneda_precio_venta (
        tipo_moneda,
        simbolo
      ),
      estado:id_estado (*),
      resource(*),
      inmuebles (
        *,
        distritos (distrito),
        tipo_propiedad (tipo_propiedad)
      )
      `
    )
    .eq("id_asociado", id_asociado)
    .eq("eliminado",false)
    .order("id_contrato", { ascending: false });

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

export async function fechasContratoMulta(): Promise<ContratoMulta[] | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vista_contratos")
    .select("*");


  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
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