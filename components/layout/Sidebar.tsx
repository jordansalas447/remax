import Link from "next/link";
import "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faBuilding, faChartLine, faUserTie, faUser } from "@fortawesome/free-solid-svg-icons";
import { Options } from "./Options";
import { get_tabla } from "@/lib/crud/service";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BookOpen, ChevronDown, Play, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

export async function AppSidebar() {

  const response = await get_tabla();

  // console.log(response)

  return (
     <Sidebar>
      <SidebarHeader>
        <div className="flex justify-center items-center w-full">
          <Link href="/" className="group">
            <span>
              <img
                src="/LogoRemax.png"
                alt="Logo RE/MAX"
                className="object-contain w-40 p-2 mx-auto block"
              />
            </span>
          </Link>
        </div>
  
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
          <SidebarMenuItem>
      </SidebarMenuItem>
          <SidebarMenuItem>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <FontAwesomeIcon icon={faChartLine} />
                Dashboard
              </Link>
              
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link
                href="/asociado"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <FontAwesomeIcon icon={faUserTie} />
                Ficha de asociado
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Options Icons={response} />
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
            <SidebarMenuItem>
              {/* Herramientas group using Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <SidebarMenuButton>
                    <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} />
                      Usuario
                      <ChevronRight className="ml-auto w-4 h-4" />
                    </span>
                  </SidebarMenuButton>
                } />
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link
                      href="#"
                      className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline"
                    >
                      <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      Cerrar Sessión
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
