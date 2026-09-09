"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRevisionesDetalleByInmueblesContratosPropietarios, PropiedadInmueblePropietarioContrato } from "@/lib/supabase/queries/propiedad_propietarios";
import ButtonAddRevision from "../asociado/_components/button-add-revision";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/**
 * Página de revisiones: muestra la tabla de revisiones usando getRevisionesDetalleByContratoVista
 * Las columnas corresponden a la consulta indicada por el usuario.
 */

export default function RevisionesPage() {
  // Cambiamos el tipo a RevisionDocumentoDetalle[]
  const [revisiones, setRevisiones] = useState<PropiedadInmueblePropietarioContrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(null);
  const [selectedRevision, setSelectedRevision] = useState<PropiedadInmueblePropietarioContrato | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    (async () => {
      try {
        // Usar la vista que entrega la info normalizada de revisiones
        const result = await getRevisionesDetalleByInmueblesContratosPropietarios();

        if (!ignore) setRevisiones(result ?? []);
      } catch (e) {
        if (!ignore) setRevisiones([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // Maneja la selección de una fila en la tabla
  const handleRowClick = (rev: PropiedadInmueblePropietarioContrato) => {
    setSelectedRevisionId(rev.id ?? null);
    setSelectedRevision(rev ?? null);
  };

  // Se deshabilitará el botón si no hay una fila seleccionada
  const isButtonAddEnabled = selectedRevisionId !== null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Revisiones</h1>
      <Card>
        <CardHeader>
          <CardTitle>Panel de revisiones</CardTitle>
        </CardHeader>
        <CardContent>
          <ButtonAddRevision
            hide={!isButtonAddEnabled}
            // Puedes personalizar lo que quieres pasarle al onAdd según tu lógica (por ejemplo, pasar el id seleccionado)
            onAdd={function (item: { [key: string]: any; id_item: number; nombre_item: string; operacion_inmobiliaria?: { operacion: string; }; }): void {
              if (!selectedRevision) return;
              // Aquí puedes lanzar una función para manejar el agregado con la info seleccionada
              // Por ejemplo, abrir un modal, etc.
              // throw new Error("Función de agregar revisión aún no implementada.");
              alert(
                `Agregar revisión para registro ID ${selectedRevision.id}`
              );
            }}
          />
          <Table>
            <TableCaption>Listado de revisiones recientes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Inmueble</TableHead>
                <TableHead>Propietario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {Array.from({ length: 11 }).map((_, tdx) => (
                      <TableCell key={tdx}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : revisiones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-zinc-500">
                    No hay revisiones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                revisiones.map((rev, idx) => (
                  <TableRow
                    key={rev.id || idx}
                    onClick={() => handleRowClick(rev)}
                    className={selectedRevisionId === rev.id ? "bg-blue-100 dark:bg-blue-900 cursor-pointer" : "cursor-pointer"}
                    style={{ transition: 'background 0.2s' }}
                  >
                    <TableCell>{rev.id}</TableCell>
                    <TableCell>
                      {rev.contrato?.nro_contrato ?? "-"}
                    </TableCell>
                    <TableCell>
                      {rev.propietarios?.nombre_completo ?? "-"}
                    </TableCell>
                    <TableCell>
                      {rev.inmueble?.n_partida ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {selectedRevisionId !== null && (
            <div className="mt-3 text-sm text-blue-700 dark:text-blue-200">
              Registro seleccionado: ID {selectedRevisionId}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}