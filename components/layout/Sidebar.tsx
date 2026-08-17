import Link from "next/link";
import "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faBuilding } from "@fortawesome/free-solid-svg-icons";
import { Options } from "./Options";
import { get_tabla } from "@/lib/crud/service";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export async function AppSidebar() {

  // const response = await get_tabla();

  return (
     <Sidebar>
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link
                href="/asociado"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Ficha de asociado
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Options />
            </SidebarMenuItem>
            <SidebarMenuItem>
              {/* Herramientas group using Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <SidebarMenuButton>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faTools} className="text-blue-600 dark:text-blue-400" />
                      Herramientas
                      <ChevronDown className="ml-auto w-4 h-4" />
                    </span>
                  </SidebarMenuButton>
                } />
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href="/herramientas/reportes"
                      className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline"
                    >
                      <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      Reportes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/herramientas/auditorias"
                      className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline"
                    >
                      <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      Auditorías
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/miniapps"
                      className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline"
                    >
                      <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      Miniapps
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 text-center pt-4">
          &copy; {new Date().getFullYear()} RE/MAX Adelante. Todos los derechos reservados.
        </div>
      </SidebarFooter>
    </Sidebar>

  );
}
