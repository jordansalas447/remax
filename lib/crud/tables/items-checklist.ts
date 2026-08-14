import type { TableConfig } from "@/lib/crud/types";

export const itemsChecklistConfig: TableConfig = {
  name: "items_checklist",
  label: "Ítems checklist",
  description: "Catálogo de ítems evaluados en revisiones",
  primaryKey: "id_item",
  fields: [
    { name: "id_item", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "nombre_item", label: "Nombre del ítem", type: "text", required: true },
  ],
};
