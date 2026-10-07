import type { TableConfig } from "@/lib/crud/types";

export const asistenciasConfig: TableConfig = {
  name: "asistencias",
  label: "Asistencias",
  description: "Listado Asistencias",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "observacion", label: "Observacion", type: "text", required: true },
    {
      name: "id_tardanza",
      label: "Tardanza",
      type: "select",
      required: true,
      foreignKey: {
        table: "tardanzas",
        valueField: "id",
        labelField: "descripcion",
      },
    },
    {
      name: "id_evento",
      label: "Eventos",
      type: "select",
      required: true,
      foreignKey: {
        table: "eventos",
        valueField: "id",
        labelField: "descripcion",
      },
    },
    {
      name: "id_asociado",
      label: "Asociado",
      type: "inputsearch",
      required: true,
      foreignKey: {
        table: "asociados",
        valueField: "id_asociado",
        labelField: "nombre_completo",
      },
    },
  ],
};
