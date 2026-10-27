import type { TableConfig } from "@/lib/crud/types";

export const horariosaccesoConfig: TableConfig = {
  name: "horarios_acceso",
  label: "Horarios Acceso",
  description: "Catálogo de Horarios Acceso",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "user_id", label: "User ID", type: "text" },
    { name: "dia_semana", label: "Dia Semana", type: "number" },
    { name: "hora_inicio", label: "Hora Inicio", type: "text" },
    { name: "hora_fin", label: "Hora Fin", type: "text" },
  ],
};
