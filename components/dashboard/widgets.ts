import type { ComponentType } from "react";
import LlamadasWidget from "./llamadas-widget";
import ContratosGeneradosWidget from "./contratos-generados-widget";

/**
 * Registro de componentes del dashboard.
 * Para agregar uno nuevo: crea el componente en esta carpeta y añádelo aquí.
 */
export const DASHBOARD_WIDGETS: { id: string; Component: ComponentType }[] = [
  { id: "llamadas", Component: LlamadasWidget },
  { id: "contratos-generados", Component: ContratosGeneradosWidget },
];

