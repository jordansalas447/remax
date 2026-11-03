import { Suspense } from "react";
import GenerarContratos from "@/components/generar-contrato/generar-contratos";
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
    <div className="space-y-6 bg-white shadow-md rounded-lg p-4">
      {/* Título */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      {/* Tabla */}
      <div className="rounded-lg border">
        <div className="flex gap-4 border-b p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="flex gap-4 border-b p-4 last:border-b-0">
            {Array.from({ length: 4 }).map((_, col) => (
              <Skeleton key={col} className="h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}