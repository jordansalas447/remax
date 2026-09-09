import type { TableConfig } from "@/lib/crud/types";

export const propiedadPropietarioConfig: TableConfig = {
  name: "propiedad_propietario",
  label: "I ↔ P ↔ C",
  description: "Relación entre inmuebles y propietarios y contratos",
  primaryKey: ["id_propiedad", "id_propietario", "id"],
  fields: [
    {
      name: "id_propiedad",
      label: "Inmueble",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "inmuebles",
        valueField: "id_propiedad",
        labelField: "n_partida",
      },
    },
    {
      name: "id_propietario",
      label: "Propietario",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "propietarios",
        valueField: "id_propietario",
        labelField: "nombre_completo",
      },
    },
    {
      name: "id_contrato",
      label: "Contrato",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "contratos",
        valueField: "id_contrato",
        labelField: "nro_contrato",
      },
    },
    { name: "resumen_operacion", readOnlyOnEdit: true, label: "Resumen Operacion", type: "text", disabled: true },
  ],
};
