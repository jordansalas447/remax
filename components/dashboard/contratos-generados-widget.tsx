"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { DashboardWidget, WidgetStat } from "./dashboard-widget";
import {
  getDocumentoss,
  type DocumentosRow,
} from "@/lib/supabase/queries/documentos";

export default function ContratosGeneradosWidget() {
  const [documentos, setDocumentos] = useState<DocumentosRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocumentoss()
      .then((data) => setDocumentos(data.filter((d) => !d.eliminado)))
      .catch(() => setDocumentos([]))
      .finally(() => setLoading(false));
  }, []);

  const hoy = new Date().toLocaleDateString("en-CA");
  const generados = documentos.filter((d) => d.fecha_generacion);
  const generadosHoy = generados.filter((d) =>
    d.fecha_generacion?.startsWith(hoy),
  );

  return (
    <DashboardWidget
      title="Contratos generados"
      description="Contratos emitidos en el sistema"
      icon={<FileText className="size-5" />}
    >
      {loading ? (
        <p className="text-sm text-zinc-500">Cargando...</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <WidgetStat label="Generados" value={generados.length} />
            <WidgetStat label="Generados hoy" value={generadosHoy.length} />
          </div>
        </div>
      )}
    </DashboardWidget>
  );
}

