import type { TableConfig } from "@/lib/crud/types";

export const justificacionesConfig: TableConfig = {
  name: "justificaciones",
  label: "justificaciones",
  description: "Catálogo de meses de captación",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "motivo", label: "Motivo", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
