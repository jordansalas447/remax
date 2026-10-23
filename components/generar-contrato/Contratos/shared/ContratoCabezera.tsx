import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { contratoStyles as styles, val, listaPropietarios, type Propietario } from "./";
 
type ContratoCabezeraProps = {
  varios: number;
  lista: Propietario[];
  tipodenominacion: string;
  mostrarOcupacion?: boolean; // Nuevo flag opcional para mostrar ocupación
};
 
export function ContratoCabezera({ varios, lista, tipodenominacion, mostrarOcupacion = false }: ContratoCabezeraProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.justified}>
        Conste por el presente documento, el contrato de corretaje inmobiliario, que celebran de una parte {varios ? "los" : "el"} Sr./Sra.:{" "}
        {lista.map((p, i) => (
          <React.Fragment key={i}>
            {i > 0 ? (i === lista.length - 1 ? "; y " : "; ") : ""}
            {i > 0 ? "el Sr./Sra.: " : ""}
            <Text style={styles.dataInput}>
              {val(p.nombre, "____________________________")}
            </Text>
            , debidamente identificado(a) con DNI N°{" "}
            <Text style={styles.dataInput}>{val(p.dni, "_____________")}</Text>, estado civil{" "}
            <Text style={styles.dataInput}>{val(p.estadoCivil, "__________________")}</Text>
            {mostrarOcupacion && (
              <>
                , ocupación{" "}
                <Text style={styles.dataInput}>{val(p.ocupacion, "__________________")}</Text>
              </>
            )}
            , número de celular{" "}
            <Text style={styles.dataInput}>{val(p.celular, "_______________")}</Text>, con domicilio para estos efectos en{" "}
            <Text style={styles.dataInput}>
              {val(p.domicilio, "__________________________________________________")}
            </Text>
            , distrito de{" "}
            <Text style={styles.dataInput}>{val(p.distrito, "_______________")}</Text>, provincia y departamento de Arequipa
          </React.Fragment>
        ))}
        , y a {varios == 1 ? "quien" : "quienes"} en adelante se {varios ? "les denominará conjuntamente" : "le denominará"} como <Text style={styles.bold}>{tipodenominacion}</Text>; y de la otra parte, la empresa <Text style={styles.bold}>ADELANTE ASESORES INMOBILIARIOS SAC.</Text> Comercialmente conocida como <Text style={styles.bold}>(REMAX ADELANTE)</Text> con <Text style={styles.bold}>RUC Nro. 20612674192</Text> con domicilio en <Text style={styles.bold}>Urbanización Santo Domingo Segunda Etapa, Quinta Estancia Mz. A, Lote 2 (Av. Lambramani)</Text> , distrito de <Text style={styles.bold}>José Luis Bustamante y Rivero</Text>, Provincia y Departamento de <Text style={styles.bold}>Arequipa</Text>; debidamente representada por su Representante Legal, la señora Janelly Hurtado López, debidamente identificado con DNI Nº 44309957, y poderes inscritos en la Partida N° 11450349 del Registro de Personas Jurídicas de Arequipa a quien en adelante se le denominará <Text style={styles.bold}>“EL COMISIONISTA”</Text>; en los términos y condiciones de las cláusulas siguientes:
      </Text>
    </View>
  );
}