import type { TableConfig } from "@/lib/crud/types";

export const numerosTelefonicosConfig: TableConfig = {
    name: "numeros_telefonicos",
    label: "Números Telefonicos",
    description: "Catálogo de Números Telefonicos",
    primaryKey: "id",
    fields: [
        { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
        { name: "numero_telefono", label: "Operación", type: "text", required: true },
        { name: "id_persona", label: "Persona", type: "textarea" },
        { name: "descripcion", label: "Descripción", type: "text" },
    ],
};
