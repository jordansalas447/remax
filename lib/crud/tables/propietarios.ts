import type { TableConfig } from "@/lib/crud/types";

export const propietariosConfig: TableConfig = {
  name: "propietarios",
  label: "Propietarios",
  description: "Dueños de inmuebles captados",
  primaryKey: "id_propietario",
  fields: [
    { name: "id_propietario", label: "ID", type: "number", readOnlyOnEdit: true },
    {
      name: "id_personas",
      label: "Persona",
      type: "inputsearch",
      foreignKey: {
        table: "personas",
        valueField: "id",
        labelField: "nombre_completo",
        sublabelField: "numero_telefono"
      },
    },
    {
      name: "id_empresas",
      label: "Empresas",
      type: "inputsearch",
      foreignKey: {
        table: "empresas",
        valueField: "id",
        labelField: "razon_soc",
        sublabelField: "ruc"
      },
    },
    {
      name: "id_situacion",
      label: "Situacion",
      type: "select",
      foreignKey: {
        table: "situaciones",
        valueField: "id",
        labelField: "descripcion",
      },
    },
    { name: "nombre_completo", label: "Nombre Completo", type: "text", readOnlyOnEdit: true , hiddenInForm:true },
    // { name: "contacto", label: "Contacto", type: "text" }
  ],
  rules: {
    fields: {
      id_personas: {
            when: {
                field: "id_personas",
                onlyOneSelected: true,
                groupFields: ["id_personas", "id_empresas"],
            },
            hide: true,
        },
        id_empresas: {
            when: {
                field: "id_empresas",
                onlyOneSelected: true,
                groupFields: ["id_empresas", "id_personas"],
            },
            hide: true,
        }
    },
},
};
