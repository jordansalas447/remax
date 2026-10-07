import FormGenerarContrato from "@/components/generar-contrato/form-generar-contrato";
import TablaGenerarContrato from "@/components/generar-contrato/tabla-generar-contrato";
import { getDocumentosByAsociado } from "@/lib/supabase/queries/documentos";

export default async function Page() {

  const getdata = await getDocumentosByAsociado(1) || []

  return (
    <main className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">Generar Contrato</h1>
      <div className="flex flex-col md:flex-row gap-2 items-start">
        <div className="w-full md:w-1/4">
          <FormGenerarContrato />
        </div>
        <div className="w-full md:w-3/4">
          <TablaGenerarContrato documentos={getdata} />
        </div>
      </div>
    </main>
  );
}