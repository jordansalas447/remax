import type { TableConfig } from "@/lib/crud/types";

export const distritosConfig: TableConfig = {
  name: "distritos",
  label: "Distritos",
  description: "Catálogo de distritos",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "distrito", label: "Distrito", type: "text", required: true },
  ],
};
