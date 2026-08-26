// Mini-card de detalle del contrato
export function ContratoDetalle({ data }: { data: any }) {
    // Utilidad para formatear fechas
    function formatDate(dateStr: string | null) {
        return dateStr ? new Date(dateStr).toLocaleDateString("es-PE") : "—";
    }
    // Utilidad para formatear moneda
    function formatCurrency(value: number | null | undefined, simbolo = "$") {
        if (typeof value !== "number") return "—";
        return simbolo + " " + value.toLocaleString("es-PE");
    }

    if (!data) return null;
    return (
        <div className="flex flex-col gap-2 text-sm w-[340px] border rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50 dark:border-zinc-800 font-normal">
            <div>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Contrato</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">#{data.id_contrato} – {data.nro_contrato}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Tipo:&nbsp;</span>
                <span>{data.tipo_contrato?.tipo_contrato ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Operación:&nbsp;</span>
                <span>{data.operacion?.operacion ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Precio:&nbsp;</span>
                <span>{formatCurrency(data.precio, data.tipo_moneda?.simbolo)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Precio Final:&nbsp;</span>
                <span>{formatCurrency(data.precio_operacion, data.tipo_moneda?.simbolo)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Comisión:&nbsp;</span>
                <span>{formatCurrency(data.comision, data.tipo_moneda_comision?.simbolo)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Fechas:&nbsp;</span>
                <span>{formatDate(data.fecha_inicio)} — {formatDate(data.fecha_fin)}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Propiedad:&nbsp;</span>
                <span>
                    {data.propiedades?.tipo_propiedad?.tipo_propiedad ? data.propiedades.tipo_propiedad.tipo_propiedad + " " : ""}
                    {data.propiedades?.direccion ?? ""} 
                </span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Ubicación:&nbsp;</span>
                <span>{data.propiedades?.distritos?.distrito ?? "—"}</span>
            </div>
            <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Partida Registral:&nbsp;</span>
                <span>{data.propiedades?.n_partida ?? "—"}</span>
            </div>
        </div>
    );
}
