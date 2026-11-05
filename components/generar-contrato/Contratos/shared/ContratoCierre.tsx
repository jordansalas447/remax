import { View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { ContratoFirmas } from "./ContratoFirmas";
import type { Propietario } from "./types";

type ContratoCierreProps = {
  children: ReactNode;
  lista: Propietario[];
  varios: number;
  tipodenominacion?: string;
  styles?: any;
};

/**
 * La última cláusula y las firmas viajan juntas.
 * Así las firmas no quedan solas ni se parten entre dos hojas.
 */
export function ContratoCierre({
  children,
  lista,
  varios,
  tipodenominacion,
  styles,
}: ContratoCierreProps) {
  return (
    <View wrap={false}>
      {children}
      <ContratoFirmas
        lista={lista}
        varios={varios}
        tipodenominacion={tipodenominacion}
        styles={styles}
      />
    </View>
  );
}
