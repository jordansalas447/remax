import type { TableConfig } from "@/lib/crud/types";

export const tablasConfig: TableConfig = {
    name: "tablas",
    label: "Tablas",
    description: "Tablas del sistema",
    primaryKey: "id",
    fields: [
        { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
        { name: "icon", label: "Icon", type: "text" },
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "descripcion", label: "Descripción", type: "textarea" },
        { name: "grupo", label: "Grupo", type: "textarea" },
        { name: "prioridad", label: "Prioridad", type: "number" },
        {
            name: "tabla_id",
            label: "Tabla",
            type: "select",
            foreignKey: {
              table: "tablas",
              valueField: "id",
              labelField: "nombre",
            },
          },
    ],
};
