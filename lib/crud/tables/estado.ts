import type { TableConfig } from "@/lib/crud/types";

export const estadoConfig: TableConfig = {
  name: "estado",
  label: "Estados",
  description: "Catálogo de estados de contratos",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "estado", label: "Estado", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
