import type { TableConfig } from "@/lib/crud/types";

export const empresasConfig: TableConfig = {
  name: "empresas",
  label: "Empresas",
  description: "Catálogo de Empresas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "razon_soc", label: "Razon Social", type: "text", required: true },
    { name: "ruc", label: "RUC", type: "text" },
  ]
  
};
