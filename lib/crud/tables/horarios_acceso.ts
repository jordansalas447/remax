import type { TableConfig } from "@/lib/crud/types";

export const horariosaccesoConfig: TableConfig = {
  name: "horarios_acceso",
  label: "Horarios Acceso",
  description: "Catálogo de Horarios Acceso",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    // { name: "user_id", label: "User ID", type: "text" },
    // { name: "dia_semana", label: "Dia Semana", type: "number" },
    {
      name: "user_id",
      label: "User ID",
      type: "select",
      selectplus: false,
      foreignKey: {
          table: "profiles",
          valueField: "id",
          labelField: "email"
      },
    },
    {
      name: "dia_semana",
      label: "Dia Semana",
      type: "select",
      selectplus: false,
      foreignKey: {
          table: "dias_semana",
          valueField: "id",
          labelField: "dia"
      },
    },
    { name: "hora_inicio", label: "Hora Inicio", type: "datetime" },
    { name: "hora_fin", label: "Hora Fin", type: "datetime" },
  ],
};
