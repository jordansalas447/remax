import type { TableConfig } from "@/lib/crud/types";

export const documentosConfig: TableConfig = {
  name: "documentos",
  label: "Documentos",
  description: "Catálogo de Documentos",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
    { name: "empresa", label: "Empresa", type: "boolean" },
    { name: "apoderado", label: "Apoderado", type: "boolean" },
    { name: "nro_contrato", label: "Nro Contrato", type: "text" },
    { name: "nro_propietarios", label: "Nro Propietarios", type: "number" },
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
    {
        name: "id_tipo_contrato",
        label: "Tipo Contrato",
        type: "select",
        foreignKey: {
          table: "tipo_contrato",
          valueField: "id",
          labelField: "tipo_contrato",
        },
    },
    {
        name: "id_operacion",
        label: "Operacion",
        type: "select",
        foreignKey: {
          table: "operacion",
          valueField: "id",
          labelField: "operacion",
        },
    },
    {
        name: "id_estado",
        label: "Estado Contrato",
        type: "select",
        foreignKey: {
          table: "estado_documento",
          valueField: "id",
          labelField: "estado",
        },
    },
    { name: "motivo_anulacion", label: "Motivo Anulacion", type: "text" }
  ]
};
