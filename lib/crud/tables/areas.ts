import type { TableConfig } from "@/lib/crud/types";

export const areasConfig: TableConfig = {
  name: "areas",
  label: "Areas",
  description: "Catálogo de Areas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "area", label: "Area", type: "text", required: true },
  ],
};
