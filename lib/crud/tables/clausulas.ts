import type { TableConfig } from "@/lib/crud/types";

export const clausulasConfig: TableConfig = {
  name: "clausulas",
  label: "Clausulas",
  description: "Catálogo de Clausulas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "texto", label: "Texto", type: "text", required: true },
    { name: "titulo", label: "Titulo", type: "textarea" },
    { name: "estado", label: "Estado", type: "text" },
  ],
};
