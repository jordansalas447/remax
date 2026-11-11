import ContratosGeneradosWidget from "@/components/dashboard/contratos-generados-widget";
import ContratosDashboard from "@/components/dashboard/contratos-dashboard";
import { ExpandableCard } from "@/components/dashboard/expandable-card";
import LlamadasDashboard from "@/components/dashboard/llamadas-dashboard";
import LlamadasWidget from "@/components/dashboard/llamadas-widget";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Card ampliable: al hacer click abre LlamadasDashboard */}
        <ExpandableCard title="Llamadas a Propietarios" preview={<LlamadasWidget />}>
          <LlamadasDashboard />
        </ExpandableCard>

        {/* Card ampliable: al hacer click abre ContratosDashboard (en blanco) */}
        <ExpandableCard title="Contratos" preview={<ContratosGeneradosWidget />}>
          <ContratosDashboard />
        </ExpandableCard>

        {/* Agrega más cards aquí. */}
      </section>
    </main>
  );
}
