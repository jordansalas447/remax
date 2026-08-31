// Mini-card de detalle de la propiedad
export function PropiedadDetalle({ data }: { data: any }) {
    // Utilidad para formatear fechas
    function formatDate(dateStr: string | null) {
        return dateStr ? new Date(dateStr).toLocaleDateString("es-PE") : "—";
    }
    // Utilidad para formatear números (área, id, etc.)
    function formatNumber(value: number | null | undefined) {
        if (typeof value !== "number" || isNaN(value)) return "—";
        return value.toLocaleString("es-PE");
    }

    if (!data) return null;
    return (
        <div className="flex flex-col gap-2 text-sm w-[340px] border bg-zinc-50 p-4 dark:bg-zinc-900/50 dark:border-zinc-800 font-normal">
            <div>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Propiedad</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">#{data.id_propiedad ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Tipo:&nbsp;</span>
                <span>{data.tipo_propiedad?.tipo_propiedad ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Dirección:&nbsp;</span>
                <span>{data.direccion ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Partida Registral:&nbsp;</span>
                <span>{data.n_partida ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Área Terreno (m²):&nbsp;</span>
                <span>{formatNumber(data.area_terreno)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Área Construida (m²):&nbsp;</span>
                <span>{formatNumber(data.area_construida)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Id Remax:&nbsp;</span>
                <span>{data.id_remax ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Captación:&nbsp;</span>
                <span>{formatDate(data.captacion ?? null)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Observación:&nbsp;</span>
                <span>{data.observacion ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Fotos cargadas:&nbsp;</span>
                <span>{data.fotos ? "Sí" : "No"}</span>
            </div>
        </div>
    );
}
