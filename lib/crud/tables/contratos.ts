import type { TableConfig } from "@/lib/crud/types";

export const contratosConfig: TableConfig = {
  name: "contratos",
  label: "Contratos",
  description: "Operaciones de venta y alquiler",
  primaryKey: "id_contrato",
  fields: [
    { name: "id_contrato", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "captacion", label: "Captación", type: "date" },
    {
      name: "id_propiedad",
      label: "Propiedad (Nº de partida)",
      type: "select",
      required: true,
      foreignKey: {
        table: "propiedades",
        valueField: "id_propiedad",
        labelField: "n_partida",
      },
    },
    { name: "nro_contrato", label: "Nro Contrato", type: "text" },
    {
      name: "id_asociado",
      label: "Asociado",
      type: "select",
      foreignKey: {
        table: "asociados",
        valueField: "id_asociado",
        labelField: "nombre_completo",
      },
    },
    {
      name: "id_operacion",
      label: "Operación",
      type: "select",
      foreignKey: {
        table: "operacion",
        valueField: "id",
        labelField: "operacion",
      },
    },
    {
      name: "id_tipo_contrato",
      label: "Tipo contrato",
      type: "select",
      foreignKey: {
        table: "tipo_contrato",
        valueField: "id",
        labelField: "tipo_contrato",
      },
    },
    { name: "estado", label: "Estado activo", type: "boolean" },
    { name: "observaciones", label: "Observaciones", type: "textarea" },
    {
      name: "id_conformidad",
      label: "Conformidad",
      type: "select",
      foreignKey: {
        table: "conformidad",
        valueField: "id",
        labelField: "tipo",
      },
    },
    {
      name: "id_estado",
      label: "Estado",
      type: "select",
      foreignKey: {
        table: "estado",
        valueField: "id",
        labelField: "estado",
      },
    },
    {
      name: "id_mes_captacion",
      label: "Mes captación",
      type: "select",
      foreignKey: {
        table: "mes",
        valueField: "id",
        labelField: "mes",
      },
    },
    {
      name: "id_tipo_moneda",
      label: "Tipo moneda",
      type: "select",
      foreignKey: {
        table: "tipo_moneda",
        valueField: "id",
        labelField: "tipo_moneda",
      },
    },
    {
      name: "id_tipo_moneda_comision",
      label: "Tipo moneda comision",
      type: "select",
      foreignKey: {
        table: "tipo_moneda",
        valueField: "id",
        labelField: "tipo_moneda",
      },
    },
    { name: "precio", label: "Precio", type: "number" },
    { name: "precio_operacion", label: "Precio Operacion", type: "number" },
    { name: "comision", label: "Comisión", type: "number" },
    { name: "fecha_inicio", label: "Fecha inicio", type: "date" },
    { name: "fecha_fin", label: "Fecha fin", type: "date" },
    {
      name: "id_mes_vencimiento",
      label: "Mes vencimiento",
      type: "select",
      foreignKey: { table: "mes", valueField: "id", labelField: "mes" },
    },
  ],
};
