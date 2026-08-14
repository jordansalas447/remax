import Link from "next/link";
import "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { Options } from "./Options";
import { get_tabla } from "@/lib/crud/service";


export async function Sidebar() {

 // const response = await get_tabla();

  return (
    <aside className="flex w-full flex-col min-h-screen border-b border-zinc-200 bg-gradient-to-b from-blue-50 via-white to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 dark:border-zinc-800 lg:w-80 lg:border-b-0 lg:border-r shadow-lg">
      <div className="flex flex-col gap-3 border-b border-red-200 px-8 py-7 dark:border-red-800">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 shadow transition group-hover:scale-105">
            <FontAwesomeIcon icon={faBuilding} size="lg" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
              RE/MAX Adelante
            </p>
            <h1 className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">
              CAPTACIONES
            </h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Gestión de inmuebles y revisiones
            </p>
          </div>
        </Link>
      </div>


      <nav className="flex-1 flex flex-col gap-5 pb-8">
        {/* Colapsable para Tablas */}
         <Options/> 

        {/* Colapsable para Herramientas */}
        <details className="group overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80">
          <summary className="flex items-center gap-2 cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 group-open:text-red-600 transition bg-zinc-50 dark:bg-zinc-900">
            <FontAwesomeIcon icon={faTools} className="text-blue-600 dark:text-blue-400" />
            Herramientas
          </summary>
          <ul className="pl-4 py-2 flex flex-col gap-2">
            <li>
              <Link
                href="/herramientas/reportes"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                Reportes
              </Link>
            </li>
            <li>
              <Link
                href="/herramientas/auditorias"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                Auditorías
              </Link>
            </li>
            <li>
              <Link
                href="/miniapps"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                Miniapps
              </Link>
            </li>
            {/* Agrega más herramientas aquí si es necesario */}
          </ul>
        </details>
      </nav>
      <div className="mt-auto p-5 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 text-center">
        &copy; {new Date().getFullYear()} RE/MAX Adelante. Todos los derechos reservados.
      </div>
    </aside>
  );
}
