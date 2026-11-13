import { unstable_cache, updateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Segundos que se conservan en cache los catálogos (tipo_*, estado_*, etc.). */
export const CATALOG_REVALIDATE_SECONDS = 300;

export const crudTableTag = (table: string) => `crud:${table}`;

/**
 * Registros activos de una tabla referenciada por foreign key.
 * Se cachea entre requests y usuarios (clave: tabla + campo de orden) y se
 * invalida con `invalidateCrudTable` cuando la tabla cambia.
 *
 * Nota: el cliente se crea fuera (usa cookies) y solo se captura por closure;
 * la clave de cache NO depende del usuario, así que úsalo para catálogos compartidos.
 */
export function getCachedFkRecords(
  supabase: SupabaseClient,
  table: string,
  orderField: string,
): Promise<Array<Record<string, any>>> {
  const load = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .is("eliminado", false)
        .order(orderField, { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []) as Array<Record<string, any>>;
    },
    ["crud-fk-records", table, orderField],
    { tags: [crudTableTag(table)], revalidate: CATALOG_REVALIDATE_SECONDS },
  );

  return load();
}

/** Llamar tras insertar / actualizar / eliminar en `table`. */
export function invalidateCrudTable(table: string) {
  updateTag(crudTableTag(table));
}
