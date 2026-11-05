import { Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";
import type { Propietario } from "./types";

type ContratoFirmasProps = {
  lista: Propietario[];
  varios: number;
  tipodenominacion?:string;
};

export function ContratoFirmas({ lista, varios,tipodenominacion = "EL PROPIETARIO" }: ContratoFirmasProps) {
  return (
    <View style={styles.signatureSection}>
      {lista.map((p, i) => (
        <View key={i} style={styles.signatureBox} wrap={false}>
          <Text style={styles.signatureText}>
            {varios > 1 ? `${tipodenominacion} ${i + 1}` : tipodenominacion}
          </Text>
          {p.nombre ? (
            <Text style={styles.signatureSubText}>{p.nombre}</Text>
          ) : null}
          {p.dni ? (
            <Text style={styles.signatureSubText}>DNI N° {p.dni}</Text>
          ) : null}
        </View>
      ))}
      <View style={styles.signatureBox} wrap={false}>
        <Text style={styles.signatureText}>EL COMISIONISTA</Text>
        <Text style={styles.signatureSubText}>Janelly Hurtado López</Text>
        <Text style={styles.signatureSubText}>DNI N° 44309957</Text> 
      </View>
    </View>
  );
}
