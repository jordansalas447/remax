"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface ExpandableCardProps {
  /** Título accesible del panel ampliado */
  title: string;
  /** Vista previa (la card) que se muestra en la cuadrícula */
  preview: ReactNode;
  /** Contenido que se muestra al ampliar la card */
  children: ReactNode;
}

/** Card que al hacer click se amplía en un panel, con botón (X) y Escape para cerrarlo. */
export function ExpandableCard({ title, preview, children }: ExpandableCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`Ampliar ${title}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="cursor-pointer rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {preview}
      </div>

      <Dialog open={open} onOpenChange={setOpen} preventOutsideClose={false}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-6xl">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">Vista ampliada de {title}</DialogDescription>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

