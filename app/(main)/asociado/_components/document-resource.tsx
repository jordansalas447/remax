import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Check, FileText } from "lucide-react";
import { ContratoDetalle } from "./detail-contract";
import { PropiedadDetalle } from "./detail-property";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { PropietarioDetalle } from "./detail-owner";
import { getVistaRevisiones } from "@/lib/supabase/queries/revisiones";
import RevisionesEstatusItem from "./propiedad-estatus-item";

interface DocumentResourceProps {
    url: string | undefined;
    document?: any; // espera un objeto como el mostrado en el prompt
    type: string;
    CheckRevision: any[];
}

function isSupportedImage(url: string) {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
}
function isSupportedPdf(url: string) {
    return url.endsWith(".pdf");
}


export function DocumentResource({ url, document, type, CheckRevision }: DocumentResourceProps) {
    // Utilidades para formatear fechas y dinero rápido
    // Guardar la respuesta de la promesa en una variable de estado React
    function formatDate(dateStr: string | null) {
        return dateStr ? new Date(dateStr).toLocaleDateString("es-PE") : "—";
    }
    function formatCurrency(value: number | null | undefined, simbolo = "$") {
        if (typeof value !== "number") return "—";
        return simbolo + " " + value.toLocaleString("es-PE");
    }

    if (type === "propiedad") {
        // Para propiedad, accede a los dos recursos si existen
        const partida = document?.id_resource_partida;
        const estTitulo = document?.id_resource_est_titulo;

        const getDocViewer = (doc: any) => {
            const docUrl = doc?.url_resource;
            if (!docUrl) {
                return (
                    <div className="text-zinc-400">Sin documento adjunto.</div>
                );
            }
            if (isSupportedImage(docUrl)) {
                return (
                    <img
                        src={docUrl}
                        alt={`Documento de propiedad`}
                        className="max-w-full max-h-[80vh] object-contain rounded-md mx-auto"
                    />
                );
            }
            if (isSupportedPdf(docUrl)) {
                return (
                    <iframe
                        src={docUrl}
                        title="Documento de propiedad"
                        className="w-full h-[80vh] rounded-md"
                    />
                );
            }
            return (
                <div className="text-center">
                    <p>No se puede mostrar el documento (formato no compatible).</p>
                    <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mt-2 block"
                    >
                        Descargar documento
                    </a>
                </div>
            );
        };

        const hasPartida = !!partida?.url_resource;
        const hasTitulo = !!estTitulo?.url_resource;

        const initialTab = hasTitulo ? "titulo" : hasPartida ? "partida" : "none";

        return (
            <Dialog>
                <DialogTrigger
                    className="right-3 top-3 rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 align-middle"
                    title={hasPartida || hasTitulo ? "Ver documentos" : "Sin documento disponible"}
                    disabled={!hasPartida && !hasTitulo}
                    style={hasPartida || hasTitulo ? {} : { opacity: 0.5, cursor: "not-allowed" }}
                >
                    <FileText className="size-4" />
                </DialogTrigger>
                <DialogContent className="w-full max-w-5xl sm:max-w-5xl h-[98vh] max-h-[98vh]">
                    {/* <DialogHeader>
                        Documentos de propiedad
                    </DialogHeader> */}
                    <div className="flex flex-col md:flex-row gap-1 h-[80vh] w-full items-stretch justify-center">
                        <div className="flex-none">
                            <PropiedadDetalle data={document} />
                            <RevisionesEstatusItem revisiones={CheckRevision ? CheckRevision : []} loading={false} />
                            {/* Nuevo componente que imprime la respuesta de CheckRevision */}
                        </div>
                        <div className="flex-1 flex flex-col items-stretch min-w-0">
                            {(hasPartida || hasTitulo) ? (
                                <Tabs defaultValue={initialTab} className="h-full flex-1 min-h-0 w-full">
                                    <TabsList className="mb-3 w-full">
                                        {hasTitulo && (
                                            <TabsTrigger value="titulo" className="flex-1 truncate">
                                                Estudio de título
                                            </TabsTrigger>
                                        )}
                                        {hasPartida && (
                                            <TabsTrigger value="partida" className="flex-1 truncate">
                                                Partida registral
                                            </TabsTrigger>
                                        )}
                                    </TabsList>
                                    {hasTitulo && (
                                        <TabsContent value="titulo" className="h-[calc(80vh-2.5rem)] w-full">
                                            {getDocViewer(estTitulo)}
                                        </TabsContent>
                                    )}
                                    {hasPartida && (
                                        <TabsContent value="partida" className="h-[calc(80vh-2.5rem)] w-full">
                                            {getDocViewer(partida)}
                                        </TabsContent>
                                    )}
                                </Tabs>
                            ) : (
                                <div className="text-zinc-400 flex items-center justify-center h-full">
                                    Sin documentos adjuntos.
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>

            </Dialog>
        );
    }

    // Agrega soporte para propietario
    if (type === "propietario") {
        // El recurso/documento principal está en document?.id_resource (siguiendo convención de los otros)
        const doc = document?.personas.id_resource;
        const hasDoc = !!doc?.url_resource;

        const getDocViewer = (doc: any) => {
            const docUrl = doc?.url_resource;
            if (!docUrl) {
                return (
                    <div className="text-zinc-400">Sin documento adjunto.</div>
                );
            }
            if (isSupportedImage(docUrl)) {
                return (
                    <img
                        src={docUrl}
                        alt={`Documento del propietario`}
                        className="max-w-full max-h-[80vh] object-contain rounded-md mx-auto"
                    />
                );
            }
            if (isSupportedPdf(docUrl)) {
                return (
                    <iframe
                        src={docUrl}
                        title="Documento del propietario"
                        className="w-full h-[80vh] rounded-md"
                    />
                );
            }
            return (
                <div className="text-center">
                    <p>No se puede mostrar el documento (formato no compatible).</p>
                    <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mt-2 block"
                    >
                        Descargar documento
                    </a>
                </div>
            );
        };

        return (
            <Dialog>
                <DialogTrigger
                    className="right-3 top-3 rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 align-middle"
                    title={hasDoc ? "Ver documento" : "Sin documento disponible"}
                    disabled={!hasDoc}
                    style={hasDoc ? {} : { opacity: 0.5, cursor: "not-allowed" }}
                >
                    <FileText className="size-4" />
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl sm:max-w-4xl h-[95vh] max-h-[95vh]">
                    <div className="flex flex-col md:flex-row gap-2 h-[80vh] w-full items-stretch justify-center">
                        <div className="flex-none">
                            <PropietarioDetalle data={document} />
                        <div className="mb-2">
                            <RevisionesEstatusItem revisiones={CheckRevision ? CheckRevision : []} loading={false} />
                        </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center min-w-0">
                            {hasDoc ? (
                                getDocViewer(doc)
                            ) : (
                                <div className="text-zinc-400 flex items-center justify-center h-full">
                                    Sin documento adjunto.
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Si es otro tipo usa la lógica anterior
    const isImage = url ? isSupportedImage(url) : false;
    const isPdf = url ? isSupportedPdf(url) : false;

    return (
        <Dialog>
            <DialogTrigger
                className="right-3 top-3 rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 align-middle"
                title={url ? "Ver documento" : "Sin documento disponible"}
                disabled={!url}
                style={url ? {} : { opacity: 0.5, cursor: "not-allowed" }}
            >
                <FileText className="size-4" />
            </DialogTrigger>
            <DialogContent className="w-full max-w-5xl sm:max-w-5xl h-[98vh] max-h-[98vh]">
                <div className="flex flex-col md:flex-row gap-2 h-[80vh] w-full items-stretch justify-center">
                    <div className="flex-none">
                        {type === "contrato" ? (
                            <ContratoDetalle data={document} />

                        ) : type === "propietario" ? (
                            <PropietarioDetalle data={document} />
                        ) : (
                            <PropiedadDetalle data={document} />
                        )}
                        <div className="mb-2">
                            <RevisionesEstatusItem revisiones={CheckRevision ? CheckRevision : []} loading={false} />
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center min-w-0">
                        {url ? (
                            isImage ? (
                                <img
                                    src={url}
                                    alt={`Documento del contrato${document ? ` ${document.nro_contrato ?? ''}` : ''}`}
                                    className="max-w-full max-h-[80vh] object-contain rounded-md mx-auto"
                                />
                            ) : isPdf ? (
                                <iframe
                                    src={url}
                                    title={`Documento del contrato${document ? ` ${document.nro_contrato ?? ''}` : ''}`}
                                    className="w-full h-[80vh] rounded-md"
                                />
                            ) : (
                                <div className="text-center">
                                    <p>No se puede mostrar el documento (formato no compatible).</p>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline mt-2 block"
                                    >
                                        Descargar documento
                                    </a>
                                </div>
                            )
                        ) : (
                            <div className="text-zinc-400">Sin documento adjunto.</div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
