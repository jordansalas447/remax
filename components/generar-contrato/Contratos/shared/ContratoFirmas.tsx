import { Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";
import type { Propietario } from "./types";

type ContratoFirmasProps = {
  lista: Propietario[];
  varios: number;
  tipodenominacion?: string;
  styles?: any;
};

export function ContratoFirmas({
  lista,
  varios,
  tipodenominacion = "EL PROPIETARIO",
  styles: customStyles,
}: ContratoFirmasProps) {
  const activeStyles = customStyles || styles;

  const signatureBoxStyle = {
    ...activeStyles.signatureBox,
    ...(lista.length > 5 ? { width: "30%" } : {}),
  };

  return (
    <View style={activeStyles.signatureSection} wrap={false}>
      {lista.map((p, i) => (
        <View key={i} style={signatureBoxStyle} wrap={false}>
          <Text style={activeStyles.signatureText}>
            {varios > 1 ? `${tipodenominacion} ${i + 1}` : tipodenominacion}
          </Text>
          {p.nombre ? (
            <Text style={activeStyles.signatureSubText}>{p.nombre}</Text>
          ) : null}
          {p.dni ? (
            <Text style={activeStyles.signatureSubText}>DNI N° {p.dni}</Text>
          ) : null}
        </View>
      ))}
      <View style={signatureBoxStyle} wrap={false}>
        <Text style={activeStyles.signatureText}>EL COMISIONISTA</Text>
        <Text style={activeStyles.signatureSubText}>Janelly Hurtado López</Text>
        <Text style={activeStyles.signatureSubText}>DNI N° 44309957</Text>
      </View>
    </View>
  );
}
