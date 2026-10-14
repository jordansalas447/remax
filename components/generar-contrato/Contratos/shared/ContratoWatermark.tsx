import { Image, Text, View } from "@react-pdf/renderer";
import { contratoStyles as styles } from "./styles";

type ContratoWatermarkProps = {
  nroContrato: string;
  logoMarcadeAgua?: NonSharedBuffer;
};

export function ContratoWatermark({
  nroContrato,
  logoMarcadeAgua,
}: ContratoWatermarkProps) {
  return (
    <>
      <View style={styles.watermarkImageContainer} fixed>
        {logoMarcadeAgua ? (
          <Image src={logoMarcadeAgua} style={styles.watermarkImage} />
        ) : null}
      </View>
      <Text style={styles.watermarkContractNumber} fixed>
        {nroContrato || "RAD-ANT-26-0001"}
      </Text>
    </>
  );
}
