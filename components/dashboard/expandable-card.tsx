"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExpandableItem {
  id: string;
  /** Título de la sección ampliada */
  title: string;
  /** Vista previa (la card) que se muestra en la cuadrícula */
  preview: ReactNode;
  /** Contenido que reemplaza la cuadrícula al ampliar */
  content: ReactNode;
}

/**
 * Cuadrícula de cards. Al hacer click en una, la vista base se reemplaza por su
 * contenido (sin modal), con botón "Volver" o Escape para regresar.
 */
export function ExpandableGrid({ items }: { items: ExpandableItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((i) => i.id === activeId);

  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  if (active) {
    return (
      <div className="space-y-2">
        <Button variant="ghost" size="sm" onClick={() => setActiveId(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al dashboard
        </Button>
        <section aria-label={active.title}>{active.content}</section>
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          aria-label={`Ampliar ${item.title}`}
          onClick={() => setActiveId(item.id)}
          onKeyDown={(e) => {
            if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setActiveId(item.id);
            }
          }}
          className="cursor-pointer rounded-7xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {item.preview}
        </div>
      ))}
    </section>
  );
}
