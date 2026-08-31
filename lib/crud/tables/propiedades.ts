import type { TableConfig } from "@/lib/crud/types";

export const propiedadesConfig: TableConfig = {
  name: "propiedades",
  label: "Propiedades",
  description: "Inmuebles captados",
  primaryKey: "id_propiedad",
  softDelete: {
    enabled: true,
    field: "eliminado",
  },
  form: {
    title: "Gestionar Propiedades",
    description: "Administra los Propiedades disponibles.",
    columns: 2,
    submitLabel: "Guardar Propiedad",
    cancelLabel: "Cancelar",
  },

  fields: [
    { name: "id_propiedad", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "captacion", label: "Captación", type: "date" },
    { name: "direccion", label: "Dirección", type: "text" },
    { name: "n_partida", label: "N° Partida", type: "text" },
    { name: "area_terreno", label: "Área terreno (m²)", type: "number" },
    { name: "area_construida", label: "Área construida (m²)", type: "number" },
    { name: "fotos", label: "Tiene fotos", type: "boolean" },
    { name: "observacion", label: "Observación", type: "textarea" },
    { name: "id_remax", label: "ID REMAX", type: "number" },
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
      name: "id_resource_partida",
      label: "Documento (Partida)",
      type: "select",
      foreignKey: {
        table: "resource",
        valueField: "id_resource",
        labelField: "url_resource",
      },
    },
    {
      name: "id_resource_est_titulo",
      label: "Documento (Est Titulo)",
      type: "select",
      foreignKey: {
        table: "resource",
        valueField: "id_resource",
        labelField: "url_resource",
      },
    },
    {
      name: "id_conformidad",
      label: "Conformidad",
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "conformidad",
        valueField: "id",
        labelField: "tipo",
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
    }
  ],
};
