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
    <main>
      <h1 className="text-3xl font-bold mb-6">Generar Contrato</h1>
      {/* Botón para abrir el modal */}
      <div className="mb-2">
        <FormGenerarContrato
          TipoContratos={TipoContratos}
          TipoOperaciones={TipoOperaciones}
          Asociado={Asociado}
          onResultado={handleResultado}
           // Asumiendo que FormGenerarContrato soporta modo modal via prop, si no editar dentro de FormGenerarContrato
        />
      </div>
      {/* La tabla ocupa el 100% del ancho */}
      <div className="w-full">
        <TablaGenerarContrato documentos={documentos} />
        {/* Puede agregar un loading/fallback UI si se desea */}
        {/* {fetching && <div className="mt-4 text-blue-600">Cargando documentos...</div>} */}
      </div>
    </main>
  );
}