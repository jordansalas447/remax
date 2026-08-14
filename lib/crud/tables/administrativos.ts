import type { TableConfig } from "@/lib/crud/types";

export const administrativosConfig: TableConfig = {
  name: "administrativos",
  label: "Administrativos",
  description: "Personal administrativo",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
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
    { name: "cargo", label: "Cargo", type: "text" },
    { name: "area", label: "Área", type: "text" },
    { name: "descripcion", label: "Descripción", type: "text", required: true },
    { name: "snap_nombre", label: "Nombre", type: "text" },
  ],
};
