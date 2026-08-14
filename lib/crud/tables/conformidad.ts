import type { TableConfig } from "@/lib/crud/types";

export const conformidadConfig: TableConfig = {
  name: "conformidad",
  label: "Conformidad",
  description: "Catálogo de tipos de conformidad",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "tipo", label: "Tipo", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
