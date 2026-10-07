import type { TableConfig } from "@/lib/crud/types";

export const estado_documentoConfig: TableConfig = {
  name: "estados_revision",
  label: "Estados Documento",
  description: "Estados de revision checklist",
  primaryKey: "id",
  fields: [
    { name: "estado", label: "Estado", type: "text" },
  ],
};
