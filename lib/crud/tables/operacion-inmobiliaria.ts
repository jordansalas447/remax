import type { TableConfig } from "@/lib/crud/types";

export const operacioninmobiliariaConfig: TableConfig = {
    name: "operacion_inmobiliaria",
    label: "Operacion Inmobiliaria",
    description: "operacion_inmobiliaria",
    primaryKey: "id",
    fields: [
      { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
      { name: "operacion", label: "operacion", type: "text" },
    ],
};
