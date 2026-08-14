import Link from "next/link";
import { TABLE_CONFIGS, TABLE_NAMES } from "@/lib/crud/config";
import { get_tabla } from "@/lib/crud/service";
import { library, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas);

export default async function HomePage() {

  // Debes esperar la promesa que retorna GET_tabla usando await
  // Y no uses mayúscula para variables comunes por convención.
  const response = await get_tabla();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Panel de captaciones
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Administra asesores, propiedades, contratos, revisiones y el checklist
          de cada ficha inmobiliaria conectado a tu base de datos en Supabase.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TABLE_NAMES.map(async (name) => {
          const config = TABLE_CONFIGS[name];

          return (
            <Link
              key={name}
              href={`/${name}`}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700"
            >
              
              {response && Array.isArray(response) && response.length > 0
                                    ? response.filter((icn: any) => icn.nombre === config.label)
                                        .map((icn: any, idx: number) => {
                                            try {
                                                return <FontAwesomeIcon key={idx} icon={["fas", icn.icon]} />;
                                            } catch (e) {
                                                // Si ocurre error, omite el ícono
                                                return <></>;
                                            }
                                        })
                                    : null}   

              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {config.label}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">{config.description}</p>
              <p className="mt-4 text-sm font-medium text-blue-600">
                Gestionar registros →
              </p>          
            </Link>
          );
        })}
      </section>
    </div>
  );
}
