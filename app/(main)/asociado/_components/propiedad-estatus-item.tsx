"use client";

import { useEffect, useState } from "react";
import { getEstadosRevision } from "@/lib/supabase/queries/estados_revision";
import { updateRevision } from "@/lib/supabase/queries/revisiones";
import type { EstadoRevisionRow } from "@/lib/supabase/queries/estados_revision";
import { FileCheck2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RevisionDocumentoDetalle } from "@/lib/supabase/queries/propiedad_propietarios";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faFile, faFileContract, faUser } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Input } from "@base-ui/react";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type DocumentsCheckProps = {
  revisiones: RevisionDocumentoDetalle[];
  loading: boolean;
};

type PendingChangeMap = {
  [id: number]: {
    oficina?: number;
    sigi?: number;
    observacion?: string;
  };
};

export function RevisionesEstatusItem({ revisiones, loading }: DocumentsCheckProps) {
  const [estadosRevision, setEstadosRevision] = useState<EstadoRevisionRow[]>([]);
  const [selectedOficinas, setSelectedOficinas] = useState<{ [id: number]: number }>({});
  const [selectedSigi, setSelectedSigi] = useState<{ [id: number]: number }>({});
  const [editedObservaciones, setEditedObservaciones] = useState<{ [id: number]: string }>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChangeMap>({});
  const [savingIds, setSavingIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEstadosRevision();
        setEstadosRevision(data || []);
      } catch (e) {
        setEstadosRevision([]);
      }
    })();
  }, []);

  // Pre-fill selection states from revisiones when arrives or changes
  useEffect(() => {
    if (estadosRevision.length === 0) return; // wait until catalog is loaded

    setSelectedOficinas(
      revisiones.reduce((acc, doc) => {
        const match = estadosRevision.find((e) => e.descripcion === doc.estado_oficina);
        acc[doc.id_revision] = match?.id ?? 0;
        return acc;
      }, {} as Record<number, number>)
    );
    setSelectedSigi(
      revisiones.reduce((acc, doc) => {
        const match = estadosRevision.find((e) => e.descripcion === doc.estado_sigi);
        acc[doc.id_revision] = match?.id ?? 0;
        return acc;
      }, {} as Record<number, number>)
    );
    setEditedObservaciones(
      revisiones.reduce((acc, doc) => {
        acc[doc.id_revision] = doc.observacion || "";
        return acc;
      }, {} as Record<number, string>)
    );
    setPendingChanges({});
  }, [revisiones, estadosRevision]);

  function getStatusStyles(descripcion: string) {
    if (descripcion === "-") {
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    }
    return "bg-zinc-100 text-zinc-800";
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck2 className="size-5 text-indigo-600" />
            Revisión de documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  // Handlers
  const handleOficinaChange = (doc: RevisionDocumentoDetalle, newIdStr: string) => {
    const newId = Number(newIdStr);
    setSelectedOficinas(prev => ({ ...prev, [doc.id_revision]: newId }));
    setPendingChanges(prev => ({
      ...prev,
      [doc.id_revision]: {
        ...prev[doc.id_revision],
        oficina: newId,
      }
    }));
  };

  const handleSigiChange = (doc: RevisionDocumentoDetalle, newIdStr: string) => {
    const newId = Number(newIdStr);
    setSelectedSigi(prev => ({ ...prev, [doc.id_revision]: newId }));
    setPendingChanges(prev => ({
      ...prev,
      [doc.id_revision]: {
        ...prev[doc.id_revision],
        sigi: newId,
      }
    }));
  };

  // Nuevo handler para observacion editable
  const handleObservacionChange = (doc: RevisionDocumentoDetalle, value: string) => {
    setEditedObservaciones(prev => ({
      ...prev,
      [doc.id_revision]: value,
    }));
    setPendingChanges(prev => ({
      ...prev,
      [doc.id_revision]: {
        ...prev[doc.id_revision],
        observacion: value,
      }
    }));
  };

  // Usar el endpoint updateRevision para guardar cambios en revisiones.
  const handleSave = async (
    doc: RevisionDocumentoDetalle
  ) => {
    const cambios = pendingChanges[doc.id_revision];
    if (!cambios) return;
    setSavingIds(ids => [...ids, doc.id_revision]);
    try {
      const updateObj: Record<string, any> = {};
      if (typeof cambios.oficina !== "undefined") {
        updateObj.id_estado_oficina = cambios.oficina;
      }
      if (typeof cambios.sigi !== "undefined") {
        updateObj.id_estado_sigi = cambios.sigi;
      }
      if (typeof cambios.observacion !== "undefined") {
        updateObj.observacion = cambios.observacion;
      }
      await updateRevision(doc.id_revision, updateObj);

      // Después de guardar, limpiar los cambios pendientes y refrescar observacion
      setPendingChanges((prev) => {
        const newPending = { ...prev };
        delete newPending[doc.id_revision];
        return newPending;
      });
    } catch (err) {
      // TODO: Dar feedback de error
    } finally {
      setSavingIds(ids => ids.filter(id => id !== doc.id_revision));
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader className="border-b bg-muted/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <FileCheck2 className="size-5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg">
                  Revisiones pendientes
                </CardTitle>

                {revisiones.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  >
                    {revisiones.length}
                  </Badge>
                )}
              </div>

              <CardDescription>
                {revisiones.length > 0
                  ? `${revisiones.length} documento${revisiones.length > 1 ? "s" : ""} pendiente${revisiones.length > 1 ? "s" : ""} de revisión`
                  : "No hay documentos pendientes por ahora"}
              </CardDescription>
            </div>
          </div>

          {revisiones.length > 0 && (
            <Badge
              variant="outline"
              className="hidden shrink-0 rounded-full border-amber-200 bg-amber-50 text-amber-700 sm:flex dark:border-amber-900/50 dark:bg-amber-500/10 dark:text-amber-400"
            >
              Requiere atención
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      {revisiones.length > 0 ? (
        <CardContent className="space-y-3 p-4 sm:p-6">
          {revisiones.map((doc) => {
            const hasPending = !!pendingChanges[doc.id_revision];
            const oficinaId = selectedOficinas[doc.id_revision];
            const sigiId = selectedSigi[doc.id_revision];
            const oficina = estadosRevision.find((e) => e.id === oficinaId)?.descripcion ?? doc.estado_oficina ?? "-";
            const sigi = estadosRevision.find((e) => e.id === sigiId)?.descripcion ?? doc.estado_sigi ?? "-";
            const isSaving = savingIds.includes(doc.id_revision);
            const observacion = editedObservaciones[doc.id_revision] !== undefined ? editedObservaciones[doc.id_revision] : (doc.observacion || "");

            return (
              <div
                key={doc.id_revision}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-card transition-all",
                  hasPending
                    ? "border-amber-300 shadow-sm shadow-amber-100/50 dark:border-amber-800/70 dark:shadow-none"
                    : "border-border hover:border-muted-foreground/20 hover:shadow-sm"
                )}
              >
                {/* Indicador lateral */}
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-1",
                    hasPending
                      ? "bg-amber-500"
                      : "bg-muted-foreground/20"
                  )}
                />

                <div className="p-4 pl-5 sm:p-5 sm:pl-6">
                  {/* Información principal */}
                  <div className="w-full">
                    <Accordion className="w-full">
                      <AccordionItem value={`doc-${doc.id_revision}`}>
                        <AccordionTrigger className="!no-underline text-left py-1 px-0 group">
                          <div className="w-full flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {doc.operacion}
                              </h3>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">
                                {doc.nombre_item} | <strong>{doc.rev}</strong>  |
                                Oficina:
                                <Badge variant={"secondary"} className="ml-2">
                                 {oficina}
                                </Badge> |
                                Sigi: 
                                <Badge variant={"secondary"} className="ml-2">
                                {sigi}
                                </Badge>
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                              <span>ID #{doc.id_revision}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                Creado el {new Date(doc.fecha_creado).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between pt-2">
                            <div className="min-w-0 flex-1 space-y-4">
                              {/* Estados */}
                              <div className="grid gap-3 sm:grid-cols-2">
                                {/* Oficina */}
                                <div className="rounded-lg border bg-muted/20 p-3">
                                  <div className="mb-2 flex items-center justify-between gap-2">
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Estado Oficina
                                      </p>
                                      <p className="text-[11px] text-muted-foreground/70">
                                        Estado de revisión
                                      </p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        getStatusStyles(oficina)
                                      )}
                                    >
                                      {oficina}
                                    </Badge>
                                  </div>
                                  <NativeSelect
                                    aria-label="Seleccionar estado oficina"
                                    value={String(oficinaId ?? "")}
                                    onChange={(e) => {
                                      handleOficinaChange(doc, e.target.value);
                                    }}
                                    className="h-9 w-full border-border bg-background"
                                  >
                                    {estadosRevision.map((estado) => (
                                      <option
                                        value={String(estado.id)}
                                        key={estado.id}
                                      >
                                        {estado.descripcion}
                                      </option>
                                    ))}
                                  </NativeSelect>
                                </div>
                                {/* SIGI */}
                                <div className="rounded-lg border bg-muted/20 p-3">
                                  <div className="mb-2 flex items-center justify-between gap-2">
                                    <div>
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Estado SIGI
                                      </p>
                                      <p className="text-[11px] text-muted-foreground/70">
                                        Estado en sistema
                                      </p>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                        getStatusStyles(sigi)
                                      )}
                                    >
                                      {sigi}
                                    </Badge>
                                  </div>
                                  <NativeSelect
                                    aria-label="Seleccionar estado SIGI"
                                    value={String(sigiId ?? "")}
                                    onChange={(e) => {
                                      handleSigiChange(doc, e.target.value);
                                    }}
                                    className="h-9 w-full border-border bg-background"
                                  >
                                    {estadosRevision.map((estado) => (
                                      <option
                                        value={String(estado.id)}
                                        key={estado.id}
                                      >
                                        {estado.descripcion}
                                      </option>
                                    ))}
                                  </NativeSelect>
                                </div>
                              </div>
                              {/* Observación */}
                              <div className="rounded-lg border border-dashed bg-muted/10 px-3 py-2.5">
                                <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                                  <span className="shrink-0 text-xs font-medium text-muted-foreground">
                                    Observación:
                                  </span>
                                  <Textarea
                                    className="text-xs text-foreground/80 border border-input rounded px-2 py-1 bg-background w-full"
                                    value={observacion}
                                    onChange={e => handleObservacionChange(doc, e.target.value)}
                                    disabled={isSaving}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Acción */}
                            <div className="flex shrink-0 flex-col justify-end gap-2 lg:min-w-[140px] lg:pt-1">
                              {hasPending ? (
                                <>
                                  <div className="flex items-center justify-end gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                                    <span className="size-1.5 rounded-full bg-amber-500" />
                                    Cambios sin guardar
                                  </div>
                                  <Button
                                    size="sm"
                                    className="w-full rounded-lg"
                                    onClick={() => handleSave(doc)}
                                    disabled={isSaving}
                                  >
                                    {isSaving ? (
                                      <>
                                        <span className="mr-2 size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Guardando...
                                      </>
                                    ) : (
                                      <>
                                        <FileCheck2 className="mr-2 size-4" />
                                        Guardar cambios
                                      </>
                                    )}
                                  </Button>
                                </>
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
            
                </div>
              </div>
            );
          })}
        </CardContent>
      ) : (
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 px-6 py-12 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
              <FileCheck2 className="size-6 text-muted-foreground/50" />
            </div>

            <p className="font-medium text-foreground">
              Todo al día
            </p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No hay documentos pendientes de revisión en este momento.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default RevisionesEstatusItem;