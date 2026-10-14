import { Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";
import type { Propietario } from "./types";

type ContratoFirmasProps = {
  lista: Propietario[];
  varios: number;
};

export function ContratoFirmas({ lista, varios }: ContratoFirmasProps) {
  return (
    <View style={styles.signatureSection} wrap={false}>
      {lista.map((p, i) => (
        <View key={i} style={styles.signatureBox}>
          <Text style={styles.signatureText}>
            {varios > 1 ? `EL PROPIETARIO ${i + 1}` : "EL PROPIETARIO"}
          </Text>
          {p.nombre ? (
            <Text style={styles.signatureSubText}>{p.nombre}</Text>
          ) : null}
          {p.dni ? (
            <Text style={styles.signatureSubText}>DNI N° {p.dni}</Text>
          ) : null}
        </View>
      ))}
      <View style={styles.signatureBox}>
        <Text style={styles.signatureText}>EL COMISIONISTA</Text>
      </View>
    </View>
  );
}
