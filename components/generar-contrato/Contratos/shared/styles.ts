import { Font, StyleSheet } from "@react-pdf/renderer";
import type { AjustesEstiloContrato } from "./types";

Font.registerHyphenationCallback((word: string) => [word]);

export function getContratoStyles(ajustes?: AjustesEstiloContrato) {
  const fontSize = ajustes?.fontSize ?? 8.5;
  const lineHeight = ajustes?.lineHeight ?? 1.8;
  const sectionMarginBottom = ajustes?.sectionMarginBottom ?? 6;
  const clauseTitleMarginTop = ajustes?.clauseTitleMarginTop ?? 8;
  const signatureMarginTop = ajustes?.signatureMarginTop ?? 24;
  const signatureBoxMarginBottom = ajustes?.signatureBoxMarginBottom ?? 20;
  const closingMinPresenceAhead = ajustes?.closingSectionMinPresenceAhead ?? 0;

  return StyleSheet.create({
    page: {
      paddingTop: 50,
      paddingBottom: 72,
      paddingLeft: 50,
      paddingRight: 50,
      fontSize,
      lineHeight,
    },
    watermarkImageContainer: {
      position: "absolute",
      top: "30%",
      left: 0,
      right: 0,
      zIndex: 0,
      alignItems: "center",
      width: "100%",
      opacity: 0.13,
      userSelect: "none",
      pointerEvents: "none",
    },
    watermarkImage: {
      width: 650,
      height: 250,
      margin: "auto",
      objectFit: "contain",
      opacity: 0.16,
    },
    watermarkContractNumber: {
      position: "absolute",
      top: "60%",
      left: 0,
      right: 0,
      zIndex: 0,
      textAlign: "center",
      width: "100%",
      opacity: 0.22,
      fontSize: 36,
      fontWeight: 700,
      color: "#3F3F46",
      fontFamily: "Courier",
      letterSpacing: 2,
      transform: "rotate(0deg)",
      userSelect: "none",
      pointerEvents: "none",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
      width: "100%",
    },
    logoSlot: {
      width: 110,
      height: 55,
      margin: 0,
      padding: 0,
    },
    logoImage: {
      width: 110,
      height: 55,
      objectFit: "contain",
      opacity: 0.75,
      margin: 0,
      padding: 0,
    },
    titleContainer: {
      flexGrow: 1,
      flexBasis: 0,
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
      textAlign: "center",
      marginLeft: 12,
      marginRight: 12,
    },
    title: {
      fontSize: 11,
      textAlign: "center",
      fontWeight: 700,
    },
    section: {
      marginBottom: sectionMarginBottom,
    },
    closingSection: {
      marginBottom: sectionMarginBottom,
      minPresenceAhead: closingMinPresenceAhead,
    },
    justified: {
      textAlign: "justify",
    },
    clauseTitle: {
      fontSize: fontSize > 8.5 ? fontSize - 0.5 : 8,
      fontWeight: 700,
      marginTop: clauseTitleMarginTop,
      marginBottom: 3,
      // Ensure the clause title always has content below it on the same page
      minPresenceAhead: 40,
    },
    signatureSection: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginTop: signatureMarginTop,
    },
    signatureBox: {
      width: "45%",
      borderTop: "1px solid #000",
      minHeight: 40,
      paddingTop: 10,
      marginTop: 10,
      marginBottom: signatureBoxMarginBottom,
    },
    signatureText: {
      fontSize: 7,
      lineHeight: 1.3,
      textAlign: "center",
    },
    signatureSubText: {
      fontSize: 7,
      lineHeight: 1.3,
      textAlign: "center",
    },
    dataInput: {
      fontSize: fontSize > 8.5 ? fontSize - 0.5 : 8,
      fontWeight: 900,
      minWidth: 60,
      lineHeight: 1.4,
    },
    bold: {
      fontWeight: "bold",
    },
    marginBottomSmall: {
      marginBottom: 6,
    },
    footerContainer: {
      position: "absolute",
      bottom: 0,
      left: 50,
      right: 50,
      borderTopWidth: 0.5,
      borderTopColor: "#A1A1AA",
      paddingTop: 5,
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    footerTextContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      paddingRight: 12,
    },
    footerAddress: {
      fontSize: 7.5,
      color: "#1F2937",
      marginBottom: 2,
      lineHeight: 1.25,
    },
    footerDetails: {
      fontSize: 7,
      color: "#4B5563",
      lineHeight: 1.25,
    },
    footerSubDetails: {
      fontSize: 6.5,
      color: "#6B7280",
      marginTop: 2,
      lineHeight: 1.2,
    },
    footerQrContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },
    qrFooter: {
      width: 36,
      height: 36,
      objectFit: "contain",
    },
    qrFooterText: {
      fontSize: 6,
      color: "#4B5563",
      marginTop: 1,
      textAlign: "center",
      letterSpacing: 0.5,
    },
  });
}

export const contratoStyles = getContratoStyles();

