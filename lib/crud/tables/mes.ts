import type { TableConfig } from "@/lib/crud/types";

export const mesConfig: TableConfig = {
  name: "mes",
  label: "Mes",
  description: "Catálogo de meses de captación",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "mes", label: "Mes", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
