/**
 * Skeleton de la tabla dinámica.
 *
 * Se muestra mientras el Server Component `page.tsx` termina de
 * cargar los datos desde Supabase (fetchTableData).
 *
 * Next.js renderiza este archivo automáticamente a través del
 * mecanismo de `loading.tsx` (parallel route / Suspense boundary).
 */
export default function TableLoading() {
  return (
    <div className="flex h-full flex-col space-y-6 min-h-[400px]">
      {/* Cabecera skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1 sm:px-4">
        <div className="space-y-2">
          <div className="h-7 w-60 sm:w-72 max-w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-40 sm:w-96 max-w-full animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
        <div className="h-9 w-36 sm:w-48 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Tabla skeleton que ocupa todo el espacio */}
      <div className="flex-1 flex overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 min-h-0">
        <div className="flex-1 flex flex-col">
          {/* Thead */}
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex gap-4 w-full">
              {[22, 16, 24, 14, 18].map((width, i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700 flex-1"
                  style={{ minWidth: `${width}%`, flexBasis: `${width}%`, maxWidth: `${width}%` }}
                />
              ))}
            </div>
          </div>

          {/* Filas */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {Array.from({ length: 12 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-4 border-b border-zinc-100 px-4 py-3.5 last:border-0 dark:border-zinc-800/60"
                style={{ animationDelay: `${rowIndex * 60}ms` }}
              >
                {[22, 16, 24, 14, 18].map((width, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800 flex-1"
                    style={{
                      minWidth: `${width}%`,
                      flexBasis: `${width}%`,
                      maxWidth: `${width}%`,
                      animationDelay: `${(rowIndex * 5 + colIndex) * 40}ms`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
