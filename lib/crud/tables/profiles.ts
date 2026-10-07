import type { TableConfig } from "@/lib/crud/types";

export const profilesConfig: TableConfig = {
  name: "profiles",
  label: "Perfíl",
  description: "Catálogo de Perfiles de Usuario",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "text", readOnlyOnEdit: true },
    { name: "email", label: "Correo", type: "text", required: true },
    { name: "full_name", label: "Nombre Completo", type: "textarea" },
    { name: "role", label: "Rol", type: "text" },
    {
        name: "id_persona",
        label: "Profiles",
        type: "inputsearch",
        foreignKey: {
          table: "personas",
          valueField: "id",
          labelField: "nombre_completo",
        },
    },
  ],
};
