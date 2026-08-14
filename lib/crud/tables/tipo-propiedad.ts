import type { TableConfig } from "@/lib/crud/types";

export const tipoPropiedadConfig: TableConfig = {
  name: "tipo_propiedad",
  label: "Tipos de propiedad",
  description: "Catálogo de tipos de inmuebles",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "tipo_propiedad", label: "Tipo de propiedad", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
};
