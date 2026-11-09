"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import FormGenerarContrato from "@/components/generar-contrato/form-generar-contrato";
import CardsGenerarContrato, {
  CardsGenerarContratoSkeleton,
  DocumentoCard,
  formatDate,
} from "@/components/generar-contrato/cards-generar-contrato";
import { Button } from "@/components/ui/button";
import {
  getDocumentosByAsociado,
  type DocumentosRowDetalle,
} from "@/lib/supabase/queries/documentos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, FileX2, UserCheck, Users } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { Separator } from "@base-ui/react";

interface GenerarContratosProps {
  //  TipoContratos: any[];
  //  TipoOperaciones: any[];
  Asociado: number;
  //  NombreAsociado: string | undefined | null;
}

export default function ContratosEmitidos({
  // TipoContratos,
  // TipoOperaciones,
  Asociado,
  // NombreAsociado,
}: GenerarContratosProps) {
  const [documentos, setDocumentos] = useState<DocumentosRowDetalle[]>([]);
  const [fetching, setFetching] = useState(false);
  const [vista, setVista] = useState<"lista" | "formulario">("lista");

  const fetchDocumentos = useCallback(async () => {
    if (Asociado && Asociado > 0) {
      setFetching(true);
      try {
        const data = await getDocumentosByAsociado(Asociado);
        setDocumentos(data || []);
      } catch {
        setDocumentos([]);
      }
      setFetching(false);
    } else {
      setDocumentos([]);
    }
  }, [Asociado]);

  const [filtro, setFiltro] = useState("")

  const documentosFiltrados = useMemo(() => {
    const query = filtro.trim().toLowerCase()
    if (!query) return documentos
    return documentos.filter((documento) =>
      documento.nro_contrato.toLowerCase().includes(query),
    )
  }, [documentos, filtro])

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
          Contratos Emitidos
        </h1>
        {/* {vista === "lista" ? (
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
        )} */}
      </div>

      {vista === "formulario" ? (
        <></>
      ) : (
        <div className="w-full">
          {documentosFiltrados.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <FileX2 className="size-8 text-zinc-400" />
                <p className="text-sm text-zinc-500">
                  {documentos.length === 0
                    ? "Aún no hay contratos generados."
                    : "No hay contratos que coincidan con el filtro."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-3">
              {documentosFiltrados.map((documento) => (
                <Card key={documento.id} className="rounded-none shadow-none">
                  <CardHeader className="gap-0">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <FileText className="size-4 shrink-0 text-black-600" />
                        <span className="font-mono">{documento.nro_contrato} </span>
                        <small className="text-slate-900 font-normal">({formatDate(documento.created_at)})</small>
                      </CardTitle>
                      <Badge
                        variant={documento.estado_documento?.color as BadgeVariant}
                      >
                        {documento.estado_documento?.estado ?? "Sin estado"}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-wrap gap-1.5">
                      <Badge variant="outline">
                        {documento.tipo_contrato?.tipo_contrato ?? "Sin tipo"}
                      </Badge>
                      <Badge variant={documento.operacion?.color as BadgeVariant}>
                        {documento.operacion?.operacion ?? "Sin operación"}
                      </Badge>
                      {documento.motivo_anulacion ? (
                        <p className="bg-red-50 px-2.5 py-2 text-xs text-red-800">
                          Motivo anulación: {documento.motivo_anulacion}
                        </p>
                      ) : null}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 shrink-0" />
                      <span>
                        {documento.nro_propietarios ?? 0} propietario
                        {(documento.nro_propietarios ?? 0) === 1 ? "" : "s"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

