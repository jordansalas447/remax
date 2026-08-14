import type { TableConfig } from "@/lib/crud/types";

export const revisionesConfig: TableConfig = {
  name: "revisiones",
  label: "Revisiones",
  description: "Expediente y checklist general de la ficha",
  primaryKey: "id_revision",
  fields: [
    { name: "id_revision", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_propiedad",
      label: "Propiedad",
      type: "select",
      required: true,
      foreignKey: {
        table: "propiedades",
        valueField: "id_propiedad",
        labelField: "n_partida",
      },
    },
    {
      name: "id_revisor",
      label: "Revisor",
      type: "select",
      foreignKey: {
        table: "administrativos",
        valueField: "id",
        labelField: "snap_nombre",
      },
    },
    { name: "conformidad_descripcion", label: "Conformidad descripción", type: "text" },
    { name: "observaciones", label: "Observaciones", type: "textarea" },
    { name: "correo_elab_eett", label: "Correo elaboración EETT", type: "text" },
    { name: "fecha_elab_eett", label: "Fecha elaboración EETT", type: "date" },
    { name: "comentarios_docs", label: "Comentarios documentos", type: "textarea" },
    { name: "levant_observ", label: "Levantamiento observaciones", type: "textarea" },
    { name: "fecha_recibido", label: "Fecha recibido", type: "date" },
    { name: "fecha_entregado", label: "Fecha entregado", type: "date" },
    { name: "fecha_sigi", label: "Fecha SIGI", type: "date" },
  ],
};
