import type { TableConfig } from "@/lib/crud/types";

export const tipoMonedaConfig: TableConfig = {
  name: "tipo_moneda",
  label: "Tipos de moneda",
  description: "Catálogo de tipos de moneda",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "tipo_moneda", label: "Moneda", type: "text", required: true },
    { name: "simbolo", label: "Símbolo", type: "text" },
  ],
};
