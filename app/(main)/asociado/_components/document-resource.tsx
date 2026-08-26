import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { ContratoDetalle } from "./detail-contract";

interface DocumentResourceProps {
    url: string | undefined
    document?: any // espera un objeto como el mostrado en el prompt
}

export function DocumentResource({ url, document }: DocumentResourceProps) {
    const isImage = url ? /\.(jpg|jpeg|png|gif)$/i.test(url) : false;
    const isPdf = url ? url.endsWith(".pdf") : false;

    // Utilidades para formatear fechas y dinero rápido
    function formatDate(dateStr: string | null) {
        return dateStr ? new Date(dateStr).toLocaleDateString("es-PE") : "—";
    }
    function formatCurrency(value: number | null | undefined, simbolo = "$") {
        if (typeof value !== "number") return "—";
        return simbolo + " " + value.toLocaleString("es-PE");
    }

    return (
        <Dialog>
            <DialogTrigger
                className="absolute right-3 top-3 rounded-full bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                title={url ? "Ver documento" : "Sin documento disponible"}
                disabled={!url}
                style={url ? {} : { opacity: 0.5, cursor: "not-allowed" }}
            >
                <FileText className="size-4" />
            </DialogTrigger>
            <DialogContent className="w-full max-w-5xl sm:max-w-5xl h-[90vh] max-h-[90vh]">
                <DialogHeader>
                    Documento
                </DialogHeader>
                <div className="flex flex-col md:flex-row gap-2 h-[80vh] w-full items-stretch justify-center">
                    <div className="flex-none">
                        <ContratoDetalle data={document} />
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
                                        className="text-indigo-600 underline mt-2 block"
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
    )
}
