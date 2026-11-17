import type { TableConfig } from "@/lib/crud/types";

export const contratoPropietarioInmuebleConfig: TableConfig = {
  name: "contrato_propietario_inmueble",
  label: "Captaciones New",
  description: "Relación entre inmuebles y propietarios y contratos",
  primaryKey: "id",
  form: {
    title: "Relación Inmueble ↔ Propietario ↔ Contrato",
    description: "Asocia propietarios y contratos a un inmueble.",
    submitLabel: "Guardar y cerrar",
    allowSaveAndContinue: true,
    saveAndContinueLabel: "Guardar y agregar otro Inmueble",
    clearOnSaveAndContinue: ["id_inmueble"],
  },
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_contrato_propietario",
      label: "Contrato Propietario",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "propiedad_propietario",
        valueField: "id",
        labelField: "resumen_operacion",
      },
    },
    {
      name: "id_inmueble",
      label: "Inmuebles",
      type: "inputsearch",
      required: true,
      readOnlyOnEdit: true,
      foreignKey: {
        table: "inmuebles",
        valueField: "id_propiedad",
        labelField: "n_partida",
        sublabelField: "id_remax"
      },
    },
  ]
};
