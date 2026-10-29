import type { TableConfig } from "@/lib/crud/types";

export const diasemanaaccesoConfig: TableConfig = {
  name: "dias_semana",
  label: "Dias Semana",
  description: "Catálogo de Dias",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "dia", label: "Dias Semana", type: "text" },
  ],
};
