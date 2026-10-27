"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { TipoContratoRow } from "@/lib/supabase/queries/tipos_contratos";
import { OperacionesRow } from "@/lib/supabase/queries/operaciones";
import { NativeSelect } from "../ui/native-select";
import { createDocumentos, DocumentosRow } from "@/lib/supabase/queries/documentos";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "cn";
import { toast } from "../ui/toast";
import type { ContratoPDFProps } from "./Contratos/Anticrisis";
import type { Propietario } from "./Contratos/shared/types";
import {
  MESES,
  construirDatosContrato,
  getCamposContrato,
  type CampoTextoContratoKey,
} from "./Contratos/shared/campos";
import CamposContrato, { type DatosContrato } from "./campos-contrato";

interface FormularioProps {
  TipoContratos: TipoContratoRow[]
  TipoOperaciones: OperacionesRow[]
  Asociado: number
  onResultado: (valor: string) => void;
}

const MAX_PROPIETARIOS = 10;

// Pasos del asistente
const PASOS_CONTRATO = [
  { paso: 2, label: "Tipo de contrato" },
  { paso: 3, label: "Datos del contrato" },
] as const;

export default function FormGenerarContrato({
  TipoContratos,
  TipoOperaciones,
  Asociado,
  onResultado
}: FormularioProps) {

  // Estado base inicial del formulario: función para garantizar siempre desde cero
  const getInitialForm = () => ({
    id_tipo_contrato: 0,
    id_asociado: Asociado,
    nro_propietarios: 1,
    empresa: false,
    apoderado: false,
    id_operacion: 0,
  } as DocumentosRow);

  // Controla apertura del modal
  const [open, setOpen] = useState(false);

  // Form fields state
  const [form, setForm] = useState<DocumentosRow>(getInitialForm());

  // Catálogos para selects, mantenidos, pero si quieres limpiarlos también al cerrar el modal puedes incluirlos en el reset
  const [tiposContrato, setTiposContrato] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [asociados, setAsociados] = useState<any[]>([]);
  const [operaciones, setOperaciones] = useState<any[]>([]);

  const [enviando, setEnviando] = useState(false);
  const [nroContrato, setNroContrato] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aceptado, setAceptado] = useState(false); // Estado para la declaración
  const [paso, setPaso] = useState<1 | 2 | 3>(1); // 1: declaración, 2: tipo de contrato, 3: datos del contrato

  // Datos rellenables del contrato (paso 3)
  const [datosContrato, setDatosContrato] = useState<DatosContrato>({});
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);

  // Vista previa del contrato (PDF sin registrar en BD)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cargandoPreview, setCargandoPreview] = useState(false);
  const [errorPreview, setErrorPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const tipoContratoId = Number(form.id_tipo_contrato) || 0;
  const tipoOperacionId = Number(form.id_operacion) || 0;
  const nroPropietarios = Math.min(MAX_PROPIETARIOS, Math.max(1, Number(form.nro_propietarios) || 1));

  // Solo los campos que aplican al contrato seleccionado (lo que se envía a la API)
  const datosExtra = useMemo(
    () =>
      construirDatosContrato(
        tipoOperacionId,
        tipoContratoId,
        datosContrato,
        propietarios,
        nroPropietarios
      ),
    [tipoOperacionId, tipoContratoId, datosContrato, propietarios, nroPropietarios]
  );
  const datosExtraKey = JSON.stringify(datosExtra);

  // Progreso de llenado (solo informativo, los campos no son obligatorios)
  const progreso = useMemo(() => {
    const campos = getCamposContrato(tipoOperacionId, tipoContratoId);
    const llenos = campos.filter((c) => datosContrato[c.key]?.trim()).length;
    return { llenos, total: campos.length };
  }, [tipoOperacionId, tipoContratoId, datosContrato]);

  const tipoContratoLabel = tiposContrato.find((t: any) => Number(t.id) === tipoContratoId)?.tipo_contrato;
  const operacionLabel = operaciones.find((o: any) => Number(o.id) === tipoOperacionId)?.operacion;

  const limpiarPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
    setErrorPreview(null);
    setCargandoPreview(false);
  }, []);

  // Al cargar, se traen los catálogos
  useEffect(() => {
    async function fetchAll() {
      try {
        setTiposContrato(TipoContratos ?? []);
        setOperaciones(TipoOperaciones ?? []);
      } catch (err) {
        setError("Error al cargar catálogos. " + (err as any).message);
      }
    }
    fetchAll();
  }, [TipoContratos, TipoOperaciones]);

  const resetTodo = () => {
    setForm(getInitialForm());
    setAceptado(false);
    setPaso(1);
    setError(null);
    setEnviando(false);
    setNroContrato(null);
    setDatosContrato({});
    setPropietarios([]);
    limpiarPreview();
  };

  // Importante: Al cerrar el modal, resetea absolutamente todo a cero, para que siempre que abras
  // todo esté limpio y desde cero, sin conservar ningún dato anterior
  const handleDialogOpenChange = useCallback((value: boolean) => {
    if (value) {
      // Al abrir, limpia todo desde cero por seguridad
      resetTodo();
    }
    setOpen(value);
    if (!value) {
      // Al cerrar, LIMPIA TODO; empieza realmente desde cero
      resetTodo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Asociado]); // dependemos de Asociado para el form inicial de cada vez

  // Genera la vista previa cada vez que cambian las opciones o los datos (con debounce)
  useEffect(() => {
    if (!open || paso === 1) return;

    if (!tipoContratoId || !tipoOperacionId) {
      limpiarPreview();
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setCargandoPreview(true);
      setErrorPreview(null);
      try {
        const response = await fetch("/api/contratos/generar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...JSON.parse(datosExtraKey),
            preview: true,
            nroPropietarios,
            tipoContrato: tipoContratoId,
            tipoOperacion: tipoOperacionId,
            fecha_generacion: new Date().toISOString(),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error ?? "No se pudo generar la vista previa");
        }

        const blob = await response.blob();
        if (controller.signal.aborted) return;

        const url = URL.createObjectURL(blob);
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setErrorPreview(err?.message ?? "No se pudo generar la vista previa");
      } finally {
        if (!controller.signal.aborted) setCargandoPreview(false);
      }
    }, paso === 3 ? 700 : 400); // al escribir esperamos un poco más para no saturar

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, paso, tipoContratoId, tipoOperacionId, nroPropietarios, datosExtraKey, limpiarPreview]);

  // Libera el blob al desmontar
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  // Maneja cambios en el formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  // Para el checkbox de declaración de uso restringido
  const handleDeclaracionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAceptado(e.target.checked);
  };

  // Paso de declaración a formulario
  const handleSiguiente = () => {
    if (!aceptado) {
      setError("Debes aceptar la Declaración de Uso Restringido de Documentos Contractuales para continuar.");
      return;
    }
    setError(null);
    setPaso(2);
  };

  // Paso de selección de contrato a llenado de datos
  const handleIrADatos = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!tipoContratoId || !tipoOperacionId) {
      setError("Selecciona el tipo de contrato y la operación para continuar.");
      return;
    }
    setError(null);
    setPaso(3);
  };

  const handleDatoChange = (key: CampoTextoContratoKey, value: string) => {
    setDatosContrato((d) => ({ ...d, [key]: value }));
  };

  const handlePropietarioChange = (index: number, key: keyof Propietario, value: string) => {
    setPropietarios((lista) => {
      const copia = [...lista];
      copia[index] = { ...(copia[index] ?? {}), [key]: value };
      return copia;
    });
  };

  const handleUsarFechaHoy = () => {
    const hoy = new Date();
    setDatosContrato((d) => ({
      ...d,
      diaFirma: String(hoy.getDate()),
      mesFirma: MESES[hoy.getMonth()],
      anoFirma: String(hoy.getFullYear()),
    }));
  };

  // Nuevo: manejar cierre programático del modal tras generar documento
  const closeDialog = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {

      //  value={(() => {
      //    // Restar 5 horas a la fecha/hora local actual y formatear para input datetime-local
      //      const date = new Date();
      //      date.setHours(date.getHours() - 5);
      //      return date.toISOString().slice(0, 16);
      //    })()}

      form.fecha_generacion = new Date().toISOString()

      const documento = await createDocumentos(form);

      const nro = documento.nro_contrato;

      const payload: ContratoPDFProps = {
        ...datosExtra,
        nroContrato: nro,
        nroPropietarios,
        tipoContrato: tipoContratoId,
        tipoOperacion: tipoOperacionId,
        fecha_generacion: form.fecha_generacion || undefined,
        id_publico: documento.id_publico || ""
      };

      const response = await fetch("/api/contratos/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.error ?? "No se pudo generar el PDF del contrato"
        );
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `contrato-${nro}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      onResultado(nro);
      setNroContrato(nro);

      setTimeout(() => {
        closeDialog();
        showToast(nro);
      }, 600);
    } catch (err: any) {
      setError(err?.message ?? "Error al generar el contrato");
    } finally {
      setEnviando(false);
    }
  };


  function showToast(NroContrato: string) {
    const id = toast.add({
      title: "Contrato " + NroContrato + " generado exitosamente ",
      description: "Tu descarga debería comenzar automáticamente.",
    })
  }

  return (
    <div className="max-w-lg">
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <div>
          <DialogTrigger render={<Button>Generar Contrato</Button>} />
          <DialogContent
            className={cn(
              "max-h-[90vh] overflow-y-auto",
              paso !== 1 ? "lg:max-w-7xl" : "lg:max-w-[90vh]"
            )}
          >
            {paso === 1 ? (
              <>
                {/* Declaración de Uso Restringido */}
                <div>
                  <div className="text-center mb-4">
                    <span className="  font-bold text-lg block mb-2">
                      DECLARACIÓN DE USO RESTRINGIDO DE DOCUMENTOS CONTRACTUALES
                    </span>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800/40 border dark:border-blue-800 rounded-lg p-4  text-sm">
                    <p className="mb-2">
                      Declaro que el contrato que estoy por descargar ha sido proporcionado para su utilización en el marco de las actividades y operaciones autorizadas por RE/MAX Adelante.
                    </p>
                    <p className="mb-2">
                      Me comprometo a utilizar dicho documento exclusivamente para los fines relacionados con las actividades autorizadas por la empresa, respetando sus políticas internas y las obligaciones de confidencialidad aplicables.
                    </p>
                    <p className="mb-2">
                      Asimismo, me comprometo a no utilizar, reproducir, distribuir, comercializar, modificar ni facilitar el documento para fines ajenos a los autorizados por RE/MAX Adelante, ni a utilizarlo en beneficio de terceros o de otras empresas sin la autorización correspondiente.
                    </p>
                    <p className="mb-2">
                      Declaro conocer que el uso no autorizado del documento podría dar lugar a medidas internas y, cuando corresponda legalmente, a las acciones legales pertinentes.
                    </p>
                    <p>
                      Al aceptar esta declaración, dejo constancia de que he leído y comprendido las condiciones anteriores.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="declaracion_acepto"
                      checked={aceptado}
                      onChange={handleDeclaracionChange}
                      className="w-5 h-5 border-blue-400 rounded"
                      disabled={enviando}
                    />
                    <label htmlFor="declaracion_acepto" className="select-none ">
                      Acepto la Declaración de Uso Restringido de Documentos Contractuales <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {error && (
                    <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-2 mt-2">
                      <span className="font-semibold">Error:</span> {error}
                    </div>
                  )}
                  <div className="flex justify-end mt-6">
                    <Button type="button" variant="outline" onClick={closeDialog}>Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleSiguiente}
                      disabled={!aceptado || enviando}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid gap-4">
                {/* INDICADOR DE PASOS */}
                <ol className="flex flex-wrap items-center gap-2 text-sm" aria-label="Pasos para generar el contrato">
                  {PASOS_CONTRATO.map((p, idx) => (
                    <React.Fragment key={p.paso}>
                      {idx > 0 && <li aria-hidden="true" className="h-px w-8 bg-border" />}
                      <li
                        aria-current={paso === p.paso ? "step" : undefined}
                        className={cn(
                          "flex items-center gap-2 transition-colors",
                          paso === p.paso ? "font-semibold" : "text-muted-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full border text-xs transition-colors",
                            paso >= p.paso && "bg-primary text-primary-foreground border-primary"
                          )}
                        >
                          {paso > p.paso ? "✓" : idx + 1}
                        </span>
                        {p.label}
                      </li>
                    </React.Fragment>
                  ))}
                </ol>

                <div
                  className={cn(
                    "grid gap-6",
                    paso === 3
                      ? "lg:grid-cols-[minmax(340px,440px)_1fr]"
                      : "lg:grid-cols-[minmax(260px,320px)_1fr]"
                  )}
                >
                  <form
                    className="grid gap-6 content-start"
                    onSubmit={paso === 2 ? handleIrADatos : handleSubmit}
                    autoComplete="off"
                  >
                    {paso === 2 ? (
                      <>
                        {/* id_tipo_contrato: SELECT */}
                        <div>
                          <label htmlFor="id_tipo_contrato" className="block mb-2 font-medium ">
                            Tipo de contrato <span className="text-red-500">*</span>
                          </label>
                          <NativeSelect
                            id="id_tipo_contrato"
                            name="id_tipo_contrato"
                            value={form.id_tipo_contrato || 0}
                            onChange={handleChange}
                            required
                            disabled={enviando}
                            className="border  dark:border-zinc-700 px-3 py-2 rounded-lg w-full bg-white dark:bg-zinc-950 focus:border-blue-500 outline-none transition"
                          >
                            <option value="">Selecciona un tipo</option>
                            {tiposContrato.map((tipo: any) => (
                              <option key={tipo.id} value={tipo.id}>
                                {tipo.tipo_contrato}
                              </option>
                            ))}
                          </NativeSelect>
                        </div>

                        <div>
                          <label htmlFor="id_operacion" className="block mb-2 font-medium ">
                            Operación <span className="text-red-500">*</span>
                          </label>
                          <NativeSelect
                            id="id_operacion"
                            name="id_operacion"
                            value={form.id_operacion || 0}
                            onChange={handleChange}
                            required
                            disabled={enviando}
                            className="border  dark:border-zinc-700 px-3 py-2 rounded-lg w-full bg-white dark:bg-zinc-950 focus:border-blue-500 outline-none transition"
                          >
                            <option value="">Selecciona una operación</option>
                            {operaciones.map((op: any) => (
                              <option key={op.id} value={op.id}>
                                {op.operacion}
                              </option>
                            ))}
                          </NativeSelect>
                        </div>

                        {/* nro_propietarios: number */}
                        <div>
                          <label htmlFor="nro_propietarios" className="block mb-2 font-medium ">
                            Nro. de propietarios
                          </label>
                          <input
                            type="number"
                            id="nro_propietarios"
                            name="nro_propietarios"
                            className="border  dark:border-zinc-700 px-3 py-2 rounded-lg w-full focus:border-blue-500 dark:bg-zinc-950 dark:text-zinc-100 outline-none transition"
                            value={form.nro_propietarios || 1}
                            min={1}
                            max={MAX_PROPIETARIOS}
                            onChange={handleChange}
                            disabled={enviando}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Resumen de la selección */}
                        <div className="flex flex-col gap-1 rounded-lg border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/40 px-3 py-2 text-sm">
                          <span className="font-medium">
                            {operacionLabel ?? "Operación"} · {tipoContratoLabel ?? "Tipo"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {progreso.llenos} de {progreso.total} campos del contrato completados.
                            Los campos que dejes vacíos quedarán en blanco en el PDF.
                          </span>
                        </div>

                        <div className="lg:max-h-[55vh] lg:overflow-y-auto lg:pr-2">
                          <CamposContrato
                            tipoOperacion={tipoOperacionId}
                            tipoContrato={tipoContratoId}
                            nroPropietarios={nroPropietarios}
                            datos={datosContrato}
                            propietarios={propietarios}
                            disabled={enviando}
                            onDatoChange={handleDatoChange}
                            onPropietarioChange={handlePropietarioChange}
                            onUsarFechaHoy={handleUsarFechaHoy}
                          />
                        </div>
                      </>
                    )}


                    {/* empresa: checkbox */}
                    {/* <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="empresa"
                    name="empresa"
                    checked={form.empresa || false}
                    onChange={handleChange}
                    className="border  dark:border-zinc-700 rounded focus:ring-blue-500 w-5 h-5 transition"
                    disabled={enviando}
                  />
                  <label htmlFor="empresa" className="font-medium  select-none">
                    ¿Empresa?
                  </label>
                </div> */}

                    {/* apoderado: checkbox */}
                    {/* <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="apoderado"
                    name="apoderado"
                    checked={form.apoderado || false}
                    onChange={handleChange}
                    className="border  dark:border-zinc-700 rounded focus:ring-blue-500 w-5 h-5 transition"
                    disabled={enviando}
                  />
                  <label htmlFor="apoderado" className="font-medium  select-none">
                    ¿Apoderado?
                  </label>
                </div> */}

                    {/* ERROR */}
                    {error && (
                      <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-2 mt-2">
                        <span className="font-semibold">Error:</span> {error}
                      </div>
                    )}
                    {/* SUBMIT */}

                    <div className="flex flex-row gap-2 justify-end border-t-1 py-2">
                      {paso === 2 ? (
                        <>
                          <Button type="button" variant="outline" onClick={closeDialog}>
                            Cancelar
                          </Button>
                          <Button
                            id="btn-siguiente-datos"
                            type="submit"
                            disabled={enviando || !tipoContratoId || !tipoOperacionId}
                          >
                            Siguiente
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            id="btn-atras-tipo"
                            type="button"
                            variant="outline"
                            onClick={() => { setError(null); setPaso(2); }}
                            disabled={enviando}
                          >
                            Atrás
                          </Button>
                          <Button
                            id="btn-generar-descargar"
                            type="submit"
                            disabled={enviando}
                          >
                            {enviando ? (
                              <span className="flex items-center gap-2 justify-center">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                  <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-70" fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Generando...
                              </span>
                            ) : (
                              <span>Generar y Descargar</span>
                            )}
                          </Button>
                        </>
                      )}
                    </div>


                  </form>

                  {/* VISTA PREVIA */}
                  <section aria-label="Vista previa del contrato" className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Vista previa</span>
                      {cargandoPreview && (
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Actualizando...
                        </span>
                      )}
                    </div>
                    <div className="relative h-[60vh] lg:h-[70vh] rounded-lg border dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900 overflow-hidden">
                      {previewUrl ? (
                        <iframe
                          id="preview-contrato"
                          title="Vista previa del contrato"
                          src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH`}
                          className={cn(
                            "w-full h-full transition-opacity",
                            cargandoPreview && "opacity-50"
                          )}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
                          {errorPreview
                            ? errorPreview
                            : cargandoPreview
                              ? "Generando vista previa..."
                              : "Selecciona el tipo de contrato y la operación para ver la vista previa."}
                        </div>
                      )}
                    </div>
                    {previewUrl && errorPreview && (
                      <span className="text-xs text-red-600">{errorPreview}</span>
                    )}
                  </section>
                </div>
              </div>
            )}
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
}