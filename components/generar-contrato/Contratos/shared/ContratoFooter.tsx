import { Image, Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";

type ContratoFooterProps = {
  qr?: string;
};

export function ContratoFooter({ qr }: ContratoFooterProps) {
  return (
    <View style={styles.footerContainer} fixed>
      <View style={styles.footerInfoRow}>
        <Text>
          Urbanización Santo Domingo Segunda Etapa, Quinta Estancia, Mz. A, Lote
          2. JLByR.
        </Text>
        <Text>(054)-706202</Text>
      </View>
      <View style={styles.footerWebRow}>
        <Text>www.remaxadelante.com</Text>
      </View>
      <View style={styles.footerBottomRow}>
        <View style={styles.footerBottomLeft}>
          <View style={styles.arequipaRow}>
            <View style={styles.arequipaLine} />
            <Text style={styles.arequipaText}>Arequipa - Perú</Text>
            <View style={styles.arequipaLine} />
          </View>
        </View>
        {qr ? <Image src={qr} style={styles.qrFooter} /> : null}
      </View>
    </View>
  );
}
