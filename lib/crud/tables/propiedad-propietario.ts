import type { TableConfig } from "@/lib/crud/types";

export const propiedadPropietarioConfig: TableConfig = {
  name: "propiedad_propietario",
  label: "I ↔ P ↔ C",
  description: "Relación entre inmuebles y propietarios y contratos",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_propiedad",
      label: "Inmueble",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "inmuebles",
        valueField: "id_propiedad",
        labelField: "id_remax",
        sublabelField: "n_partida"
      },
    },
    {
      name: "id_propietario",
      label: "Propietario / Representante",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "propietarios",
        valueField: "id_propietario",
        labelField: "nombre_completo"
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
    // { name: "observacion", label: "Observacion", type: "textarea"},
    { name: "resumen_operacion", readOnlyOnEdit: true, label: "Resumen Operacion", type: "text", disabled: true ,hiddenInForm:true },
  ],
  details: [
    {
      name: "Observaciones",
      label: "Observaciones",
      description: "Historial Observaciones",
      table: "historial_observaciones",
      parentKey: "id_inmueble_propietario_contrato",
      /** Campos de propiedad_propietario que se muestran en cada fila del repeater. */
      fields: ["observacion"],
      min: 0,
      addLabel: "Agregar Observacion",
    },
  ],
};
