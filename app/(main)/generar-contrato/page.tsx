import FormGenerarContrato from "@/components/generar-contrato/form-generar-contrato";
import GenerarContratos from "@/components/generar-contrato/generar-contratos";
import TablaGenerarContrato from "@/components/generar-contrato/tabla-generar-contrato";
import { getSession } from "@/lib/auth/session";
import { getAsociadoByProfileId, ProfilesDetalle } from "@/lib/supabase/queries/asociados";
import { getDocumentosByAsociado } from "@/lib/supabase/queries/documentos";
import { getOperaciones } from "@/lib/supabase/queries/operaciones";
import { getTiposContrato } from "@/lib/supabase/queries/tipos_contratos";

export default async function Page() {

  const session = await getSession();
  const Asociado = await getAsociadoByProfileId(session?.profile?.id || "");

  let id_asociado:number;
  id_asociado = Asociado?.personas?.asociados[0].id_asociado || 0;

  const DataOperaciones = await getOperaciones();
  const DateTiposContrato = await getTiposContrato();
  
  return (
    <main className="mx-auto">
        <GenerarContratos TipoContratos={DateTiposContrato} TipoOperaciones={DataOperaciones} Asociado={id_asociado || 0}/>
    </main>
  );
}