import type { TableConfig } from "@/lib/crud/types";

export const situacionesConfig: TableConfig = {
  name: "situaciones",
  label: "Situaciones",
  description: "Situaciones Propietario",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "descripcion", label: "Descripción", type: "text" },
  ],
};
