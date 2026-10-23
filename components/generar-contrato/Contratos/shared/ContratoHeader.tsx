import { Image, Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";

type ContratoHeaderProps = {
  nroContrato: string;
  logoIzquierdo?: NonSharedBuffer;
  logoDerecho?: NonSharedBuffer;
  logosEnTodasLasPaginas?: boolean;
  titulo?: string;
};

export function ContratoHeader({
  nroContrato,
  logoIzquierdo,
  logoDerecho,
  logosEnTodasLasPaginas = false,
  titulo,
}: ContratoHeaderProps) {
  return (
    <View style={styles.headerContainer} fixed={logosEnTodasLasPaginas}>
      <View style={styles.logoSlot}>
        {logoIzquierdo ? (
          <Image src={logoIzquierdo} style={styles.logoImage} />
        ) : null}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {titulo ??
            `AUTORIZACIÓN DE CORRETAJE INMOBILIARIO N.º ${nroContrato || ""}`}
        </Text>
      </View>
      <View style={styles.logoSlot}>
        {logoDerecho ? (
          <Image src={logoDerecho} style={styles.logoImage} />
        ) : null}
      </View>
    </View>
  );
}
