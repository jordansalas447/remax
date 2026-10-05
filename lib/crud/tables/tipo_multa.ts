import type { TableConfig } from "@/lib/crud/types";

export const tipo_multaConfig: TableConfig = {
  name: "tardanzas",
  label: "Tipo Multa",
  description: "Lista de Tardanzas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "concepto_de_la_multa", label: "Concepto de la multa", type: "textarea" },
    { name: "monto", label: "Monto", type: "number" },
    { name: "aviso", label: "Aviso", type: "text" },
    { name: "descripcion", label: "Descripcion", type: "text" },
  ],
};
