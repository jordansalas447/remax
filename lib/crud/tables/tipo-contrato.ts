import type { TableConfig } from "@/lib/crud/types";

export const tipoContratoConfig: TableConfig = {
  name: "tipo_contrato",
  label: "Tipos de contrato",
  description: "Catálogo de tipos de contrato",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "tipo_contrato", label: "Tipo de contrato", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
