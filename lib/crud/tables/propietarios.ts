import type { TableConfig } from "@/lib/crud/types";

export const propietariosConfig: TableConfig = {
  name: "propietarios",
  label: "Propietarios",
  description: "Dueños de inmuebles captados",
  primaryKey: "id_propietario",
  fields: [
    { name: "id_propietario", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_personas",
      label: "Persona",
      type: "select",
      foreignKey: {
        table: "personas",
        valueField: "id",
        labelField: "nombre",
      },
    },
    { name: "nombre_completo", label: "Nombre Completo", type: "text", readOnlyOnEdit: true },
    { name: "contacto", label: "Contacto", type: "text" }
  ],
};
