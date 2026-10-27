import type { TableConfig } from "@/lib/crud/types";

export const sesionesaccesoConfig: TableConfig = {
  name: "sesiones_acceso",
  label: "Sessiones Acceso",
  description: "Catálogo de Sessiones Acceso",
  primaryKey: "user_id",
  fields: [
    { name: "user_id", label: "User ID", type: "number", readOnlyOnEdit: true },
    { name: "valido_hasta", label: "Valido Hasta", type: "text" },
    { name: "session_id", label: "Session ID", type: "text" },
  ],
};
