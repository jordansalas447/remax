import AnunciosGallery from "@/components/AnunciosGallery/AnunciosGallery";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="w-full">
        <div className="p-6 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-2">
            Anuncios destacados
          </h2>

          <AnunciosGallery />
        </div>
      </section>
    </div>
  );
}




      {/* <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      </section> */}