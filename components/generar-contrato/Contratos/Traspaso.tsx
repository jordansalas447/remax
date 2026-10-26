import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import {
  ContratoFirmas,
  ContratoFooter,
  ContratoHeader,
  ContratoWatermark,
  contratoStyles as styles,
  listaPropietarios,
  val,
  type ContratoPDFProps,
} from "./shared";
import { ContratoCabezera } from "./shared/ContratoCabezera";

export type { ContratoPDFProps, Propietario } from "./shared";

export function TraspasoPDF({
  nroContrato,
  nroPropietarios,
  logoIzquierdo,
  logoDerecho,
  logoMarcadeAgua,
  logosEnTodasLasPaginas = false,
  propietarios,
  qr,
  fecha_generacion,
  id_publico,
  nombreAsesor = "_____________________________________________",
  inmuebleDireccion = "__________________________________________________",
  inmuebleDistrito = "_______________",
  inmueblePartida = "______________________",
  nombreNegocio = "___________",
  giroNegocio = "_____________",
  comision = "____",
  duracionMeses = "_____",
  diaFirma = "_____",
  mesFirma = "_____________________",
  anoFirma = "2026",
}: ContratoPDFProps) {
  const { varios, lista } = listaPropietarios(nroPropietarios, propietarios);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ContratoWatermark nroContrato={nroContrato} logoMarcadeAgua={logoMarcadeAgua} />
        <ContratoHeader
          nroContrato={nroContrato}
          logoIzquierdo={logoIzquierdo}
          logoDerecho={logoDerecho}
          logosEnTodasLasPaginas={logosEnTodasLasPaginas}
        />

        {/* Introducción personalizada */}
        <ContratoCabezera varios={varios} lista={lista} tipodenominacion={"EL CLIENTE"} mostrarOcupacion={true}></ContratoCabezera>

        {/* Primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>PRIMERA:</Text>
          </Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>EL CLIENTE</Text> es el dueño de un local comercial de <Text style={styles.dataInput}>__________________________________</Text> llamado “ <Text style={styles.dataInput}>________________________</Text> ” ubicado en: <Text style={styles.dataInput}>____________________________________________________________________</Text> , distrito de <Text style={styles.dataInput}>______________</Text>, provincia y departamento de <Text style={styles.bold}>AREQUIPA</Text>, y al que en lo sucesivo se le denominará <Text style={styles.bold}>EL LOCAL COMERCIAL</Text>.
          </Text>
        </View>

        {/* Segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>SEGUNDA:</Text>
          </Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>EL COMISIONISTA</Text> es una persona jurídica de derecho privado, cuya función principal es la actividad de corretaje de toda clase de bienes inmuebles, y las demás actividades derivadas de la misma función, según consta en el objeto social de la empresa mencionada en la introducción del presente documento.
          </Text>
        </View>

        {/* Tercera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>TERCERA:</Text>
          </Text>
          <Text style={styles.justified}>
            Por medio del presente acuerdo, <Text style={styles.bold}>EL CLIENTE</Text> otorga a <Text style={styles.bold}>EL COMISIONISTA</Text> a partir de la firma del presente documento, la representación comercial para el <Text style={styles.bold}>TRASPASO</Text> de <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> descrito en la cláusula primera del presente contrato, en la modalidad de <Text style={styles.bold}>EXCLUSIVIDAD</Text>, gestión que será realizada por El Asesor Sr./Sra./Srta: <Text style={styles.dataInput}> _________________________________________________</Text>, <Text style={styles.bold}>EL COMISIONISTA</Text> iniciará el proceso de búsqueda de posibles compradores, de acuerdo con los términos que se establezcan en las cláusulas del presente contrato, siendo <Text style={styles.bold}>EL COMISIONISTA</Text> y su grupo de trabajo, las únicas personas autorizadas para promover <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> dentro de los medios que se enunciarán en la cláusula siguiente, no pudiendo <Text style={styles.bold}>EL CLIENTE</Text> contratar con otra empresa o persona que se dedique al corretaje inmobiliario, dentro del plazo de duración del presente documento.
          </Text>
        </View>

        {/* Cuarta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>CUARTA:</Text>
          </Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>EL COMISIONISTA</Text> se compromete a listar <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> dentro de la web de <Text style={styles.bold}>RE/MAX PERÚ</Text> (www.remax.pe), y a promocionarla según lo convenido con <Text style={styles.bold}>EL CLIENTE</Text>, utilizando las diferentes herramientas con las que cuenta <Text style={styles.bold}>EL COMISIONISTA</Text> para este fin, así como informar a <Text style={styles.bold}>EL CLIENTE</Text> de los posibles interesados y los oferentes que tenga para <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> en traspaso. Asimismo, y por tratarse de un contrato en <Text style={styles.bold}>EXCLUSIVIDAD</Text>, <Text style={styles.bold}>EL COMISIONISTA</Text> se compromete al cumplimiento de las actividades de <Text style={styles.bold}>MARKETING</Text> para propiedades en exclusividad, las cuales son previamente comunicadas a <Text style={styles.bold}>EL CLIENTE</Text>.
          </Text>
        </View>

        {/* Quinta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>QUINTA:</Text>
          </Text>
          <Text style={styles.justified}>
            Que, a consecuencia del presente acuerdo, <Text style={styles.bold}>EL CLIENTE</Text> se compromete a brindar todas las facilidades para mostrar <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> y a entregar a <Text style={styles.bold}>EL COMISIONISTA</Text> una comisión equivalente a <Text style={styles.dataInput}>____</Text>% (no incluye <Text style={styles.bold}>IGV</Text>), sobre la base del precio final de traspaso negociado por <Text style={styles.bold}>EL COMISIONISTA</Text> con el futuro cliente interesado y previamente aceptado por <Text style={styles.bold}>EL CLIENTE</Text>. Las comisiones pactadas en la presente cláusula serán canceladas a <Text style={styles.bold}>EL COMISIONISTA</Text> al momento de la firma del Contrato de Traspaso que se genere entre <Text style={styles.bold}>EL CLIENTE</Text> y el cliente interesado que haya sido presentado por <Text style={styles.bold}>EL COMISIONISTA</Text>. Asimismo, <Text style={styles.bold}>EL CLIENTE</Text> se compromete a entregar los documentos señalados a continuación para poder iniciar el proceso de venta de <Text style={styles.bold}>EL LOCAL COMERCIAL</Text>:
          </Text>
          <View style={{ marginLeft: 14, marginTop: 4 }}>
            <Text style={styles.justified}> - Copia del documento de identidad de <Text style={styles.bold}>EL CLIENTE</Text></Text>
            <Text style={styles.justified}> - Contrato de arrendamiento del inmueble donde funciona <Text style={styles.bold}>EL LOCAL COMERCIAL</Text>.</Text>
            <Text style={styles.justified}> - Cualquier otro documento que sea solicitado por el <Text style={styles.bold}>AGENTE RESPONSABLE</Text> del manejo de la <Text style={styles.bold}>PROPIEDAD</Text> y que sea necesario para la consecución del objeto del presente contrato.</Text>
          </View>
        </View>

        {/* Sexta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>SEXTA:</Text>
          </Text>
          <Text style={styles.justified}>
            El plazo de duración del presente acuerdo será de <Text style={styles.dataInput}>_____</Text> meses contados a partir de la fecha consignada al final del presente documento. Las partes podrán renovar este contrato por mutuo acuerdo, debiendo realizarlo de manera escrita.
          </Text>
        </View>

        {/* Séptima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>SÉPTIMA:</Text>
          </Text>
          <Text style={styles.justified}>
            El presente contrato quedará resuelto automáticamente y sin necesidad de documento alguno, al vencimiento del mismo, salvo acuerdo de renovación de las partes. De igual manera en el caso que <Text style={styles.bold}>EL COMISIONISTA</Text> consiga el objetivo de realizar el traspaso de <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> en un plazo menor a los <Text style={styles.dataInput}>____</Text> meses, el contrato quedará resuelto en el momento que ambas partes hayan cumplido con las obligaciones adquiridas por el presente documento.
          </Text>
        </View>

        {/* Octava cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>OCTAVA:</Text>
          </Text>
          <Text style={styles.justified}>
            Toda negociación para llegar a el <Text style={styles.bold}>TRASPASO</Text> de <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> deberá ser manejada exclusivamente por <Text style={styles.bold}>EL COMISIONISTA</Text> o algún miembro de su equipo de <Text style={styles.bold}>AGENTES INMOBILIARIOS</Text> debidamente capacitado y autorizado. Cualquier propuesta a la que se llegue en la negociación deberá ser previamente aceptada por <Text style={styles.bold}>EL CLIENTE</Text> antes de su comunicación al futuro cliente interesado.
          </Text>
        </View>

        {/* Novena cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>NOVENA:</Text>
          </Text>
          <Text style={styles.justified}>
            En el caso que algún cliente que haya conocido <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> por gestión de <Text style={styles.bold}>EL COMISIONISTA</Text> y esté debidamente registrado por éste, lo traspase después del vencimiento del presente acuerdo y haya sido negociado en forma directa con <Text style={styles.bold}>EL CLIENTE</Text>, las partes acuerdan que éste quedará obligado a hacer la cancelación de la comisión pactada en el presente documento a <Text style={styles.bold}>EL COMISIONISTA</Text>. Esta obligación será respetada por el plazo de <Text style={styles.dataInput}>___</Text> meses una vez vencido el presente documento.
          </Text>
        </View>

        {/* Décima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>DÉCIMA:</Text>
          </Text>
          <View>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.1 Por el presente contrato <Text style={styles.bold}>EL CLIENTE</Text> manifiesta su voluntad expresa de <Text style={styles.bold}>TRASPASAR</Text> <Text style={styles.bold}>EL LOCAL COMERCIAL</Text>, declarando, asimismo, que <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> se encuentra en óptimas condiciones físicas y legales para ser traspasado.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.2 En el supuesto caso que <Text style={styles.bold}>EL CLIENTE</Text> luego de haber aceptado de manera escrita al cliente interesado presentado por <Text style={styles.bold}>EL COMISIONISTA</Text> y desista continuar con la celebración del Contrato de <Text style={styles.bold}>TRASPASO</Text>, se le aplicará una penalidad correspondiente al <Text style={styles.bold}>50%</Text> del monto de la comisión pactada del traspaso fijado para <Text style={styles.bold}>EL LOCAL COMERCIAL</Text>.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.3 En el supuesto caso que <Text style={styles.bold}>EL CLIENTE</Text> decida no continuar con el presente contrato estando el mismo vigente, se les aplicará una penalidad correspondiente al <Text style={styles.bold}>25%</Text> del monto de la comisión pactada del traspaso fijado para <Text style={styles.bold}>EL LOCAL COMERCIAL</Text>, como consecuencia del incumplimiento de su obligación.
            </Text>
            <Text style={styles.justified}>
              10.4 En el supuesto caso que <Text style={styles.bold}>EL CLIENTE</Text> realice el <Text style={styles.bold}>TRASPASO</Text> de <Text style={styles.bold}>EL LOCAL COMERCIAL</Text> por su cuenta incumpliendo la cláusula tercera del presente contrato, éste deberá pagar el total de la comisión señalada en la cláusula quinta de acuerdo al monto del traspaso del contrato celebrado por <Text style={styles.bold}>EL CLIENTE</Text>.
            </Text>
          </View>
        </View>

        {/* Décima primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>DÉCIMO PRIMERA:</Text>
          </Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>RESOLUCIÓN DE CONTROVERSIAS:</Text> En caso de presentarse alguna controversia relacionada con el presente contrato, las partes acuerdan someterse a los procesos de <Text style={styles.bold}>ARBITRAJE</Text>, o resolver la controversia a través de los <Text style={styles.bold}>JUECES</Text> y <Text style={styles.bold}>TRIBUNALES</Text> del <Text style={styles.bold}>DISTRITO JUDICIAL DE AREQUIPA</Text>, para lo cual señalan como sus domicilios los indicados en la introducción del presente documento. Los costos correrán por cuenta de la parte que resulte vencida.
          </Text>
        </View>

        {/* Décima segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>
            <Text style={styles.bold}>DÉCIMO SEGUNDA:</Text>
          </Text>
          <Text style={styles.justified}>
            Las partes reconocen que han leído y entienden este acuerdo y aceptan voluntariamente los derechos y las obligaciones dispuestas y juntos firmamos por duplicado el día <Text style={styles.dataInput}>_____</Text> del mes de <Text style={styles.dataInput}>__________________</Text> del año <Text style={styles.bold}>_____</Text>.
          </Text>
        </View>
   

        <ContratoFirmas lista={lista} varios={varios} tipodenominacion="EL CLIENTE" />
        <ContratoFooter qr={qr} fecha_creacion={fecha_generacion} id_publico={id_publico} />
      </Page>
    </Document>
  );
}