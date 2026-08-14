import type { TableConfig } from "@/lib/crud/types";

export const asociadosConfig: TableConfig = {
  name: "asociados",
  label: "Asociados",
  description: "Asociados y su detalle",
  primaryKey: "id_asociado",
  fields: [
    { name: "id_asociado", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_persona",
      label: "Persona",
      type: "select",
      foreignKey: {
        table: "personas",
        valueField: "id",
        labelField: "nombre",
      },
    },
    {
      name: "id_detalle_asociado",
      label: "Detalle asociado",
      type: "select",
      foreignKey: {
        table: "detalle_asociado",
        valueField: "id",
        labelField: "descripcion",
      },
    },
    { name: "descripcion", label: "Descripción", type: "textarea" },
    { name: "snap_asociado", label: "Snap asociado", type: "text", required: true },
  ],
};
