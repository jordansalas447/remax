"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

/**
 * Interfaz mínima con solo los métodos que TablePagination necesita.
 * Esto evita los problemas de varianza con LegacyReactTable<TData>.
 */
interface PaginationTable {
  getState: () => { pagination: { pageIndex: number; pageSize: number } };
  getPageCount: () => number;
  getFilteredRowModel: () => { rows: unknown[] };
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  setPageIndex: (idx: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  setPageSize: (size: number) => void;
}

interface TablePaginationProps {
  table: PaginationTable;
}

export function TablePagination({ table }: TablePaginationProps) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const from = pageCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      {/* Info de registros */}
      <p className="text-sm text-zinc-500">
        {totalRows === 0 ? (
          "Sin registros"
        ) : (
          <>
            Mostrando{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {from}–{to}
            </span>{" "}
            de{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {totalRows}
            </span>{" "}
            registros
          </>
        )}
      </p>

      <div className="flex items-center gap-4">
        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500 whitespace-nowrap">
            Filas por página
          </label>
          <Select
            value={String(pageSize)}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 w-[80px] text-sm"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="Primera página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-[6rem] text-center text-sm text-zinc-600 dark:text-zinc-400">
            {pageCount === 0 ? "—" : `Pág. ${pageIndex + 1} / ${pageCount}`}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            title="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
