import type { TableConfig } from "@/lib/crud/types";

export const historial_observacionesConfig: TableConfig = {
    name: "historial_observaciones",
    label: "Observaciones",
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
                sublabelField: "telefono"
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
        {
            name: "id_inmueble_propietario_contrato",
            label: "Inmueble Propietario Contrato",
            type: "inputsearch",
            selectplus: false,
            foreignKey: {
                table: "propiedad_propietario",
                valueField: "id",
                labelField: "resumen_operacion",
                sublabelField: "id"
            },
        },
        { name: "fecha_creacion", label: "Fecha de Creacion", type: "date", hiddenInForm: true },
        {
            name: "id_alcance",
            label: "Alcance",
            type: "select",
            selectplus: true,
            foreignKey: {
                table: "alcances",
                valueField: "id_alcance",
                labelField: "alcance"
            },
        },      
        { name: "observacion", label: "Observacion", type: "textarea" },
    ],
    rules: {
        fields: {
            id_propietarios: {
                when: {
                    field: "id_propietarios",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles","id_inmueble_propietario_contrato"],
                },
                hide: true,
            },
            id_contratos: {
                when: {
                    field: "id_contratos",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles","id_inmueble_propietario_contrato"],
                },
                hide: true,
            },
            id_inmuebles: {
                when: {
                    field: "id_inmuebles",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles","id_inmueble_propietario_contrato"],
                },
                hide: true,
            },
            id_inmueble_propietario_contrato: {
                when: {
                    field: "id_inmueble_propietario_contrato",
                    onlyOneSelected: true,
                    groupFields: ["id_propietarios", "id_contratos", "id_inmuebles","id_inmueble_propietario_contrato"],
                },
                hide: true,
            },
        },
    },
};
