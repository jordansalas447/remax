"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@base-ui/react";
import { PlusIcon } from "lucide-react";
import { getItemChecklists } from "@/lib/supabase/queries/item_checklist";
import { Skeleton } from "@/components/ui/skeleton";

type ChecklistItem = {
  id_item: number;
  nombre_item: string;
  operacion_inmobiliaria?: { operacion: string };
  [key: string]: any;
};

interface ButtonAddRevisionProps {
  onAdd: (item: ChecklistItem) => void;
  className?: string;
  hide:boolean;
}

/**
 * Obtiene los ítems desde getItemChecklists y muestra botones para agregar revisiones.
 * Al clickear, llama `onAdd(item)` del padre con el ítem correspondiente.
 * Muestra skeletons mientras carga.
 */
export function ButtonAddRevision({
  onAdd,
  className = "",
  hide
}: ButtonAddRevisionProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const itemChecklistData = await getItemChecklists();
        if (!cancelled) setItems(itemChecklistData ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    // Mostrar 3 skeletons como placeholders
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Array.from({ length: 18 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-9 w-[150px] rounded-lg"
            // altura/clase similar a los botones reales
          />
        ))}
      </div>
    );
  }
  if (!items || items.length === 0) return null;

  if (hide) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Button
          key={item.id_item}
          type="button"
          onClick={() => onAdd(item)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium shadow"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          {item.nombre_item}
          {item.operacion_inmobiliaria?.operacion
            ? ` - ${item.operacion_inmobiliaria.operacion}`
            : null}
        </Button>
      ))}
    </div>
  );
}

export default ButtonAddRevision;