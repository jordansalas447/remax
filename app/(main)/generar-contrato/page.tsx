import { Suspense } from "react";
import GenerarContratos from "@/components/generar-contrato/generar-contratos";
import { CardsGenerarContratoSkeleton } from "@/components/generar-contrato/cards-generar-contrato";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth/session";
import { getAsociadoByProfileId } from "@/lib/supabase/queries/asociados";
import { getOperaciones } from "@/lib/supabase/queries/operaciones";
import { getTiposContrato } from "@/lib/supabase/queries/tipos_contratos";

async function ContratosContent() {
  const session = await getSession();
  const Asociado = await getAsociadoByProfileId(session?.profile?.id || "");

  const asociado = Asociado?.personas?.asociados[0];
  const id_asociado = asociado?.id_asociado || 0;
  const NombreAsociado = asociado?.nombre_completo;

  // Se ejecutan en paralelo (no dependen del asociado)
  const [DataOperaciones, DateTiposContrato] = await Promise.all([
    getOperaciones(),
    getTiposContrato(),
  ]);

  return (
    <GenerarContratos
      TipoContratos={DateTiposContrato}
      TipoOperaciones={DataOperaciones}
      Asociado={id_asociado}
      NombreAsociado={NombreAsociado}
    />
  );
}

export default function Page() {
  return (
    <main className="mx-auto">
      <Suspense fallback={<SkeletonGenerarContrato />}>
        <ContratosContent />
      </Suspense>
    </main>
  );
}


export function SkeletonGenerarContrato() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-12 w-48 rounded" />
      </div>
      <CardsGenerarContratoSkeleton />
    </div>
  );
}