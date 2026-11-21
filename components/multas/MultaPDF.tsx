"use client";

import dynamic from "next/dynamic";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Svg,
    Polygon,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import { fechaPeru } from "@/lib/utils/fecha";

Font.registerHyphenationCallback((word) => [word]);

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false }
);

export interface MultaPDFProps {
    codigo: string;
    logo: string;
    firma: string;
    fecha: string;
    detalles: {
        descripcion: string;
        monto: number;
    }[];
    responsable: string;
    cargo: string;
}

// Medidas de la hoja A5 en puntos
const W = 419.53;
const H = 595.28;

const AZUL = "#244b83";
const ROJO = "#c62828";
const GRIS = "#64748b";
const TEXTO = "#334155";

const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        color: TEXTO,
        backgroundColor: "#ffffff",
    },
    shapeTop: { position: "absolute", top: 0, left: 0 },
    shapeBottom: { position: "absolute", bottom: 0, left: 0 },

    // Textos dentro de las formas
    titulo: {
        position: "absolute",
        top: 14,
        right: 28,
        fontSize: 30,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: 3,
    },
    empresaBanda: {
        position: "absolute",
        bottom: 18,
        left: 28,
        fontSize: 11,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: 1,
    },

    content: {
        paddingTop: 20,
        paddingHorizontal: 28,
    },
    logo: {
        width: 120,
        height: 48,
        objectFit: "contain",
        objectPosition: "left",
    },

    // Bloque de información
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 52,
        marginBottom: 18,
    },
    infoLabel: {
        fontSize: 8,
        fontWeight: "bold",
        color: ROJO,
        marginBottom: 3,
        letterSpacing: 1,
    },
    infoNombre: {
        fontSize: 11,
        fontWeight: "bold",
        color: AZUL,
    },
    infoSub: {
        fontSize: 9,
        color: GRIS,
        marginTop: 2,
    },
    infoRight: {
        alignItems: "flex-end",
    },
    infoValor: {
        fontSize: 10,
        fontWeight: "bold",
        color: TEXTO,
    },

    // Tabla
    tableHeader: {
        flexDirection: "row",
        backgroundColor: AZUL,
        paddingVertical: 8,
        paddingHorizontal: 10,
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 9,
        letterSpacing: 0.5,
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    tableRowAlt: {
        backgroundColor: "#f1f5f9",
    },
    colNum: {
        width: 24,
    },
    descripcion: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        paddingRight: 10,
    },
    monto: {
        width: 80,
        textAlign: "right",
    },

    // Total
    totalWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
    },
    totalBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: ROJO,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    totalLabel: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: 1,
        marginRight: 14,
    },
    total: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
    },

    // Firma
    firmaContainer: {
        marginTop: 18,
        alignItems: "center",
    },
    firma: {
        width: 130,
        height: 44,
        objectFit: "contain",
    },
    firmaLinea: {
        width: 190,
        borderTopWidth: 1,
        borderTopColor: TEXTO,
        marginBottom: 5,
    },
    firmaNombre: {
        fontWeight: "bold",
        fontSize: 10,
        color: AZUL,
    },
    firmaCargo: {
        fontSize: 8,
        color: GRIS,
        marginTop: 2,
    },
});

export function MultaPDFDocument({
    codigo,
    logo,
    firma,
    fecha,
    detalles,
    responsable,
    cargo,
}: MultaPDFProps) {
    const total = detalles.reduce((sum, item) => sum + item.monto, 0);

    return (
        <Document title={`Multa ${codigo}`}>
            <Page size="A5" style={styles.page}>
                {/* FORMA SUPERIOR (derecha) */}
                <Svg width={W} height={60} style={styles.shapeTop}>
                    <Polygon points={`${W},0 170,0 210,60 ${W},60`} fill={AZUL} />
                    <Polygon points="170,0 155,0 195,60 210,60" fill={ROJO} />
                </Svg>
                <Text style={styles.titulo}>MULTA</Text>

                {/* FORMA INFERIOR (izquierda) */}
                <Svg width={W} height={50} style={styles.shapeBottom}>
                    <Polygon points={`0,50 250,50 215,0 0,0`} fill={AZUL} />
                    <Polygon points="250,50 265,50 230,0 215,0" fill={ROJO} />
                </Svg>
                <Text style={styles.empresaBanda}>RE/MAX ADELANTE</Text>

                <View style={styles.content}>
                    {/* LOGO */}
                    {logo ? <Image src={logo} style={styles.logo} /> : null}

                    {/* INFORMACIÓN */}
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.infoLabel}>RESPONSABLE</Text>
                            <Text style={styles.infoNombre}>{responsable}</Text>
                            <Text style={styles.infoSub}>{cargo}</Text>
                        </View>
                        <View style={styles.infoRight}>
                            <Text style={styles.infoLabel}>N° DE MULTA</Text>
                            <Text style={styles.infoValor}>{codigo}</Text>
                            <Text style={[styles.infoLabel, { marginTop: 8 }]}>
                                FECHA
                            </Text>
                            <Text style={styles.infoValor}>
                                Arequipa, {fechaPeru(fecha, "long")}
                            </Text>
                        </View>
                    </View>

                    {/* CABECERA DE TABLA */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.colNum}>N°</Text>
                        <Text style={styles.descripcion}>DESCRIPCIÓN</Text>
                        <Text style={styles.monto}>MONTO</Text>
                    </View>

                    {/* REGISTROS */}
                    {detalles.map((item, index) => (
                        <View
                            key={index}
                            wrap={false}
                            style={
                                index % 2 === 1
                                    ? [styles.tableRow, styles.tableRowAlt]
                                    : styles.tableRow
                            }
                        >
                            <Text style={styles.colNum}>
                                {String(index + 1).padStart(2, "0")}
                            </Text>
                            <Text style={styles.descripcion}>{item.descripcion}</Text>
                            <Text style={styles.monto}>$ {item.monto.toFixed(2)}</Text>
                        </View>
                    ))}

                    {/* TOTAL */}
                    <View style={styles.totalWrapper}>
                        <View style={styles.totalBox}>
                            <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
                            <Text style={styles.total}>$ {total.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* FIRMA */}
                    <View style={styles.firmaContainer} wrap={false}>
                        {firma ? <Image src={firma} style={styles.firma} /> : null}
                        <View style={styles.firmaLinea} />
                        <Text style={styles.firmaNombre}>Janelly Hurtado López</Text>
                        <Text style={styles.firmaCargo}>
                            Gerente General Remax Adelante
                        </Text>
                        <Text style={styles.firmaCargo}>DNI N° 44309957</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

export default function MultaPDF(props: MultaPDFProps) {
    return (
        <PDFViewer style={{ width: "100%", height: "750px", border: "none" }}>
            <MultaPDFDocument {...props} />
        </PDFViewer>
    );
}