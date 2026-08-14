import type { TableConfig } from "@/lib/crud/types";

export const propiedadPropietarioConfig: TableConfig = {
  name: "propiedad_propietario",
  label: "Propiedad ↔ Propietario",
  description: "Relación entre inmuebles y propietarios",
  primaryKey: ["id_propiedad", "id_propietario"],
  fields: [
    {
      name: "id_propiedad",
      label: "Propiedad",
      type: "select",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "propiedades",
        valueField: "id_propiedad",
        labelField: "n_partida",
      },
    },
    {
      name: "id_propietario",
      label: "Propietario",
      type: "select",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "propietarios",
        valueField: "id_propietario",
        labelField: "nombres",
      },
    },
  ],
};
