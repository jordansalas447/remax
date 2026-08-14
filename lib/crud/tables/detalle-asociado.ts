import type { TableConfig } from "@/lib/crud/types";

export const detalleAsociadoConfig: TableConfig = {
  name: "detalle_asociado",
  label: "Detalle asociado",
  description: "Detalle de la asociación",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_nivel_asociado",
      label: "Nivel asociado",
      type: "select",
      foreignKey: {
        table: "nivel_asociado",
        valueField: "id",
        labelField: "descripcion",
      },
    },
    { name: "fecha_registro", label: "Fecha de registro", type: "date", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
