"use client";

import React, { useEffect, useState } from "react";
// IMPORTA TUS QUERIES REALES DE LOS ENDPOINTS AQUÍ:

import PizZip from "pizzip";
import { getTiposContrato, TipoContratoRow } from "@/lib/supabase/queries/tipos_contratos";
import { getOperaciones, OperacionesRow } from "@/lib/supabase/queries/operaciones";
import { getEstadoDocumentos } from "@/lib/supabase/queries/estados_documento";
import { NativeSelect } from "../ui/native-select";
import { createDocumentos, DocumentosRow } from "@/lib/supabase/queries/documentos";
import RutaDocumento from '@/lib/data/file.json'
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";

interface FormularioProps {
  TipoContratos: TipoContratoRow[]
  TipoOperaciones: OperacionesRow[]
  Asociado: number
  onResultado: (valor: string) => void;
}

export default function FormGenerarContrato({
  TipoContratos,
  TipoOperaciones,
  Asociado,
  onResultado 
}: FormularioProps) {
  // Form fields state
  const [form, setForm] = useState<DocumentosRow>({
    id_tipo_contrato: 0,
    id_asociado: Asociado,
    nro_propietarios: 1,
    empresa: false,
    apoderado: false,
    id_operacion: 0,
  } as DocumentosRow);

  // Catalogos para selects
  const [tiposContrato, setTiposContrato] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [asociados, setAsociados] = useState<any[]>([]);
  const [operaciones, setOperaciones] = useState<any[]>([]);

  const [enviando, setEnviando] = useState(false);
  const [nroContrato, setNroContrato] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aceptado, setAceptado] = useState(false); // Estado para la declaración
  const [paso, setPaso] = useState<1 | 2>(1); // 1: declaración, 2: formulario

  // Pide los datos a los endpoints al cargar
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setEnviando(true);

    try {
      // Genera número de contrato único
      const nro_contrato = await createDocumentos(form);

      const LabelTipoContrato: string = TipoContratos.find(i => i.id == form.id_tipo_contrato)?.tipo_contrato ?? "";
      const LabelOperacion: string = TipoOperaciones.find(i => i.id == form.id_operacion)?.operacion ?? "";
      const LabelPoder: boolean = form.apoderado ?? false;
      const LabelEmpresa: boolean = form.empresa ?? false;
      const NroPropietarios: number = form.nro_propietarios ?? 1;

      // Buscar en RutaDocumento (un array de objetos) el documento que coincide con LabelTipoContrato y LabelOperacion
      const documentoEncontrado = RutaDocumento.find(
        (doc: any) =>
          doc.tipo_contrato === LabelTipoContrato &&
          doc.operacion === LabelOperacion && 
          doc.empresa === LabelEmpresa &&
          doc.apoderado === LabelPoder &&
          doc.propietarios === NroPropietarios
      );

      // Aquí: descarga el archivo y edítalo usando pizzip
      const docUrl = "https://ik.imagekit.io/7lobev0ug/Documentos/CONTRATOS/" + documentoEncontrado?.documento;
      
      // 1. Descargar el archivo docx como ArrayBuffer
      const response = await fetch(docUrl);
      if (!response.ok) {
        throw new Error(`No se pudo descargar la plantilla: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 2. PizZip para manipular el zip (docx)
      // @ts-ignore
      const PizZip = (await import("pizzip")).default;

      let zip;
      try {
        zip = new PizZip(arrayBuffer);
      } catch (zipError) {
        throw new Error("Error al descomprimir el archivo docx.");
      }

      // 3. Editar el docx utilizando PizZip
      // Busca y reemplaza el marcador exacto {{nro_contrato}}
      const documentXml = zip.file("word/document.xml")?.asText();
      if (!documentXml) {
        throw new Error("No se pudo leer el contenido de word/document.xml");
      }

      // Reemplaza todos los marcadores {{nro_contrato}} por el número de contrato generado
      let nuevoXml = documentXml.replace(/\{\{nro_contrato\}\}/g, nro_contrato.nro_contrato);

      // Sobrescribe el xml en el zip
      zip.file("word/document.xml", nuevoXml);

      // 4. Volver a generar el archivo docx (Blob)
      const editedContent = zip.generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // 5. Descargar el archivo en el navegador
      const downloadFile = (blob: Blob, fileName: string) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      downloadFile(
        editedContent,
        documentoEncontrado?.nombre_documento || "No_encontrado"
      );
    
      onResultado(nro_contrato.nro_contrato)
      setNroContrato(nro_contrato.nro_contrato);

    } catch (err: any) {
      setError(err?.message ?? "Error al generar el contrato");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-lg">
      <Dialog>
        <div>
          <DialogTrigger render={<Button variant="outline">Generar Documento</Button>} />
          <DialogContent className="sm:max-w-sm">
            {paso === 1 ? (
              <>
                {/* Declaración de Uso Restringido */}
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <span className="text-blue-800 dark:text-blue-200 font-bold text-lg block mb-2">
                      DECLARACIÓN DE USO RESTRINGIDO DE DOCUMENTOS CONTRACTUALES
                    </span>
                  </div>
                  <div className="bg-blue-50 dark:bg-zinc-800/40 border border-blue-300 dark:border-blue-800 rounded-lg p-4 text-blue-900 dark:text-blue-100 text-sm">
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
                    <label htmlFor="declaracion_acepto" className="select-none text-blue-900 dark:text-blue-100">
                      Acepto la Declaración de Uso Restringido de Documentos Contractuales <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {error && (
                    <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-2 mt-2">
                      <span className="font-semibold">Error:</span> {error}
                    </div>
                  )}
                  <div className="flex justify-end mt-6">
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
              <form className="grid gap-6" onSubmit={handleSubmit} autoComplete="off">
                {/* id_tipo_contrato: SELECT */}
                <div>
                  <label htmlFor="id_tipo_contrato" className="block mb-2 font-medium text-blue-900 dark:text-blue-100">
                    Tipo de contrato <span className="text-red-500">*</span>
                  </label>
                  <NativeSelect
                    id="id_tipo_contrato"
                    name="id_tipo_contrato"
                    value={form.id_tipo_contrato || 0}
                    onChange={handleChange}
                    required
                    disabled={enviando}
                    className="border border-blue-300 dark:border-zinc-700 px-3 py-2 rounded-lg w-full bg-white dark:bg-zinc-950 focus:border-blue-500 outline-none transition"
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
                  <label htmlFor="id_operacion" className="block mb-2 font-medium text-blue-900 dark:text-blue-100">
                    Operación
                  </label>
                  <NativeSelect
                    id="id_operacion"
                    name="id_operacion"
                    value={form.id_operacion || 0}
                    onChange={handleChange}
                    required
                    disabled={enviando}
                    className="border border-blue-300 dark:border-zinc-700 px-3 py-2 rounded-lg w-full bg-white dark:bg-zinc-950 focus:border-blue-500 outline-none transition"
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
                  <label htmlFor="nro_propietarios" className="block mb-2 font-medium text-blue-900 dark:text-blue-100">
                    Nro. de propietarios
                  </label>
                  <input
                    type="number"
                    id="nro_propietarios"
                    name="nro_propietarios"
                    className="border border-blue-300 dark:border-zinc-700 px-3 py-2 rounded-lg w-full focus:border-blue-500 dark:bg-zinc-950 dark:text-zinc-100 outline-none transition"
                    value={form.nro_propietarios || 0}
                    min={1}
                    onChange={handleChange}
                    disabled={enviando}
                  />
                </div>

                {/* empresa: checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="empresa"
                    name="empresa"
                    checked={form.empresa || false}
                    onChange={handleChange}
                    className="border border-blue-300 dark:border-zinc-700 rounded focus:ring-blue-500 w-5 h-5 transition"
                    disabled={enviando}
                  />
                  <label htmlFor="empresa" className="font-medium text-blue-900 dark:text-blue-100 select-none">
                    ¿Empresa?
                  </label>
                </div>

                {/* apoderado: checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="apoderado"
                    name="apoderado"
                    checked={form.apoderado || false}
                    onChange={handleChange}
                    className="border border-blue-300 dark:border-zinc-700 rounded focus:ring-blue-500 w-5 h-5 transition"
                    disabled={enviando}
                  />
                  <label htmlFor="apoderado" className="font-medium text-blue-900 dark:text-blue-100 select-none">
                    ¿Apoderado?
                  </label>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-2 mt-2">
                    <span className="font-semibold">Error:</span> {error}
                  </div>
                )}
                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-800 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-lg font-semibold shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                </button>
              </form>
            )}
          </DialogContent>
          {nroContrato &&
            <div className="mt-8 border-2 border-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl p-6 shadow text-green-900 dark:text-green-100 text-center animate-fade-in">
              <p className="mb-2 text-lg font-semibold">✅ Contrato generado exitosamente</p>
              <p className="mb-1">Número de contrato: <span className="font-bold text-green-700 dark:text-green-300">{nroContrato}</span></p>
              <p className="text-sm text-green-800 dark:text-green-200">Tu descarga debería comenzar automáticamente.<br />Si no, verifica el bloqueador de popups.</p>
            </div>
          }
        </div>
      </Dialog>
    </div>
  );
}