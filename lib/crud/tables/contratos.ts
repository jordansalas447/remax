import type { TableConfig } from "@/lib/crud/types";

export const contratosConfig: TableConfig = {
  name: "contratos",
  label: "Contratos",
  description: "Operaciones de venta y alquiler",
  primaryKey: "id_contrato",
  form: {
    title: "Gestionar Contratos",
    description: "Administra los Contratos disponibles.",
    columns: 3,
    submitLabel: "Guardar Contrato",
    cancelLabel: "Cancelar",
  },
  fields: [
    { name: "id_contrato", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_renovacion_contrato",
      label: "Contrato (Renovación)",
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "contratos",
        valueField: "id_contrato",
        labelField: "nro_contrato"
      },
    },
    {
      name: "id_propiedad",
      label: "Propiedad (ID Remax)",
      type: "inputsearch",
      required: true,
      foreignKey: {
        table: "inmuebles",
        valueField: "id_propiedad",
        labelField: "id_remax",
        sublabelField: "n_partida"
      },
    },
    { name: "nro_contrato", label: "Nro Contrato", type: "text", disabled: true },
    {
      name: "id_asociado",
      label: "Asociado",
      required: true,
      type: "inputsearch",
      foreignKey: {
        table: "asociados",
        valueField: "id_asociado",
        labelField: "nombre_completo",
      },
    },
    {
      name: "id_operacion",
      label: "Operación",
      required: true,
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "operacion",
        valueField: "id",
        labelField: "operacion",
      },
    },
    {
      name: "id_tipo_contrato",
      label: "Tipo contrato",
      required: true,
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "tipo_contrato",
        valueField: "id",
        labelField: "tipo_contrato",
      },
    },
    // {
    //   name: "id_mes_vencimiento",
    //   label: "Mes vencimiento",
    //   type: "select",
    //   selectplus: false,
    //   foreignKey: { table: "mes", valueField: "id", labelField: "mes" },
    // },
    {
      name: "id_conformidad",
      label: "Conformidad",
      selectplus: false,
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
      defaultValue: "12",
      selectplus: false,
      type: "select",
      foreignKey: {
        table: "estado",
        valueField: "id",
        labelField: "estado",
      },
    },
    {
      name: "id_tipo_moneda",
      label: "Medición / Moneda Precio Acordado",
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "tipo_moneda",
        valueField: "id",
        labelField: "tipo_moneda",
      },
    },
    { name: "precio_inicio", label: "Precio Acordado", type: "number", required:true },
    { name: "fecha_inicio", label: "Fecha inicio", type: "datenative", required:true },
    {
      name: "id_tipo_moneda_precio_venta",
      label: "Medición / Moneda Precio de Venta",
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "tipo_moneda",
        valueField: "id",
        labelField: "tipo_moneda",
      },
    },
    { name: "precio_venta", label: "Precio Venta", type: "number" },
    { name: "fecha_fin", label: "Fecha fin", type: "datenative" },
    {
      name: "id_tipo_moneda_comision",
      label: "Medición / Moneda Comisión",
      type: "select",
      selectplus: false,
      foreignKey: {
        table: "tipo_moneda",
        valueField: "id",
        labelField: "tipo_moneda",
      },
    },
    { name: "comision", label: "Comisión", type: "number" },
    { name: "fecha_contrato_recibido", label: "Fecha Contrato Recibido", type: "datenative" },
    { name: "fecha_contrato_entregado", label: "Fecha Contrato Entregado", type: "datenative" },
    { name: "fecha_contrato_sigi", label: "Fecha Contrato Sigi", type: "datenative" },
    { name: "observaciones", label: "Observaciones", type: "text" },
    { name: "fecha_operacion_ejecutada", label: "Fecha de Cierre Operación", type: "datenative" },

    // {
    //   name: "id_resource",
    //   label: "Documento (URL)",
    //   type: "select",
    //   foreignKey: {
    //     table: "resource",
    //     valueField: "id_resource",
    //     labelField: "url_resource",
    //   },
    // },
  ],

  rules: {
    validations: [
      {
        id: "fecha_recibido_no_mayor_a_entregado",
        /**
         * La condición se activa (= error) cuando fecha_contrato_recibido
         * es estrictamente mayor que fecha_contrato_entregado.
         *
         * Solo se evalúa si ambas fechas están completas (gtField retorna
         * false cuando alguna está vacía).
         */
        when: {
          field: "fecha_contrato_recibido",
          gtField: "fecha_contrato_entregado",
          ltFieldMayor: "fecha_contrato_sigi"
        },
        message:
          "La fecha de contrato recibido no puede ser posterior a la fecha de contrato entregado.",
      },
    ],
  },
};
