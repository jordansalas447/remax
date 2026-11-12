"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Phone } from "lucide-react";
import { DashboardWidget } from "./dashboard-widget";
import {
  getResumenLlamadas,
  type LlamadasRowDetalle,
} from "@/lib/supabase/queries/llamadas";

// Clases completas (Tailwind no genera clases armadas dinámicamente)
const PALETA = [
  { bar: "bg-blue-500", dot: "bg-blue-500" },
  { bar: "bg-emerald-500", dot: "bg-emerald-500" },
  { bar: "bg-amber-500", dot: "bg-amber-500" },
  { bar: "bg-rose-500", dot: "bg-rose-500" },
  { bar: "bg-violet-500", dot: "bg-violet-500" },
  { bar: "bg-teal-500", dot: "bg-teal-500" },
  { bar: "bg-orange-500", dot: "bg-orange-500" },
  { bar: "bg-zinc-400", dot: "bg-zinc-400" },
];

export default function LlamadasWidget() {
  const [llamadas, setLlamadas] = useState<LlamadasRowDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumenLlamadas()
      .then(setLlamadas)
      .catch(() => setLlamadas([]))
      .finally(() => setLoading(false));
  }, []);

  const estados = useMemo(() => {
    const conteo = llamadas.reduce<Record<string, number>>((acc, l) => {
      const estado = String(l.estado_llamada ?? "Sin estado");
      acc[estado] = (acc[estado] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  }, [llamadas]);

  const total = llamadas.length;

  return (
    <DashboardWidget
      title="Llamadas"
      description="Resumen de llamadas a propietarios"
      icon={<Phone className="size-5" />}
    >
      {loading ? (
        <div className="space-y-3" aria-busy="true">
          <div className="h-10 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-2 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ) : total === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-500">Aún no hay llamadas registradas.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">{total}</span>
            <span className="text-sm text-zinc-500">{total === 1 ? "llamada" : "llamadas"} en total</span>
          </div>

          {/* Barra proporcional por estado */}
          <div
            className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
            role="img"
            aria-label={estados.map(([e, n]) => `${e}: ${n}`).join(", ")}
          >
            {estados.map(([estado, n], i) => (
              <div
                key={estado}
                className={PALETA[i % PALETA.length].bar}
                style={{ width: `${(n / total) * 100}%` }}
              />
            ))}
          </div>

          <ul className="space-y-2">
            {estados.map(([estado, n], i) => (
              <li key={estado} className="flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${PALETA[i % PALETA.length].dot}`} aria-hidden />
                <span className="min-w-0 flex-1 truncate">{estado}</span>
                <span className="font-semibold tabular-nums">{n}</span>
                <span className="w-10 text-right text-xs tabular-nums text-zinc-500">
                  {Math.round((n / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>

          <p className="flex items-center justify-end gap-1 text-xs text-zinc-400">
            Ver detalle <ChevronRight className="h-3 w-3" aria-hidden />
          </p>
        </div>
      )}
    </DashboardWidget>
  );
}
