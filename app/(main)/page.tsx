import { DASHBOARD_WIDGETS } from "@/components/dashboard/widgets";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
    <section className="w-full">
      <div className="p-6 flex flex-col items-center gap-6">
        {/* <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-2">
          Anuncios destacados
        </h2> */}

        {/* <AnunciosGallery /> */}
      </div>
      <div>
        <Link
          href="/generar-contrato"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        >
          <FontAwesomeIcon icon={faFileContract} />
          Generar Contrato
        </Link>
      </div>
    </section>
  </div>
  )
  // return (
  //   <div className="space-y-8">
  //     <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
  //       {DASHBOARD_WIDGETS.map(({ id, Component }) => (
  //         <Component key={id} />
  //       ))}
  //     </section>
  //   </div>
  // );
}
