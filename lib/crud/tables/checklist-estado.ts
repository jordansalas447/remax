import type { TableConfig } from "@/lib/crud/types";

export const checklistEstadoConfig: TableConfig = {
  name: "checklist_estado",
  label: "Estado checklist",
  description: "Estado Oficina/SIGI por ítem y revisión",
  primaryKey: "id_checklist_estado",
  fields: [
    { name: "id_checklist_estado", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_revision",
      label: "Revisión",
      type: "select",
      required: true,
      foreignKey: {
        table: "revisiones",
        valueField: "id_revision",
        labelField: "id_revision",
      },
    },
    {
      name: "id_item",
      label: "Ítem",
      type: "select",
      required: true,
      foreignKey: {
        table: "items_checklist",
        valueField: "id_item",
        labelField: "nombre_item",
      },
    },
    { name: "estado_oficina", label: "Estado oficina", type: "boolean" },
    { name: "estado_sigi", label: "Estado SIGI", type: "boolean" },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
