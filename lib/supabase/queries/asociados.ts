import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/database.types";

type AsociadoRow = Database["public"]["Tables"]["asociados"]["Row"];
type PersonaRow = Database["public"]["Tables"]["personas"]["Row"];
type DetalleAsociadoRow = Database["public"]["Tables"]["detalle_asociado"]["Row"];
type NivelAsociadoRow = Database["public"]["Tables"]["nivel_asociado"]["Row"];

export type AsociadoListItem = Pick<
  AsociadoRow,
  "id_asociado" | "nombre_completo" | "descripcion" | "fecha_creacion"
>;

export type AsociadoDetalle = AsociadoRow & {
  personas: PersonaRow | null;
  detalle_asociado: (DetalleAsociadoRow & { nivel_asociado: NivelAsociadoRow | null }) | null;
};

export async function getAsociados(): Promise<AsociadoListItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("asociados")
    .select("id_asociado, nombre_completo, descripcion, fecha_creacion")
    .order("nombre_completo", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAsociadoDetalle(id_asociado: number): Promise<AsociadoDetalle | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("asociados")
    .select(
      `
      *,
      personas (*),
      detalle_asociado (
        *,
        nivel_asociado (*)
      )
    `,
    )
    .eq("id_asociado", id_asociado)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
