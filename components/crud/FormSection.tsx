"use client";

import type { FormColumns, FormLayout } from "@/lib/crud/types";
import type { ReactNode } from "react";

const GRID_CLASS: Record<FormColumns, string> = {
  1: "grid grid-cols-1 gap-4",
  2: "grid grid-cols-1 gap-4 sm:grid-cols-2",
  3: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
};

export function FormSection({
  title,
  description,
  columns = 1,
  layout,
  children,
}: {
  title?: string;
  description?: string;
  columns?: FormColumns;
  layout?: FormLayout;
  children: ReactNode;
}) {
  const useGrid = layout === "grid" || (layout !== "stack" && columns > 1);

  return (
    <section className="space-y-3">
      {(title || description) && (
        <div>
          {title ? (
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{title}</h3>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          ) : null}
        </div>
      )}
      <div className={useGrid ? GRID_CLASS[columns] : "space-y-4"}>{children}</div>
    </section>
  );
}
