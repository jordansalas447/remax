"use client";

import { useEffect, useState } from "react";
import { FileCheck2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropiedadPropietarioDetalle } from "@/lib/supabase/queries/propiedad_propietarios";


type DocumentsCheckProps = {
    revisiones: PropiedadPropietarioDetalle[];
    loading: boolean;
    propiedadId?: number | null;
};

export function ContratoEstatus({ revisiones, loading }: DocumentsCheckProps) {

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


    // Aplanar los items checklist para mostrar como documentos pendientes o revisar
    const allDocuments = revisiones.flatMap((prop) =>
        prop.revisiones.map((item) => ({
            id: item.id_revision,
            descripcion: item.items_checklist?.nombre_item || "-",
            oficina: item.estado_oficina?.descripcion || "-",
            oficina_color: item.estado_oficina?.color || "#fde68a",
            sigi: item.estado_sigi?.descripcion || "-",
            sigi_color: item.estado_sigi?.color || "#fde68a",
        }))
    );

    function getStatusStyles(descripcion: string, color?: string) {
        if (descripcion === "-") {
            return "bg-yellow-100 text-yellow-800 border border-yellow-200";
        }
        // Si hay color definido (hex u otro formato tailwind compatible)
        return color
            ? `border px-2 py-0.5 text-xs font-semibold`
            : "bg-zinc-100 text-zinc-800";
    }

    function getStatusInlineStyle(color?: string) {
        // Si viene color hex, úsalo como fondo y busca un color adecuado para la fuente
        if (!color) return undefined;
        // Texto oscuro si fondo claro, texto blanco si fondo oscuro
        let textColor = "#111";
        // Simple darkness check (luma, asumimos #RRGGBB)
        if (color.startsWith("#") && color.length === 7) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            textColor = luma < 180 ? "#fff" : "#111";
        }
        return { backgroundColor: color, color: textColor, border: `1px solid ${color}` };
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileCheck2 className="size-5 text-indigo-600" />
                    Contrato
                </CardTitle>
                <CardDescription>
                    {allDocuments.length > 0
                        ? `${allDocuments.length} item${allDocuments.length > 1 ? "s" : ""}.`
                        : "No hay documentos para revisar por ahora."}
                </CardDescription>
            </CardHeader>
            {allDocuments.length > 0 && (
                <CardContent className="grid gap-4 md:grid-cols-5">
                    {allDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            className="group rounded-xl border border-zinc-200 bg-white/75 p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
                        >
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-zinc-900 dark:text-zinc-50">
                                        {doc.descripcion}
                                    </p>
                                    <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                                        ID #{doc.id}
                                    </p>
                                </div>
                            </div>

                            <dl className="flex flex-col gap-2.5 text-xs">
                                <div className="flex items-center justify-between">
                                    <dt className="font-medium text-zinc-500 dark:text-zinc-400">Oficina</dt>
                                    <dd
                                        className={`rounded-full px-2.5 py-0.5 font-medium border ${getStatusStyles(doc.oficina, doc.oficina_color)}`}
                                        style={doc.oficina_color && doc.oficina !== "-" ? getStatusInlineStyle(doc.oficina_color) : undefined}
                                    >
                                        {doc.oficina}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="font-medium text-zinc-500 dark:text-zinc-400">Sigi</dt>
                                    <dd
                                        className={`rounded-full px-2.5 py-0.5 font-medium border ${getStatusStyles(doc.sigi, doc.sigi_color)}`}
                                        style={doc.sigi_color && doc.sigi !== "-" ? getStatusInlineStyle(doc.sigi_color) : undefined}
                                    >
                                        {doc.sigi}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    ))}
                </CardContent>
            )}
        </Card>
    );
}

export default ContratoEstatus;