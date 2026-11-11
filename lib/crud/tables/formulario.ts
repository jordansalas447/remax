import type { TableConfig } from "@/lib/crud/types";

export const formularioConfig: TableConfig = {
  name: "formulario",
  label: "Formulario",
  description: "Catálogo de Formulario",
  primaryKey: "id",
  fields: [
    { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },

    {
      name: "id_formulario",
      label: "Nro Contrato",
      type: "text",
      selectplus: false,
      foreignKey: {
          table: "documentos",
          valueField: "id",
          labelField: "nro_contrato",
      },
    },

    { name: "anoFirma", label: "anoFirma", type: "textarea" },
    { name: "comision", label: "comision", type: "textarea" },
    { name: "diaFirma", label: "diaFirma", type: "textarea" },
    { name: "duracionMeses", label: "duracionMeses", type: "textarea" },
    { name: "inmuebleDepartamento", label: "inmuebleDepartamento", type: "textarea" },
    { name: "inmuebleDireccion", label: "inmuebleDireccion", type: "textarea" },
    { name: "inmuebleDistrito", label: "inmuebleDistrito", type: "textarea" },
    { name: "inmueblePartida", label: "inmueblePartida", type: "textarea" },
    { name: "inmuebleProvincia", label: "inmuebleProvincia", type: "textarea" },
    { name: "mesFirma", label: "mesFirma", type: "textarea" },
    { name: "nombreAsesor", label: "nombreAsesor", type: "textarea" },

    { name: "propietariocelular", label: "celular", type: "textarea" },
    { name: "propietariodepartamento", label: "departamento", type: "textarea" },
    { name: "propietariodistrito", label: "distrito", type: "textarea" },
    { name: "propietariodni", label: "dni", type: "textarea" },
    { name: "propietariodomicilio", label: "domicilio", type: "textarea" },
    { name: "propietarioestadoCivil", label: "estadoCivil", type: "textarea" },
    { name: "propietarionombre", label: "nombre", type: "textarea" },
    { name: "propietarioprovincia", label: "provincia", type: "textarea" },

  ],
};

