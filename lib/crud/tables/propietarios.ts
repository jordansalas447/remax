import type { TableConfig } from "@/lib/crud/types";

export const propietariosConfig: TableConfig = {
  name: "propietarios",
  label: "Propietarios",
  description: "Dueños de inmuebles captados",
  primaryKey: "id_propietario",
  fields: [
    { name: "id_propietario", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "nombres", label: "Nombres", type: "text", required: true },
    { name: "contacto", label: "Contacto", type: "text" },
  ],
};
