import { notFound } from "next/navigation";
import { CrudManager } from "@/components/crud/CrudManager";
import { fetchTableData } from "@/lib/crud/actions";
import { getTableConfig, isTableName } from "@/lib/crud/config";

export default async function TablePage({
  params,
}: PageProps<"/[table]">) {
  const { table } = await params;

  if (!isTableName(table)) {
    notFound();
  }

  const config = getTableConfig(table)!;

  let data;
  try {
    data = await fetchTableData(table);

   // console.log(data)

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al cargar los datos.";

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <h1 className="text-xl font-semibold text-red-800 dark:text-red-200">
          Error de conexión con Supabase
        </h1>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">{message}</p>
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Verifica que las variables{" "}
          <code className="rounded bg-red-100 px-1 py-0.5 dark:bg-red-900/50">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          y{" "}
          <code className="rounded bg-red-100 px-1 py-0.5 dark:bg-red-900/50">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          estén configuradas en <code>.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <CrudManager
      table={table}
      config={config}
      rows={data.rows}
      options={data.options}
    />
  );
}
