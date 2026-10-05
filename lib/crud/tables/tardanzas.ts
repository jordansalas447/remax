import type { TableConfig } from "@/lib/crud/types";

export const tardanzasConfig: TableConfig = {
  name: "tardanzas",
  label: "Tardanzas",
  description: "Lista de Tardanzas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "hora_programada", label: "Hora Programada", type: "text" },
    { name: "hora_llegada", label: "Hora Llegada", type: "text" },
    { name: "minutos_tardanza", label: "Minutos Tardanza", type: "text" },
    { name: "motivo", label: "Motivo", type: "text" },
    { name: "descripcion", label: "Descripción", type: "text" },
  ],
};
