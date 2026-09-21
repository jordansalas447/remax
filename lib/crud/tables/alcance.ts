import type { TableConfig } from "@/lib/crud/types";

export const alcanceConfig: TableConfig = {
  name: "alcances",
  label: "Alcances",
  description: "Catálogo de alcances",
  primaryKey: "id_alcance",
  fields: [
    { name: "id_alcance", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "alcance", label: "Alcance", type: "text", required: true },
    { name: "nombre_propiedad", label: "Nombre propiedad", type: "textarea" },
  ],
};
