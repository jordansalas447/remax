import type { TableConfig } from "@/lib/crud/types";

export const revisionesConfig: TableConfig = {
  name: "revisiones",
  label: "Revisiones",
  description: "Expediente y checklist general de la ficha",
  primaryKey: "id_revision",
  fields: [
    { name: "id_revision", label: "ID", type: "number", readOnlyOnEdit: true },
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
    { name: "conformidad_descripcion", label: "Conformidad descripción", type: "text" },
    { name: "observaciones", label: "Observaciones", type: "textarea" },
    { name: "fecha_recibido", label: "Fecha recibido", type: "date" },
    { name: "fecha_entregado", label: "Fecha entregado", type: "date" },
    { name: "fecha_sigi", label: "Fecha SIGI", type: "date" },
    {
      name: "id_item",
      label: "Item",
      type: "select",
      foreignKey: {
        table: "items_checklist",
        valueField: "id_item",
        labelField: "nombre_item",
      },
    },
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
      name: "id_propiedad_propietario_contrato",
      label: "Propiedad Propietario Contrato",
      type: "select",
      foreignKey: {
        table: "propiedad_propietario",
        valueField: "id",
        labelField: "id",
      },
    },
    {
      name: "id_operacion_inmobiliaria",
      label: "Tipo Operacion Inmobiliaria",
      type: "select",
      foreignKey: {
        table: "operacion_inmobiliaria",
        valueField: "id",
        labelField: "operacion",
      },
    },
    { name: "id_ref_propiedad_propietario_contrato", label: "Ref Operacion", type: "number" },
  ],
};
