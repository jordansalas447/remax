import type { TableConfig } from "@/lib/crud/types";

export const tipo_multaConfig: TableConfig = {
  name: "tardanzas",
  label: "Tipo Multa",
  description: "Lista de Tardanzas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    {
        name: "id_concepto_multa",
        label: "Concepto de la Multa",
        type: "inputsearch",
        foreignKey: {
          table: "concepto_multa",
          valueField: "id",
          labelField: "descripcion",
          sublabelField: "nro"
        },
    },
    {
        name: "aviso",
        label: "Aviso",
        type: "enum",
        options: [
          { value: "1er. Aviso", label: "1er. Aviso" },
          { value: "2do. Aviso", label: "2do. Aviso" },
          { value: "Falta Grave", label: "Falta Grave" }
        ],
    },
    { name: "monto", label: "Monto", type: "number" },
    { name: "descripcion", label: "Descripcion", type: "text" },
  ],
};
