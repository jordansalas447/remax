import React from "react";
import path from "path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Desactiva la separación de palabras con guion.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 84, // más espacio para el footer
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 11,
    lineHeight: 1.5,
    position: "relative",
    minHeight: '100%',
    height: '100%',
  },
  // Marca de agua
  watermark: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    zIndex: 0,
    textAlign: "center",
    width: "100%",
    opacity: 0.10,
    userSelect: "none",
    pointerEvents: "none",
    fontSize: 60,
    fontWeight: 900,
    color: "#005cb9",
    transform: "rotate(-18deg)",
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold"
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
    marginBottom: 10,
  },
  justified: {
    textAlign: "justify",
  },
  clauseTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 3,
  },
  signatureSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 32,
  },
  signatureBox: {
    width: "45%",
    borderTop: "1px solid #000",
    minHeight: 40,
    paddingTop: 6,
    marginTop: 4,
    marginBottom: 36,
  },
  signatureText: {
    fontSize: 11,
    textAlign: "center",
  },
  signatureSubText: {
    fontSize: 10,
    textAlign: "center",
  },
  dataInput: {
    fontSize: 11,
    textDecoration: "underline",
    minWidth: 60,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: "bold",
  },
  marginBottomSmall: {
    marginBottom: 6,
  },
  // Footer styles
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 50,
    right: 50,
    width: "auto",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    fontSize: 10,
  },
  footerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 2,
    fontSize: 9.5,
    color: "#222",
  },
  footerWebRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
    fontSize: 10,
    color: "#191b23",
  },
  arequipaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 6,
    marginBottom: 6,
    opacity: 0.7,
  },
  arequipaLine: {
    height: 0.5,
    backgroundColor: "#222",
    flexGrow: 1,
    marginHorizontal: 10,
  },
  arequipaText: {
    marginHorizontal: 12,
    fontWeight: "bold",
    fontSize: 11,
    color: "#222",
    letterSpacing: 1,
    textAlign: "center",
  },
  // N° de contrato en pie de página
  contratoNroFooter: {
    fontSize: 9.5,
    color: "#3f4f5d",
    textAlign: "right",
    marginTop: 2,
    width: "100%",
    fontWeight: "bold",
    letterSpacing: 1.1,
  }
});

export type Propietario = {
  nombre?: string;
  dni?: string;
  estadoCivil?: string;
  celular?: string;
  domicilio?: string;
  distrito?: string;
};

export type ContratoPDFProps = {
  nroContrato: string;
  nroPropietarios?: number;
  // Logos de las esquinas superiores: URL, ruta absoluta o base64 (data URI)
  logoIzquierdo?: NonSharedBuffer;
  logoDerecho?: NonSharedBuffer;
  // Si es true, los logos se repiten en todas las páginas
  logosEnTodasLasPaginas?: boolean;
  propietarios?: Propietario[];
  nombreAsesor?: string;
  inmuebleDireccion?: string;
  inmuebleDistrito?: string;
  inmueblePartida?: string;
  comision?: string;
  duracionMeses?: string;
  diaFirma?: string;
  mesFirma?: string;
  anoFirma?: string;
};

// Devuelve el valor si existe; si no, el espacio en blanco para llenar a mano
const val = (value: string | undefined, blank: string) =>
  value && value.trim() !== "" ? value : blank;

export function ContratoPDF({
  nroContrato,
  nroPropietarios,
  logoIzquierdo,
  logoDerecho,
  logosEnTodasLasPaginas = false,
  propietarios,
  nombreAsesor = "____________________________________________",
  inmuebleDireccion = "__________________________________________________",
  inmuebleDistrito = "_______________",
  inmueblePartida = "______________",
  comision = "________________________",
  duracionMeses = "____",
  diaFirma = "____",
  mesFirma = "________________",
  anoFirma = "2026",
}: ContratoPDFProps) {
  // Si no se envía ningún propietario, se muestra uno en blanco
  const varios = nroPropietarios || 1;
  const lista: Propietario[] =  propietarios && propietarios.length > 0 ? propietarios : Array.from({ length: varios }, () => ({}));
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Marca de agua Remax Adelante y número de contrato */}
        <View style={styles.watermark} fixed>
          <Text>
            REMAX ADELANTE
            {"\n\n\n\n"}
            {nroContrato || "RAD-ANT-26-0001"}
          </Text>
        </View>
        {/* <View style={styles.watermark} fixed>
          <Text>
            {nroContrato || "RAD-ANT-26-0001"}
          </Text>
        </View> */}

        {/* Encabezado combinado: Imagen izquierda, Título centro, Imagen derecha */}
        <View style={styles.headerContainer} fixed={logosEnTodasLasPaginas}>
          <View style={styles.logoSlot}>
            {logoIzquierdo ? (
              <Image src={logoIzquierdo} style={styles.logoImage} />
            ) : null}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              AUTORIZACIÓN DE CORRETAJE INMOBILIARIO N.º {nroContrato || "RAD-ANT-26-0001"}
            </Text>
          </View>
          <View style={styles.logoSlot}>
            {logoDerecho ? (
              <Image src={logoDerecho} style={styles.logoImage} />
            ) : null}
          </View>
        </View>
        {/* Subtítulo */}
        {/* <Text style={styles.subtitle}>CONTRATO DE CORRETAJE INMOBILIARIO</Text> */}

        {/* Introducción */}
        <View style={styles.section}>
          <Text style={styles.justified}>
            Conste por el presente documento, el contrato de corretaje inmobiliario, que celebran de una parte {varios ? "los" : "el"} Sr./Sra.:{" "}
            {lista.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 ? (i === lista.length - 1 ? "; y " : "; ") : ""}
                {i > 0 ? "el Sr./Sra.: " : ""}
                <Text style={styles.dataInput}>
                  {val(p.nombre, "____________________________")}
                </Text>
                , debidamente identificado(a) con DNI N°{" "}
                <Text style={styles.dataInput}>{val(p.dni, "_____________")}</Text>, estado civil{" "}
                <Text style={styles.dataInput}>{val(p.estadoCivil, "__________________")}</Text>, número de celular{" "}
                <Text style={styles.dataInput}>{val(p.celular, "_______________")}</Text>, con domicilio para estos efectos en{" "}
                <Text style={styles.dataInput}>
                  {val(p.domicilio, "__________________________________________________")}
                </Text>
                , Distrito de{" "}
                <Text style={styles.dataInput}>{val(p.distrito, "_______________")}</Text>, provincia y departamento de Arequipa
              </React.Fragment>
            ))}
            , y a {varios ? "quienes" : "quien"} en adelante se {varios ? "les denominará conjuntamente" : "le denominará"} como <Text style={styles.bold}>EL PROPIETARIO</Text>; y de la otra parte, la empresa <Text style={styles.bold}>ADELANTE ASESORES INMOBILIARIOS SAC.</Text> Comercialmente conocida como (REMAX ADELANTE) con RUC Nro. 20612674192 con domicilio en Urbanización Santo Domingo Segunda Etapa, Quinta Estancia Mz. A, Lote 2 (Av. Lambramani), distrito de José Luis Bustamante y Rivero, Provincia y Departamento de Arequipa; debidamente representada por su Representante Legal, la señora Janelly Hurtado López, debidamente identificado con DNI Nº 44309957, y poderes inscritos en la Partida N° 11450349 del Registro de Personas Jurídicas de Arequipa a quien en adelante se le denominará <Text style={styles.bold}>EL COMISIONISTA</Text>; en los términos y condiciones de las cláusulas siguientes:
          </Text>
        </View>

        {/* Primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>PRIMERO:</Text>
          <Text style={styles.justified}>
            EL PROPIETARIO es dueña(o){varios ? "(s)" : ""} del inmueble, ubicado en{" "}
            <Text style={styles.dataInput}>{inmuebleDireccion}</Text>, Distrito de{" "}
            <Text style={styles.dataInput}>{inmuebleDistrito}</Text>, provincia y departamento de Arequipa, cuyos linderos y medidas perimétricas constan inscritos de la partida electrónica N°{" "}
            <Text style={styles.dataInput}>{inmueblePartida}</Text> en Registro de Predios de la Zona Registral XII - Sede Arequipa y al que en lo sucesivo se le denominará EL INMUEBLE.
          </Text>
        </View>

        {/* Segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SEGUNDO:</Text>
          <Text style={styles.justified}>
            EL COMISIONISTA, es una persona jurídica, de derecho privado, cuya función principal es la actividad de corretaje de toda clase de bienes inmuebles, y las demás actividades derivadas de la misma función, según consta en el objeto social de la empresa mencionada en la introducción del presente documento.
          </Text>
        </View>

        {/* Tercera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>TERCERO:</Text>
          <Text style={styles.justified}>
            Por medio del presente acuerdo, EL PROPIETARIO otorga a EL COMISIONISTA a partir de la firma del presente documento, la representación comercial para ofrecer en ANTICRESIS EL INMUEBLE descrito en la cláusula primera del presente contrato, en la modalidad de EXCLUSIVIDAD; gestión que será Realizada por el asesor comercial Sr./Srta./Sra.{" "}
            <Text style={styles.dataInput}>{nombreAsesor}</Text>. EL COMISIONISTA iniciará el proceso de búsqueda de posibles acreedores anticréticos, de acuerdo con los términos que se establezcan en las cláusulas del presente contrato; siendo EL COMISIONISTA y su grupo de trabajo, las únicas personas autorizadas para promover EL INMUEBLE dentro de los medios que se anunciarán en la cláusula siguiente, no pudiendo EL PROPIETARIO contratar con otra empresa o persona que se dediquen al corretaje inmobiliario, dentro del plazo de duración del presente documento.
          </Text>
        </View>

        {/* Cuarta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CUARTO:</Text>
          <Text style={styles.justified}>
            EL COMISIONISTA se compromete a listar EL INMUEBLE dentro de la web de RE/MAX Perú (www.remax.pe), y a promocionarla según lo convenido con EL PROPIETARIO, utilizando las diferentes herramientas con las que cuenta EL COMISIONISTA para este fin, así como informar a EL PROPIETARIO de los posibles interesados y los oferentes que tenga para su propiedad. Asimismo, y por tratarse de un contrato en exclusividad, EL COMISIONISTA se compromete al cumplimiento de las actividades de Marketing para propiedades en exclusividad, las cuales son previamente comunicadas a EL PROPIETARIO.
          </Text>
        </View>

        {/* Quinta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>QUINTO:</Text>
          <Text style={styles.justified}>
            Que a consecuencia del presente acuerdo EL PROPIETARIO se compromete a brindar todas las facilidades para mostrar EL INMUEBLE y a entregar a EL COMISIONISTA una comisión equivalente a{" "}
            <Text style={styles.dataInput}>{comision}</Text> (no incluye IGV), sobre la base del monto negociado por EL COMISIONISTA con el futuro acreedor anticrético y previamente aceptado por EL PROPIETARIO. Las comisiones pactadas en la presente cláusula serán canceladas a EL COMISIONISTA al momento de la firma del Contrato de Mutuo Anticrético que se genere entre EL PROPIETARIO con el acreedor anticrético que haya sido presentado por EL COMISIONISTA. Asimismo, EL PROPIETARIO se compromete en entregar los documentos señalados a continuación para poder iniciar el proceso de anticresis de EL INMUEBLE:
          </Text>
          <View style={{ marginLeft: 14, marginTop: 4 }}>
            <Text style={styles.justified}>- Copia Simple de la partida registral de EL INMUEBLE actualizada con menos de 30 días.</Text>
            <Text style={styles.justified}>- Copia del documento de identidad de EL PROPIETARIO</Text>
            <Text style={styles.justified}>- Copia del Testimonio de Compraventa de EL INMUEBLE</Text>
            <Text style={styles.justified}>- Cualquier otro documento que sea solicitado por el Agente Responsable del manejo de la propiedad y que sea necesario para la consecución del objeto del presente contrato.</Text>
          </View>
        </View>

        {/* Sexta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SEXTO:</Text>
          <Text style={styles.justified}>
            El plazo de duración del presente acuerdo será de <Text style={styles.dataInput}>{duracionMeses}</Text> meses contados a partir de la fecha consignada al final del presente documento.
          </Text>
        </View>

        {/* Séptima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SÉTIMA:</Text>
          <Text style={styles.justified}>
            En el caso que EL COMISIONISTA consiga el objetivo de anticretar EL INMUEBLE en un plazo menor a los <Text style={styles.dataInput}>{duracionMeses}</Text> meses, el contrato quedará resuelto en el momento que ambas partes hayan cumplido con las obligaciones adquiridas por el presente documento.
          </Text>
        </View>

        {/* Octava cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>OCTAVA:</Text>
          <Text style={styles.justified}>
            Toda negociación para llegar a la anticresis de EL INMUEBLE deberá ser manejada exclusivamente por EL COMISIONISTA o algún miembro de su equipo de Agentes Inmobiliarios debidamente capacitado y autorizado. Cualquier propuesta a la que se llegue en la negociación deberá ser previamente aceptada por EL PROPIETARIO antes de su comunicación al futuro acreedor anticrético.
          </Text>
        </View>

        {/* Novena cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>NOVENA:</Text>
          <Text style={styles.justified}>
            En el caso que algún cliente que haya conocido EL INMUEBLE por gestión de EL COMISIONISTA y esté debidamente registrado por este, lo anticrete después del vencimiento del presente acuerdo, negociando de forma directa con EL PROPIETARIO, las partes acuerdan que EL PROPIETARIO quedará obligado a hacer la cancelación de la comisión pactada en el presente documento a EL COMISIONISTA. Esta obligación será respetada por el plazo de 6 meses una vez vencido el presente documento.
          </Text>
        </View>

        {/* Décima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMA:</Text>
          <View>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.1 Por el presente contrato EL PROPIETARIO manifiesta su voluntad expresa de anticretar EL INMUEBLE, asimismo declara que el inmueble se encuentra en óptimas condiciones físicas y legales para ser otorgado en garantía anticrética.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.2 En el supuesto que EL PROPIETARIO luego de haber aceptado de manera escrita al acreedor anticrético presentado por EL COMISIONISTA y desista continuar con la celebración del Contrato de Anticresis, EL PROPIETARIO se obligan a pagar el 2% (no incluye IGV), sobre la base del monto negociado del mutuo anticrético, a favor de EL COMISIONISTA.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.3 En el supuesto caso que EL PROPIETARIO decida no continuar con el presente contrato estando el mismo vigente, se le aplicará una penalidad correspondiente al 25% del monto acordado de la comisión por el anticresis de EL INMUEBLE, como consecuencia del incumplimiento de su obligación.
            </Text>
            <Text style={styles.justified}>
              10.4 En el supuesto caso que EL PROPIETARIO anticrete EL INMUEBLE por su cuenta incumpliendo la cláusula tercera del presente contrato, éstos deberán pagar el total de la comisión señalada en la cláusula quinta de acuerdo al monto del anticresis señalado en el contrato celebrado por EL PROPIETARIO.
            </Text>
          </View>
        </View>

        {/* Décima primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMA PRIMERA:</Text>
          <Text style={styles.justified}>
            Resolución de controversias: En caso de presentarse alguna controversia relacionada con el presente acuerdo, las partes acuerdan someterse los procesos de arbitraje, o resolver la controversia a través de los jueces y tribunales del Distrito Judicial de Arequipa, para lo que señalan como sus domicilios los indicados en la introducción del presente documento. Los costos correrán por cuenta de la parte que resultare vencida.
          </Text>
        </View>

        {/* Décima segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMA SEGUNDA:</Text> 
          <Text style={styles.justified}>
            Las partes reconocen que han leído y entienden este acuerdo y aceptan voluntariamente los derechos y las obligaciones dispuestas; y juntos firmamos por duplicado el día <Text style={styles.dataInput}>{diaFirma}</Text> del mes de <Text style={styles.dataInput}>{mesFirma}</Text> del año <Text style={styles.dataInput}>{anoFirma}</Text>.
          </Text>
        </View>

        {/* Firmas: una por propietario + una para EL COMISIONISTA */}
        <View style={styles.signatureSection} wrap={false}>
          {lista.map((p, i) => (
            <View key={i} style={styles.signatureBox}>
              <Text style={styles.signatureText}>
                {varios ? `EL PROPIETARIO ${i + 1}` : "EL PROPIETARIO"}
              </Text>
              {p.nombre ? (
                <Text style={styles.signatureSubText}>{p.nombre}</Text>
              ) : null}
              {p.dni ? (
                <Text style={styles.signatureSubText}>DNI N° {p.dni}</Text>
              ) : null}
            </View>
          ))}
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>EL COMISIONISTA</Text>
            {/* <Text style={styles.signatureSubText}>
              ADELANTE ASESORES INMOBILIARIOS SAC.
            </Text> */}
          </View>
        </View>
        {/* Pie de página personalizado */}
        <View style={styles.footerContainer} fixed>
          <View style={styles.footerInfoRow}>
            <Text>Urbanización Santo Domingo Segunda Etapa, Quinta Estancia, Mz. A, Lote 2. JLByR.</Text>
            <Text>(054)-706202</Text>
          </View>
          <View style={styles.footerWebRow}>
            <Text>www.remaxadelante.com</Text>
          </View>
          <View style={styles.arequipaRow}>
            <View style={styles.arequipaLine} />
            <Text style={styles.arequipaText}>Arequipa - Perú</Text>
            <View style={styles.arequipaLine} />
          </View>
          <View>
            <Text style={styles.contratoNroFooter}>
              Contrato N.º {nroContrato || "RAD-ANT-26-0001"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}