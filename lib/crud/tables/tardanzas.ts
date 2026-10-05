import type { TableConfig } from "@/lib/crud/types";

export const tardanzasConfig: TableConfig = {
  name: "tardanzas",
  label: "Tardanzas",
  description: "Lista de Tardanzas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "justificada", label: "Descripción", type: "textarea" },
  ],
};
