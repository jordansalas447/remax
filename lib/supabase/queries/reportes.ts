import { createClient } from "@/lib/supabase/client"

/**
 * Obtiene el reporte de contratos usando la función remota "ObtenerReporteContrato".
 * Retorna un array de objetos con los datos del reporte.
 */
export async function obtenerReporteContratos(): Promise<any[]> {
  const supabase = createClient();

  // Desarrollo: llamada explícita a la función RPC/postgresql "ObtenerReporteContrato"
  const { data, error } = await supabase.rpc('obtener_reporte_contrato');

  if (error) {
    throw new Error(`Error al obtener reporte: ${error.message}`);
  }

  return data ?? [];
}