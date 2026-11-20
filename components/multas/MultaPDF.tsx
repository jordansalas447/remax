
"use client";

import dynamic from "next/dynamic";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";

const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false }
);

export interface MultaPDFProps {
    codigo: string;
    logo: string;
    fecha: string;
    detalles: {
        descripcion: string;
        monto: number;
    }[];
    responsable: string;
    cargo: string;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#334155",
    },
    codigoCorrelativo: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#334155",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 12,
    },
    logo: {
        width: 100,
        height: 65,
        objectFit: "contain",
    },
    empresa: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#244b83",
        textAlign: "center",
        marginTop: 8,
    },
    subtitulo: {
        fontSize: 10,
        color: "#64748b",
        textAlign: "center",
        marginTop: 5,
        marginBottom: 20,
    },
    linea: {
        borderBottomWidth: 2,
        borderBottomColor: "#244b83",
        marginBottom: 20,
    },
    seccion: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 12,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#244b83",
        padding: 10,
        color: "#ffffff",
    },
    tableRow: {
        flexDirection: "row",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    descripcion: {
        flex: 1,
        paddingRight: 10,
    },
    monto: {
        width: 100,
        textAlign: "right",
    },
    totalContainer: {
        backgroundColor: "#f1f5f9",
        padding: 15,
        marginTop: 15,
        alignItems: "flex-end",
    },
    totalLabel: {
        fontSize: 10,
        color: "#64748b",
        marginBottom: 5,
    },
    total: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#244b83",
    },
    fecha: {
        marginTop: 25,
        fontSize: 10,
    },
    firmaContainer: {
        marginTop: 100,
        alignItems: "center",
    },
    firmaLinea: {
        width: 220,
        borderTopWidth: 1,
        borderTopColor: "#334155",
        marginBottom: 8,
    },
    firmaNombre: {
        fontWeight: "bold",
        fontSize: 10,
    },
    firmaCargo: {
        fontSize: 9,
        color: "#64748b",
        marginTop: 4,
    },
    footer: {
        position: "absolute",
        bottom: 25,
        left: 40,
        right: 40,
        textAlign: "center",
        fontSize: 8,
        color: "#94a3b8",
    },
});

export function MultaPDFDocument({
    codigo,
    logo,
    fecha,
    detalles,
    responsable,
    cargo,
}: MultaPDFProps) {
    const total = detalles.reduce(
        (sum, item) => sum + item.monto,
        0
    );

    return (
        <Document title={`Multa ${codigo}`}>
            <Page size="A4" style={styles.page}>

                {/* CÓDIGO CORRELATIVO */}

                <Text style={styles.codigoCorrelativo}>
                    N.º MULTA: {codigo}
                </Text>

                {/* LOGO */}
                <View style={styles.logoContainer}>
                    {logo ? <Image src={logo} style={styles.logo} /> : null}
                    <Text style={styles.empresa}>
                        RE/MAX ADELANTE
                    </Text>
                </View>

                <Text style={styles.subtitulo}>
                    NOTIFICACIÓN DE MULTA
                </Text>

                <View style={styles.linea} />

                {/* DETALLE */}
                <Text style={styles.seccion}>
                    DETALLE DE LA MULTA
                </Text>

                {/* CABECERA DE TABLA */}
                <View style={styles.tableHeader}>
                    <Text style={styles.descripcion}>
                        DESCRIPCIÓN
                    </Text>
                    <Text style={styles.monto}>
                        MONTO
                    </Text>
                </View>

                {/* REGISTROS */}
                {detalles.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.descripcion}>
                            {item.descripcion}
                        </Text>
                        <Text style={styles.monto}>
                            $ {item.monto.toFixed(2)}
                        </Text>
                    </View>
                ))}

                {/* TOTAL */}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>
                        TOTAL A PAGAR
                    </Text>
                    <Text style={styles.total}>
                        $ {total.toFixed(2)}
                    </Text>
                </View>

                {/* FECHA */}
                <Text style={styles.fecha}>
                    Fecha de emisión: {fecha}
                </Text>

                {/* FIRMA */}
                <View style={styles.firmaContainer}>
                    <View style={styles.firmaLinea} />
                    <Text style={styles.firmaNombre}>
                        {responsable}
                    </Text>
                    <Text style={styles.firmaCargo}>
                        {cargo}
                    </Text>
                </View>

                {/* PIE DE PÁGINA */}
                <Text style={styles.footer}>
                    DOCUMENTO DE CONTROL INTERNO
                </Text>

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
