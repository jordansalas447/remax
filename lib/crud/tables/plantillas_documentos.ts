import type { TableConfig } from "@/lib/crud/types";

export const plantillasDocumentosConfig: TableConfig = {
  name: "plantillas_documentos",
  label: "Plantillas Documentos",
  description: "Catálogo de plantillas documentos",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "version", label: "Version", type: "textarea" },
    { name: "activo", label: "Activo", type: "text" },
  ],
};
