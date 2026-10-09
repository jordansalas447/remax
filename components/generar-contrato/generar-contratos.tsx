"use client";

import { useEffect, useState, useCallback } from "react";
import FormGenerarContrato from "@/components/generar-contrato/form-generar-contrato";
import TablaGenerarContrato from "@/components/generar-contrato/tabla-generar-contrato";
import { getDocumentosByAsociado } from "@/lib/supabase/queries/documentos";

// Props type for the page/component (adapt as needed)
interface GenerarContratosProps {
  TipoContratos: any[];
  TipoOperaciones: any[];
  Asociado: number;
}

export default function GenerarContratos({
  TipoContratos,
  TipoOperaciones,
  Asociado,
}: GenerarContratosProps) {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  // Fetch documentos when Asociado changes or after form submission
  const fetchDocumentos = useCallback(async () => {
    if (Asociado && Asociado > 0) {
      setFetching(true);
      try {
        const data = await getDocumentosByAsociado(Asociado);
        setDocumentos(data || []);
      } catch (err) {
        setDocumentos([]);
      }
      setFetching(false);
    } else {
      setDocumentos([]);
    }
  }, [Asociado]);

  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  const handleResultado = async (_valor: string) => {
    // Refetch documentos after successful contract creation
    await fetchDocumentos();
  };

  return (
    <main className="mx-auto">
      <h1 className="text-3xl font-bold mb-6">Generar Contrato</h1>
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-2 items-start">
        <div className="w-full sm:w-full md:w-1/3 lg:w-2/4 xl:w-2/5 2xl:w-2/6">
          <FormGenerarContrato
            TipoContratos={TipoContratos}
            TipoOperaciones={TipoOperaciones}
            Asociado={Asociado}
            onResultado={handleResultado}
          />
        </div>
        <div className="w-full sm:w-full md:w-2/3 lg:w-3/4 xl:w-4/5 2xl:w-5/6">
          <TablaGenerarContrato documentos={documentos} />
          {/* Can add loading/fallback UI if desired:
           {fetching && <div className="mt-4 text-blue-600">Cargando documentos...</div>} */}
        </div>
      </div>
    </main>
  );
}