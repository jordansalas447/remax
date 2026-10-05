import type { TableConfig } from "@/lib/crud/types";

export const eventosConfig: TableConfig = {
  name: "eventos",
  label: "Eventos",
  description: "Catálogo de Eventos",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "nombre", label: "Titulo", type: "text", required: true },
    { name: "fecha", label: "Fecha", type: "datenative" },
    { name: "hora_inicio", label: "Hora Inicio", type: "text" },
    { name: "hora_fin", label: "Hora Fin", type: "text" },
    { name: "tolerancia_minutos", label: "Tolerancia Minutos", type: "number" },
    { name: "obligatorio", label: "Obligatorio", type: "boolean" },
    { name: "descripcion", label: "Descripción", type: "textarea" },

  ],
};

