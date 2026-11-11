"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { DashboardWidget, WidgetStat } from "./dashboard-widget";
import {
  getResumenLlamadas,
  type LlamadasRowDetalle,
} from "@/lib/supabase/queries/llamadas";

export default function LlamadasWidget() {
  const [llamadas, setLlamadas] = useState<LlamadasRowDetalle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumenLlamadas()
      .then(setLlamadas)
      .catch(() => setLlamadas([]))
      .finally(() => setLoading(false));
  }, []);

  const porEstado = llamadas.reduce<Record<string, number>>((acc, l) => {
    const estado = String(l.estado_llamada ?? "Sin estado");
    acc[estado] = (acc[estado] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardWidget
      title="Llamadas"
      description="Resumen de llamadas a propietarios"
      icon={<Phone className="size-5" />}
    >
      {loading ? (
        <p className="text-sm text-zinc-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <WidgetStat label="Total" value={llamadas.length} />
          {Object.entries(porEstado).map(([estado, total]) => (
            <WidgetStat key={estado} label={estado} value={total} />
          ))}
        </div>
      )}
    </DashboardWidget>
  );
}

