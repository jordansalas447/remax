import type { TableConfig } from "@/lib/crud/types";

export const estados_revisionConfig: TableConfig = {
  name: "estados_revision",
  label: "Estados Revision",
  description: "Estados de revision checklist",
  primaryKey: "id",
  fields: [
    { name: "descripcion", label: "Descripción", type: "text" },
    { name: "color", label: "Color", type: "text" },
  ],
};
