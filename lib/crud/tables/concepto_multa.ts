import type { TableConfig } from "@/lib/crud/types";

export const concepto_multaConfig: TableConfig = {
  name: "concepto_multa",
  label: "Concepto Multa",
  description: "Catálogo de concepto de multas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "nro", label: "Nro", type: "number" },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
