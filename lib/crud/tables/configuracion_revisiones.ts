import type { TableConfig } from "@/lib/crud/types";

export const configuracion_revisionesConfig: TableConfig = {
  name: "configuracion_revisiones",
  label: "Configuracion Revisiones",
  description: "Expediente y checklist general de la ficha",
  form: {
    columns: 2,
    submitLabel: "Guardar Revision",
    cancelLabel: "Cancelar",
  },
  primaryKey: "id_revision",
  fields: [
    { name: "id_revision", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "descripcion", label: "Descripción", type: "text" },
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
      name: "id_operacion_inmobiliaria",
      label: "Tipo Operacion Inmobiliaria",
      type: "select",
      foreignKey: {
        table: "operacion_inmobiliaria",
        valueField: "id",
        labelField: "operacion",
      },
    },
    { name: "observacion", label: "Observacion", type: "textarea" },
  ],
};
