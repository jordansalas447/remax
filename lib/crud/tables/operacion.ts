import type { TableConfig } from "@/lib/crud/types";

export const operacionConfig: TableConfig = {
  name: "operacion",
  label: "Operaciones",
  description: "Catálogo de operaciones inmobiliarias",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "operacion", label: "Operación", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
