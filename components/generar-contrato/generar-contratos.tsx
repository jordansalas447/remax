"use client";

import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import FormGenerarContrato from "@/components/generar-contrato/form-generar-contrato";
import CardsGenerarContrato, {
  CardsGenerarContratoSkeleton,
} from "@/components/generar-contrato/cards-generar-contrato";
import { Button } from "@/components/ui/button";
import {
  getDocumentosByAsociado,
  LimiteDiarioDocumentosxAsesor,
  LimiteDiarioDocumentosxAsesorRow,
  type DocumentosRowDetalle,
} from "@/lib/supabase/queries/documentos";

interface GenerarContratosProps {
  TipoContratos: any[];
  TipoOperaciones: any[];
  Asociado: number;
  NombreAsociado: string | undefined | null;
}

export default function GenerarContratos({
  TipoContratos,
  TipoOperaciones,
  Asociado,
  NombreAsociado,
}: GenerarContratosProps) {
  const [documentos, setDocumentos] = useState<DocumentosRowDetalle[]>([]);
  const [contador, setcontador] = useState<LimiteDiarioDocumentosxAsesorRow[]>([]);
  const [fetching, setFetching] = useState(false);
  const [vista, setVista] = useState<"lista" | "formulario">("lista");

  const fetchDocumentos = useCallback(async () => {
    if (Asociado && Asociado > 0) {
      setFetching(true);
      try {
        const data = await getDocumentosByAsociado(Asociado);
        const contador = await LimiteDiarioDocumentosxAsesor(Asociado)
        setDocumentos(data || []);
        console.log(contador)
        setcontador(contador);
      } catch {
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
    setVista("lista");
    await fetchDocumentos();
  };

  return (
    <main>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">
          {vista === "formulario" ? "Nuevo contrato" : "Generar Contrato"}
        </h1>
        {vista === "lista" ? (
          <Button
            size="lg"
            className="
              min-h-12 px-5
              bg-gradient-to-r from-[#003DA5] via-[#0055B8] to-[#003DA5]
              hover:from-[#002D7A] hover:via-[#00449E] hover:to-[#002D7A]
              text-white font-semibold
              rounded-lg
              border border-blue-400/30
              transition-all duration-300 ease-out
              hover:brightness-110
              active:scale-[0.98]
            "
            onClick={() => setVista("formulario")}
          >
            <FontAwesomeIcon icon={faFileContract} className="mr-2" />
            Generar Contrato
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={() => setVista("lista")}>
            Volver al listado
          </Button>
        )}
      </div>

      {vista === "formulario" ? (
        <FormGenerarContrato
          TipoContratos={TipoContratos}
          TipoOperaciones={TipoOperaciones}
          Asociado={Asociado}
          NombreAsociado={NombreAsociado}
          onResultado={handleResultado}
          onCancelar={() => setVista("lista")}
        />
      ) : (
        <div className="w-full">
          {fetching ? (
            <CardsGenerarContratoSkeleton />
          ) : (
            <CardsGenerarContrato documentos={documentos} contador={contador[0]} />
          )}
        </div>
      )}
    </main>
  );
}