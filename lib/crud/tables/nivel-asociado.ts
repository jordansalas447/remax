import type { TableConfig } from "@/lib/crud/types";

export const nivelAsociadoConfig: TableConfig = {
  name: "nivel_asociado",
  label: "Nivel asociado",
  description: "Niveles del asociado",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "descripcion", label: "Descripción", type: "text", required: true },
  ],
};
