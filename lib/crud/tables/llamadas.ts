import type { TableConfig } from "@/lib/crud/types";

export const llamadasConfig: TableConfig = {
  name: "llamadas",
  label: "Llamadas",
  description: "Llamadas a Clientes",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "fecha_bienvenida", label: "Fecha Bienvenida", type: "datenative", required: true },
    { name: "curso_llamada", label: "Curso Llamada", type: "textarea" },
    { name: "observacion", label: "Observacion", type: "textarea" },
    { name: "fecha_seguimiento_llamada", label: "Fecha Seguimiento llamada", type: "datenative" },
    { name: "observacion_seguimiento", label: "Observacion de Seguimiento", type: "textarea" },
  ],
};
