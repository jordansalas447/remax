import type { TableConfig } from "@/lib/crud/types";

export const revisionesConfig: TableConfig = {
  name: "revisiones",
  label: "Revisiones",
  description: "Expediente y checklist general de la ficha",
  form: {
    columns: 2,
    submitLabel: "Guardar Revision",
    cancelLabel: "Cancelar",
  },
  primaryKey: "id_revision",
  fields: [
    { name: "id_revision", label: "ID", type: "number", readOnlyOnEdit: true },
    {
        name: "id_estado_oficina",
        label: "Estado Oficina",
        type: "select",
        foreignKey: {
          table: "estados_revision",
          valueField: "id",
          labelField: "descripcion",
        },
      },
    {
        name: "id_estado_sigi",
        label: "Estado Sigi",
        type: "select",
        foreignKey: {
          table: "estados_revision",
          valueField: "id",
          labelField: "descripcion",
        },
    },
    {
      name: "id_revisor",
      label: "Revisor",
      type: "select",
      foreignKey: {
        table: "administrativos",
        valueField: "id",
        labelField: "nombre_completo",
      },
    },
    { name: "observacion", label: "Observacion", type: "textarea" },
    { name: "fecha_recibido", label: "Fecha Recibido", type: "date" },
    {
        name: "id_revisiones_configuracion",
        label: "Revisiones",
        type: "select",
        foreignKey: {
          table: "configuracion_revisiones",
          valueField: "id_revision",
          labelField: "descripcion",
        },
      },
      {
        name: "id_propietario",
        label: "Propietario",
        type: "select",
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
        foreignKey: {
          table: "contratos",
          valueField: "id_contrato",
          labelField: "nro_contrato",
        },
      },
      {
        name: "id_inmueble",
        label: "Inmueble",
        type: "select",
        foreignKey: {
          table: "inmuebles",
          valueField: "id_propiedad",
          labelField: "n_partida",
        },
      },
      {
        name: "id_propietario_inmueble_contrato",
        label: "Inmueble propietario Contrato",
        type: "select",
        foreignKey: {
          table: "propiedad_propietario",
          valueField: "id",
          labelField: "resumen_operacion",
        },
      },
  ],
  rules: {
    id_estado_sigi: { omit : "create" },
    id_estado_oficina: { omit : "create" },
  },
};
