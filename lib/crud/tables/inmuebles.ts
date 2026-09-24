import type { TableConfig } from "@/lib/crud/types";

export const inmueblesConfig: TableConfig = {
  name: "inmuebles",
  label: "inmuebles",
  description: "Inmuebles disponibles",
  primaryKey: "id_propiedad",
  softDelete: {
    enabled: true,
    field: "eliminado",
  },
  form: {
    title: "Gestionar Inmuebles",
    description: "Administra los Inmuebles disponibles.",
    columns: 2,
    submitLabel: "Guardar Inmueble",
    cancelLabel: "Cancelar",
  },

  fields: [
    { name: "id_propiedad", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_inmueble",
      label: "Inmueble",
      type: "inputsearch",
      selectplus: false,
      foreignKey: {
        table: "inmuebles",
        valueField: "id_propiedad",
        labelField: "n_partida",
        sublabelField: "id_remax"
      },
    },
    // { name: "captacion", label: "Captación", type: "date" },
    { name: "id_remax", label: "ID REMAX", type: "number", required: true },
    { name: "n_partida", label: "N° Partida", type: "text", required: true },
    { name: "constancia", label: "Constancia", type: "text" },
    {
      name: "id_mes_captacion",
      label: "Mes Captacion",
      required: true,
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "mes",
        valueField: "id",
        labelField: "mes",
      },
    },
    { name: "direccion", label: "Dirección", type: "text" },
    { name: "area_terreno", label: "Área terreno (m²)", type: "number" },
    { name: "area_construida", label: "Área construida (m²)", type: "number" },
    { name: "fecha_est_titulo", label: "Fecha Estudio Titulo", type: "datenative" },
    {
      name: "id_tipo_propiedad",
      label: "Tipo de propiedad",
      type: "select",
      foreignKey: {
        table: "tipo_propiedad",
        valueField: "id",
        labelField: "tipo_propiedad",
      },
    },
    {
      name: "id_distrito",
      label: "Distrito",
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "distritos",
        valueField: "id",
        labelField: "distrito",
      },
    },
    // { name: "fotos", label: "Tiene fotos", type: "boolean" },
    { name: "descripcion", label: "Descripción", type: "text" },
    { name: "observacion", label: "Observación", type: "textarea" },

    // {
    //   name: "id_resource_partida",
    //   label: "Documento (Partida)",
    //   type: "select",
    //   foreignKey: {
    //     table: "resource",
    //     valueField: "id_resource",
    //     labelField: "url_resource",
    //   },
    // },
    // {
    //   name: "id_resource_est_titulo",
    //   label: "Documento (Est Titulo)",
    //   type: "select",
    //   foreignKey: {
    //     table: "resource",
    //     valueField: "id_resource",
    //     labelField: "url_resource",
    //   },
    // },

  ],
};
