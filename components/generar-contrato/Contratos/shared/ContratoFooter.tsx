import { Image, Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";

type ContratoFooterProps = {
  qr?: string;
  fecha_creacion: string | undefined;
  id_publico: string | undefined;
};

function formatFechaPeru(fecha: string | undefined): string {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return "";
  date.setHours(date.getHours() - 5);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

export function ContratoFooter({ qr, fecha_creacion, id_publico }: ContratoFooterProps) {
  const fechaFormateada = formatFechaPeru(fecha_creacion);
  const idCorto = id_publico ? id_publico.slice(-5) : "";

  return (
    <View style={styles.footerContainer} fixed>
      <View style={styles.footerTextContainer}>
        <Text style={styles.footerAddress}>
          Urbanización Santo Domingo Segunda Etapa, Quinta Estancia, Mz. A, Lote 2. JLByR.
        </Text>

        <Text style={styles.footerDetails}>
          Arequipa - Perú   |   Teléfono: (054)-706202   |   www.remaxadelante.com
        </Text>

        {(fechaFormateada || (!qr && idCorto)) ? (
          <Text style={styles.footerSubDetails}>
            {fechaFormateada ? `Fecha de emisión: ${fechaFormateada}` : ""}
            {fechaFormateada && !qr && idCorto ? "   |   " : ""}
            {!qr && idCorto ? `Cód. Verificación: ${idCorto}` : ""}
          </Text>
        ) : null}
      </View>

      {qr ? (
        <View style={styles.footerQrContainer}>
          <Image src={qr} style={styles.qrFooter} />
          {idCorto ? (
            <Text style={styles.qrFooterText}>{idCorto}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

