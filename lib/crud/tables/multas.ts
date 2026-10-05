import type { TableConfig } from "@/lib/crud/types";

export const multasConfig: TableConfig = {
  name: "multas",
  label: "Multas",
  description: "Lista de Multas",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    // { name: "monto", label: "Monto", type: "number" },
    {
        name: "id_tipo_multa",
        label: "Multa",
        type: "inputsearch",
        foreignKey: {
          table: "tipo_multa",
          valueField: "id",
          labelField: "resumen",
          sublabelField: "aviso"
        },
      },
      {
        name: "id_asociado",
        label: "Asociado",
        type: "inputsearch",
        foreignKey: {
          table: "asociados",
          valueField: "id_asociado",
          labelField: "nombre_completo",
          sublabelField:"estado"
        },
      },
      { name: "fecha", label: "Fecha", type: "datenative" },
      { name: "descripcion", label: "Descripción", type: "textarea" },
      {
        name: "id_justificacion",
        label: "Justificacion",
        type: "inputsearch",
        collapsedInForm:true,
        foreignKey: {
          table: "justificaciones",
          valueField: "id",
          labelField: "descripcion",
          sublabelField:"Motivo"
        },
      },
  ],
};
