import ContratosGeneradosWidget from "@/components/dashboard/contratos-generados-widget";
import ContratosDashboard from "@/components/dashboard/contratos-dashboard";
import { ExpandableGrid } from "@/components/dashboard/expandable-card";
import LlamadasDashboard from "@/components/dashboard/llamadas-dashboard";
import LlamadasWidget from "@/components/dashboard/llamadas-widget";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl">
      {/* Al hacer click en una card, la vista se reemplaza por su dashboard. Agrega más items aquí. */}
      <ExpandableGrid
        items={[
          {
            id: "llamadas",
            title: "Llamadas a Propietarios",
            preview: <LlamadasWidget />,
            content: <LlamadasDashboard />,
          },
          {
            id: "contratos",
            title: "Contratos",
            preview: <ContratosGeneradosWidget />,
            content: <ContratosDashboard />,
          },
        ]}
      />
    </main>
  );
}
