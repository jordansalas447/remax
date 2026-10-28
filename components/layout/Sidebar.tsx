import Link from "next/link";
import "@/lib/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faBuilding, faChartLine, faUserTie, faUser, faPhone, faFileContract, faClock } from "@fortawesome/free-solid-svg-icons";
import { Options } from "./Options";
import { UserMenu } from "./UserMenu";
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
import { getAsociadoByProfileId } from "@/lib/supabase/queries/asociados";
import { getSession } from "@/lib/auth/session";

export async function AppSidebar() {

  const response = await get_tabla();
  const session = await getSession();
  const Asociado = await getAsociadoByProfileId(session?.profile?.id || "");


  if (typeof Asociado?.personas?.asociados?.[0]?.id_asociado === "undefined") {
    return null;
  }


  const isAdmin = session?.profile?.role === "admin";

  const idAsociado = Asociado?.personas?.asociados?.[0]?.id_asociado;

  const soloGenerarContrato = !isAdmin && [13, 15,undefined].includes(idAsociado);

 // console.log(isAdmin,idAsociado,soloGenerarContrato)

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
            {soloGenerarContrato ? (
              <SidebarMenuItem>
                <Link
                  href="/generar-contrato"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <FontAwesomeIcon icon={faFileContract} />
                  Generar Contrato
                </Link>
              </SidebarMenuItem>
            ) : (
              <>
                <SidebarMenuItem>
                  <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <FontAwesomeIcon icon={faChartLine} />
                    Dashboard
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/generar-contrato" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <FontAwesomeIcon icon={faFileContract} />
                    Generar Contrato
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/asociado" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <FontAwesomeIcon icon={faUserTie} />
                    Ficha de asociado
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/llamadas-gestion" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <FontAwesomeIcon icon={faPhone} />
                    Llamadas
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/multas" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <FontAwesomeIcon icon={faUserTie} />
                    Multas
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/revisiones-gestion" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    Revisiones
                  </Link>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Options Icons={response} />
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuButton>
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTools} className="text-blue-600 dark:text-blue-400" />
                            Herramientas
                            <ChevronDown className="ml-auto w-4 h-4" />
                          </span>
                        </SidebarMenuButton>
                      }
                    />
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link href="/herramientas/reportes" className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline">
                          <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          Reportes
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link href="/herramientas/auditorias" className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline">
                          <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          Auditorías
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem>
                        <Link href="/miniapps" className="flex items-center gap-2 px-2 py-1 text-base text-zinc-700 dark:text-zinc-200 hover:underline">
                          <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          Miniapps
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Link href="/perfil" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <FontAwesomeIcon icon={faUser} />
                    Mi perfil
                  </Link>
                </SidebarMenuItem>

                {isAdmin && (
                  <SidebarMenuItem>
                    <Link href="/accesos" className="flex items-center gap-2 rounded-lg px-3 py-2 text-base transition duration-150 text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                      <FontAwesomeIcon icon={faClock} />
                      Control de acceso
                    </Link>
                  </SidebarMenuItem>
                )}
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
        <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 text-center pt-4">
          &copy; {new Date().getFullYear()} RE/MAX Adelante. Todos los derechos reservados.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
