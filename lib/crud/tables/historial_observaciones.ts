import type { TableConfig } from "@/lib/crud/types";

export const historial_observacionesConfig: TableConfig = {
    name: "historial_observaciones",
    label: "Historial de Observaciones",
    description: "Historial de Observaciones",
    primaryKey: "id",
    fields: [
        { name: "id", label: "ID", type: "number", readOnlyOnEdit: true },
        {
            name: "id_propietarios",
            label: "Propietarios",
            type: "inputsearch",
            selectplus: false,
            foreignKey: {
                table: "propietarios",
                valueField: "id_propietario",
                labelField: "nombre_completo",
            },
        },
        {
            name: "id_contratos",
            label: "Contratos",
            type: "inputsearch",
            selectplus: false,
            foreignKey: {
                table: "contratos",
                valueField: "id_contrato",
                labelField: "nro_contrato",
            },
        },
        {
            name: "id_inmuebles",
            label: "Inmueble",
            type: "inputsearch",
            selectplus: false,
            foreignKey: {
                table: "inmuebles",
                valueField: "id_propiedad",
                labelField: "n_partida",
            },
        },
        { name: "fecha_creacion", label: "Fecha de Creacion", type: "date", hiddenInForm: true },
        { name: "observacion", label: "Observacion", type: "textarea" },
    ],
    rules: {
        fields: {
            id_propietarios: {
                when: {
                    field: "id_propietarios",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles"],
                },
                disable: true,
            },
            id_contratos: {
                when: {
                    field: "id_contratos",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles"],
                },
                disable: true,
            },
            id_inmuebles: {
                when: {
                    field: "id_inmuebles",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles"],
                },
                disable: true,
            },
        },
    },
};
