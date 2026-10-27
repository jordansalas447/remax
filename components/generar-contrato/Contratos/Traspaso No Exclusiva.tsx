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

export function TraspasoExlusivaPDF({
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
  nombreAsesor = "_________________________________________________",
  inmuebleDireccion = "____________________________________________________________________",
  inmuebleDistrito = "______________",
  nombreNegocio = "________________________",
  giroNegocio = "__________________________________",
  comision = "____",
  duracionMeses = "____",
  mesesObligacionPostVencimiento = "____",
  diaFirma = "_____",
  mesFirma = "________________",
  anoFirma = "____",
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
            <Text style={styles.bold}><Text>PRIMERA:</Text></Text>
          </Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> es el dueño de un local comercial de <Text style={styles.dataInput}>{giroNegocio}</Text> llamado “ <Text style={styles.dataInput}>{nombreNegocio}</Text> ” ubicado en: <Text style={styles.dataInput}>{inmuebleDireccion}</Text> , distrito de <Text style={styles.dataInput}>{inmuebleDistrito}</Text>, provincia y departamento de Arequipa, y al que en lo sucesivo se le denominará <Text style={styles.bold}><Text>EL LOCAL COMERCIAL</Text></Text>.
          </Text>
        </View>

        {/* Segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>SEGUNDA:</Text></Text></Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> es una persona jurídica de derecho privado, cuya función principal es la actividad de corretaje de toda clase de bienes inmuebles, y las demás actividades derivadas de la misma función, según consta en el objeto social de la empresa mencionada en la introducción del presente documento.
          </Text>
        </View>

        {/* Tercera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>TERCERA:</Text></Text></Text>
          <Text style={styles.justified}>
            Por medio del presente acuerdo, <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> otorga a <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> a partir de la firma del presente documento, la representación comercial para el <Text style={styles.bold}><Text>TRASPASO</Text></Text> de <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text> descrito en la cláusula primera del presente contrato, en la modalidad de <Text style={styles.bold}><Text>NO  EXCLUSIVIDAD</Text></Text>, gestión que será realizada por El Asesor Sr./Sra./Srta.:<Text style={styles.dataInput}>{nombreAsesor}</Text> , <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> iniciará el proceso de búsqueda de posibles compradores, de acuerdo con los términos que se establezcan en las cláusulas del presente contrato.
          </Text>
        </View>

        {/* Cuarta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>CUARTA:</Text></Text></Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> se compromete a listar <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text> dentro de la web de <Text style={styles.bold}><Text>RE/MAX Perú</Text></Text> (www.remax.pe), y a promocionarla según lo convenido con <Text style={styles.bold}><Text>EL CLIENTE</Text></Text>, utilizando las diferentes herramientas con las que cuenta <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> para este fin, así como informar a <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> de los posibles interesados y los oferentes que tenga para <Text style={styles.bold}><Text>EL LOCAL COMERCIAL</Text></Text> en traspaso. Asimismo, y por tratarse de un contrato en no exclusividad, <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> se compromete al cumplimiento de las actividades de Marketing para propiedades en no exclusividad, las cuales son previamente comunicadas a <Text style={styles.bold}><Text>EL CLIENTE</Text></Text>.
          </Text>
        </View>

        {/* Quinta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>QUINTA:</Text></Text></Text>
          <Text style={styles.justified}>
            Que, a consecuencia del presente acuerdo, <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> se compromete a brindar todas las
            facilidades para mostrar <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text> y a entregar a <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> una comisión equivalente a <Text style={styles.dataInput}>{comision}</Text> % (no incluye IGV), sobre la base del precio final de traspaso negociado por <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> con el futuro cliente interesado y previamente aceptado por <Text style={styles.bold}><Text>EL CLIENTE</Text></Text>. Las comisiones pactadas en la presente cláusula serán canceladas a <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> al momento de la firma del Contrato de Traspaso que se genere entre <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> y <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> interesado que haya sido presentado por <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text>. Asimismo, <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> se compromete a entregar los documentos señalados a continuación para poder iniciar el proceso de venta de <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text>:
          </Text>
          <View style={{ marginLeft: 14, marginTop: 4 }}>
            <Text style={styles.justified}>- Copia del documento de identidad de <Text style={styles.bold}><Text>EL CLIENTE</Text></Text></Text>
            <Text style={styles.justified}>- Contrato de arrendamiento del inmueble donde funciona <Text style={styles.bold}><Text>EL LOCAL COMERCIAL</Text></Text>.</Text>
            <Text style={styles.justified}>- Cualquier otro documento que sea solicitado por el Agente Responsable del manejo de la Propiedad y que sea necesario para la consecución del objeto del presente contrato.</Text>
          </View>
        </View>

        {/* Sexta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>SEXTA:</Text></Text></Text>
          <Text style={styles.justified}>
            El plazo de duración del presente acuerdo será de <Text style={styles.dataInput}>{duracionMeses}</Text> meses contados a partir de la fecha consignada al final del presente documento. Las partes podrán renovar este contrato por mutuo acuerdo, debiendo realizarlo de manera escrita.
          </Text>
        </View>

        {/* Séptima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>SETIMA:</Text></Text></Text>
          <Text style={styles.justified}>
            El presente contrato quedará resuelto automáticamente y sin necesidad de documento alguno, al vencimiento del mismo, salvo acuerdo de renovación de las partes.
            De igual manera en el caso que <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> consiga el objetivo de vender <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text> en un plazo menor a los <Text style={styles.dataInput}>{duracionMeses}</Text> meses, el contrato quedará resuelto en el momento que ambas partes hayan cumplido con las obligaciones adquiridas por el presente documento.
          </Text>
        </View>

        {/* Octava cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>OCTAVA:</Text></Text></Text>
          <Text style={styles.justified}>
            Toda negociación para llegar a el Traspaso de <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text> deberá ser manejada por <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> o algún miembro de su equipo de Agentes Inmobiliarios debidamente capacitado y autorizado. Cualquier propuesta a la que se llegue en la negociación deberá ser previamente aceptada por <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> antes de su comunicación al futuro cliente interesado.
          </Text>
        </View>

        {/* Novena cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>NOVENA:</Text></Text></Text>
          <Text style={styles.justified}>
            En el caso que algún cliente que haya conocido <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text> por gestión de <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> y esté debidamente registrado por éste, lo Traspase después del vencimiento del presente acuerdo y haya sido negociado en forma directa con <Text style={styles.bold}><Text>EL CLIENTE</Text></Text>, las partes acuerdan que éste quedará obligado a hacer la cancelación de la comisión pactada en el presente documento a <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text>. Esta obligación será respetada por el plazo de <Text style={styles.dataInput}>{mesesObligacionPostVencimiento}</Text> meses una vez vencido el presente documento.
          </Text>
        </View>

        {/* Décima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>DECIMA:</Text></Text></Text>
          <View>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.1 Por el presente contrato <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> manifiesta su voluntad expresa de traspasar <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text>, declarando, asimismo, que el inmueble se encuentra en óptimas condiciones físicas y legales para ser traspasado.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.2 En el supuesto caso que <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> luego de haber aceptado de manera escrita al cliente interesado presentado por <Text style={styles.bold}><Text>EL COMISIONISTA</Text></Text> y desista continuar con la celebración del Contrato de Traspaso, se le aplicará una penalidad correspondiente al 50% del monto de la comisión pactada del traspaso fijado para <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text>.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.3 En el supuesto caso que <Text style={styles.bold}><Text>EL CLIENTE</Text></Text> decida no continuar con el presente contrato estando el mismo vigente, se les aplicará una penalidad correspondiente al 25% del monto de la comisión pactada del traspaso fijado para <Text style={styles.bold}><Text>EL INMUEBLE</Text></Text>, como consecuencia del incumplimiento de su obligación.
            </Text>
          </View>
        </View>

        {/* Décima primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>DECIMO PRIMERA:</Text></Text></Text>
          <Text style={styles.justified}>
            Resolución de controversias: En caso de presentarse alguna controversia relacionada con el presente contrato, las partes acuerdan someterse a los procesos de arbitraje, o resolver la controversia a través de los jueces y tribunales del Distrito Judicial de Arequipa, para lo cual señalan como sus domicilios los indicados en la introducción del presente documento. Los costos correrán por cuenta de la parte que resulte vencida. 
          </Text>
        </View>

        {/* Décima segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}><Text>DECIMO SEGUNDA:</Text></Text></Text>
          <Text style={styles.justified}>
            Las partes reconocen que han leído y entienden este acuerdo y aceptan voluntariamente los derechos y las obligaciones dispuestas y juntos firmamos por duplicado el día <Text style={styles.dataInput}>{diaFirma}</Text> del mes de <Text style={styles.dataInput}>{mesFirma}</Text> del año <Text style={styles.dataInput}>{anoFirma}</Text>.
          </Text>
        </View>
   

        <ContratoFirmas lista={lista} varios={varios} tipodenominacion="EL CLIENTE" />
        <ContratoFooter qr={qr} fecha_creacion={fecha_generacion} id_publico={id_publico} />
      </Page>
 
    </Document>
  );
}