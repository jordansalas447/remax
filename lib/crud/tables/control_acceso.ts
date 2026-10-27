import type { TableConfig } from "@/lib/crud/types";

export const controlaccesoConfig: TableConfig = {
  name: "control_acceso",
  label: "Control Acceso",
  description: "Catálogo de Control Acceso",
  primaryKey: "user_id",
  fields: [
    { name: "user_id", label: "User ID", type: "number", readOnlyOnEdit: true },
    { name: "activo", label: "Activo", type: "text" },
    { name: "actualizado_at", label: "Actualizado", type: "textarea" },
  ],
};
