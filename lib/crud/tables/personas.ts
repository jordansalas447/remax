import type { TableConfig } from "@/lib/crud/types";

export const personasConfig: TableConfig = {
  name: "personas",
  label: "Personas",
  description: "Personas registradas en el sistema",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "apellido_paterno", label: "Apellido paterno", type: "text" },
    { name: "apellido_materno", label: "Apellido materno", type: "text" },
    { name: "numero_telefono", label: "Teléfono", type: "text" },
    { name: "documento_identidad", label: "Documento Identidad", type: "text" },
    { name: "direccion", label: "Dirección", type: "text" },
    { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date" },
    { name: "fecha_registro", label: "Fecha de registro", type: "date" },
    { name: "nombre_completo", label: "Nombre Completo", type: "text" },
    {
      name: "id_resource",
      label: "Documento DNI",
      type: "select",
      readOnlyOnEdit: false,
      foreignKey: {
        table: "resource",
        valueField: "id_resource",
        labelField: "url_resource",
      },
    },
  ],
};
