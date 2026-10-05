import type { TableConfig } from "@/lib/crud/types";

export const multasConfig: TableConfig = {
  name: "multas",
  label: "Multas",
  description: "Lista de Multas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "fecha", label: "Fecha", type: "datenative" },
    { name: "monto", label: "Monto", type: "number" },
    {
        name: "id_tipo_multa",
        label: "Tipo Multa",
        type: "select",
        foreignKey: {
          table: "tipo_multa",
          valueField: "id",
          labelField: "descripcion",
        },
      },
      {
        name: "id_asociado",
        label: "Asociado",
        type: "select",
        foreignKey: {
          table: "asociados",
          valueField: "id_asociado",
          labelField: "nombre_completo",
        },
      },
      { name: "descripcion", label: "Descripción", type: "textarea" }
  ],
};
