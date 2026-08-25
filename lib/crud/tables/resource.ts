import type { TableConfig } from "@/lib/crud/types";

export const resourceConfig: TableConfig = {
    name: "resource",
    label: "Recursos",
    description: "Recursos",
    primaryKey: "id_resource",
    fields: [
        { name: "url_resource", label: "Recursos", type: "text" },
        { name: "descripcion", label: "Descripción", type: "textarea" },
    ],
};
