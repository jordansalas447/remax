import type { TableConfig } from "@/lib/crud/types";

export const estadoConfig: TableConfig = {
  name: "estado",
  label: "Estados",
  description: "Catálogo de estados de contratos",
  primaryKey: "id",
  form: {
    title: "Gestionar estado",
    description: "Administra los estados disponibles.",
    columns: 1,
    submitLabel: "Guardar estado",
    cancelLabel: "Cancelar",
  },
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "estado",
      label: "Estado",
      type: "text",
      required: true,
      ui: { placeholder: "Ej. Activo" },
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      ui: { placeholder: "Ingrese una descripción..." },
    },
    { name: "color", label: "Color", type: "text" },
  ],
};
