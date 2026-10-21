import { Image, Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";

type ContratoFooterProps = {
  qr?: string;
  fecha_creacion: Date | undefined;
  id_publico: string | undefined;
};

export function ContratoFooter({ qr, fecha_creacion, id_publico }: ContratoFooterProps) {
  return (
    <View style={styles.footerContainer} fixed>

      <View style={styles.footerInfoRow}>
        <Text>
          Urbanización Santo Domingo Segunda Etapa, Quinta Estancia, Mz. A, Lote
          2. JLByR.
        </Text>
        <Text>(054)-706202</Text>
      </View>

      <View style={styles.footerInfoRow}>

        <Text>www.remaxadelante.com</Text>
        <Text>
          {fecha_creacion
            ? (() => {
              const date = new Date(fecha_creacion);
              date.setHours(date.getHours() - 5);
              // Formato YYYY-MM-DD
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${day}/${month}/${year}`;
            })()
            : ""}
        </Text>
      </View>

      {/* <View style={[styles.footerWebRow, { paddingRight: 10 },{marginBottom:0}]}>
        <Text>{id_publico ? id_publico.slice(-5) : ""}</Text>
      </View> */}
 

      <View style={styles.footerBottomRow}>
        <View style={styles.footerBottomLeft}>
          <View style={styles.arequipaRow}>
            <View style={styles.arequipaLine} />     
            <Text style={styles.arequipaText}>Arequipa - Perú</Text>
            <View style={styles.arequipaLine} />
          </View>
        </View>
        {qr ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image src={qr} style={styles.qrFooter} />
            <Text
              style={{
                fontSize: 6,
                color: "#222",
                marginTop: 2,
                marginBottom:0,                
                textAlign: "center",
                letterSpacing: 1,
              }}
            >
              {id_publico ? id_publico.slice(-5) : ""}
            </Text>
          </View>
        ) : null}
      </View>
 
    </View>
  );
}
