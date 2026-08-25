import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Función para consultar todos los registros de la tabla "tabla".
 * GET /api/crud/tabla
 */
export async function get_tabla() {
  const TABLE_NAME = "tablas";

  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}