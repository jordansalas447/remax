import type { TableConfig } from "@/lib/crud/types";

export const propiedadPropietarioConfig: TableConfig = {
  name: "propiedad_propietario",
  label: "Propiedad ↔ Propietario",
  description: "Relación entre inmuebles y propietarios",
  primaryKey: ["id_propiedad", "id_propietario","id"],
  fields: [
    {
      name: "id_propiedad",
      label: "Propiedad",
      type: "select",
      required: true,
      readOnlyOnEdit: false,
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
      readOnlyOnEdit: false,
      foreignKey: {
        table: "propietarios",
        valueField: "id_propietario",
        labelField: "nombre_completo",
      },
    },
    {
      name: "id_contrato",
      label: "Contrato",
      type: "select",
      required: true,
      readOnlyOnEdit: false,
      foreignKey: {
        table: "contratos",
        valueField: "id_contrato",
        labelField: "nro_contrato",
      },
    },
  ],
};
