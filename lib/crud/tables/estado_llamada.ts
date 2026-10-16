import type { TableConfig } from "@/lib/crud/types";

export const estado_llamadaConfig: TableConfig = {
  name: "estado_llamada",
  label: "Estado Llamada",
  description: "Estados de llamada",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "estado_llamada",
      label: "Estado",
      type: "text",
      required: true,
    },
    {
        name: "accion",
        label: "Accion",
        type: "text",
    },
    {
        name: "color",
        label: "Color",
        type: "text",
        required: true,
    },
  ],
};

