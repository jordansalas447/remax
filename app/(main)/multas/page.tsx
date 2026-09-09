"use client";

import { useEffect, useState } from "react";
import { fechasContratoMulta } from "@/lib/supabase/queries/contratos";
import type { ContratoMulta } from "@/lib/supabase/queries/contratos";
import { calcularDiferenciaDias, calcularDiferenciaDiasSigi } from "@/utils/utils";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

export default function MultasPage() {
  const [data, setData] = useState<ContratoMulta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fechasContratoMulta();
        if (!ignore && res) {
          setData(Array.isArray(res) ? res : [res]);
        }
      } catch (e) {
        if (!ignore) setData([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Multas</h1>
      <div className="overflow-x-auto border rounded bg-white">
        <Table>
          <TableCaption>Contratos recientes con control de multas.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Asesor</TableHead>
              <TableHead>Nro contrato</TableHead>
              <TableHead>Partida</TableHead>
              <TableHead>Fecha recibido</TableHead>
              <TableHead>Desde recibido</TableHead>
              <TableHead>Fecha entregado</TableHead>
              <TableHead>Desde entregado</TableHead>
              <TableHead>Fecha SIGI</TableHead>
              <TableHead>Fecha EST</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No hay datos.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-200">
                    {row?.nombre_completo ?? "-"}
                  </TableCell>
                  <TableCell>{row?.nro_contrato ?? "-"}</TableCell>
                  <TableCell>{row?.n_partida ?? "-"}</TableCell>
                  <TableCell>
                    {row?.fecha_contrato_recibido ?? "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-3 py-1 text-xs font-semibold">
                      {calcularDiferenciaDias(row) ?? 0} Día(s)
                    </span>
                  </TableCell>
                  <TableCell>
                    {row?.fecha_contrato_entregado ?? "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-3 py-1 text-xs font-semibold">
                      {calcularDiferenciaDiasSigi(row) ?? 0} Día(s)
                    </span>
                  </TableCell>
                  <TableCell>
                    {row?.fecha_contrato_sigi ?? "-"}
                  </TableCell>
                  <TableCell>
                    {row?.fecha_est_titulo ?? "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              {/* Pie de tabla opcional. Puedes calcular totales aquí si gustas */}
              <TableCell colSpan={9}>
                {/* Ejemplo: Total contratos: {data.length} */}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}