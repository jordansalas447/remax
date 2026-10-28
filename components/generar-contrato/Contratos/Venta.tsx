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

export type { ContratoPDFProps, Propietario } from "./shared";

export function VentaPDF({
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
  nombreAsesor = "____________________________________________",
  inmuebleDireccion = "__________________________________________________",
  inmuebleDistrito = "_______________",
  inmuebleProvincia = "______________",
  inmuebleDepartamento = "______________",
  inmueblePartida = "______________",
  comision = "________________________",
  duracionMeses = "____",
  diaFirma = "____",
  mesFirma = "________________",
  anoFirma = "______",
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


        {/* Introducción */}
        <View style={styles.section}>
          <Text style={styles.justified}>
            Conste por el presente documento, el contrato de corretaje inmobiliario, que celebran de una parte {varios ? "los" : "el"} Sr./Sra:{" "}
            {lista.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 ? (i === lista.length - 1 ? "; y " : "; ") : ""}
                {i > 0 ? "el Sr./Sra: " : ""}
                <Text style={styles.dataInput}>
                  {val(p.nombre, "____________________________")}
                </Text>
                {" "}, debidamente identificado(a) con DNI N°{" "}
                <Text style={styles.dataInput}>{val(p.dni, "_____________ ,")}</Text>{" "}estado civil{" "}
                <Text style={styles.dataInput}>{val(p.estadoCivil, "__________________ ,")}</Text>{" "}número de celular{" "}
                <Text style={styles.dataInput}>{val(p.celular, "_______________ ,")}</Text>{" "}con domicilio para estos efectos en{" "}
                <Text style={styles.dataInput}>
                  {val(p.domicilio, "__________________________________________________ ,")}
                </Text>
                {" "}distrito de{" "}
                <Text style={styles.dataInput}>{val(p.distrito, "_______________ , ")}</Text>{" "}provincia y departamento de Arequipa
              </React.Fragment>
            ))}
            , y a {varios ? "quienes" : "quien"} en adelante se {varios ? "les denominará conjuntamente" : "le denominará"} como <Text style={styles.bold}>EL PROPIETARIO</Text>; y de la otra parte, la empresa <Text style={styles.bold}>ADELANTE ASESORES INMOBILIARIOS SAC.</Text> Comercialmente conocida como <Text style={styles.bold}>(REMAX ADELANTE)</Text> con <Text style={styles.bold}>RUC Nro. 20612674192</Text> con domicilio en <Text style={styles.bold}>Urbanización Santo Domingo Segunda Etapa, Quinta Estancia Mz. A, Lote 2 (Av. Lambramani)</Text> , distrito de <Text style={styles.bold}>José Luis Bustamante y Rivero</Text> , Provincia y Departamento de <Text style={styles.bold}>Arequipa</Text> ; debidamente representada por su Representante Legal, la señora Janelly Hurtado López, debidamente identificado con DNI Nº 44309957, y poderes inscritos en la Partida N° 11450349 del Registro de Personas Jurídicas de Arequipa a quien en adelante se le denominará <Text style={styles.bold}>EL COMISIONISTA</Text>; en los términos y condiciones de las cláusulas siguientes:
          </Text>
        </View>

        {/* Primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>PRIMERA:</Text></Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>EL PROPIETARIO</Text> es dueño del inmueble ubicado en
            {" "}
            <Text style={styles.dataInput}>{inmuebleDireccion}</Text>
            {" , distrito de "}
            <Text style={styles.dataInput}>{inmuebleDistrito}</Text>
            {" , provincia "}
            <Text style={styles.dataInput}>{inmuebleProvincia}</Text>
            {" y departamento de "}
            <Text style={styles.dataInput}>{inmuebleDepartamento}</Text>
            {" , cuyos linderos y medidas perimétricas constan inscritos en la Partida Electrónica N° "}
            <Text style={styles.dataInput}>{inmueblePartida}</Text>
            {" del Registro de Predios de la Zona Registral XII - Sede Arequipa y al que en lo sucesivo se le denominará "}
            <Text style={styles.bold}>EL INMUEBLE.</Text>
          </Text>
        </View>

        {/* Segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>SEGUNDA:</Text></Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>EL COMISIONISTA</Text> es una persona jurídica de derecho privado, cuya función principal es la actividad de corretaje de toda clase de bienes inmuebles, y las demás actividades derivadas de la misma función, según consta en el objeto social de la empresa mencionada en la introducción del presente documento.
          </Text>
        </View>

        {/* Tercera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>TERCERA:</Text></Text>
          <Text style={styles.justified}>
            Por medio del presente acuerdo, <Text style={styles.bold}>EL PROPIETARIO</Text> otorga a <Text style={styles.bold}>EL COMISIONISTA</Text> a partir de la firma del presente documento, la representación comercial para la <Text style={styles.bold}>VENTA</Text> de <Text style={styles.bold}>EL INMUEBLE</Text> descrito en la cláusula primera del presente contrato, en la modalidad de <Text style={styles.bold}>EXCLUSIVIDAD</Text>, gestión que será realizada por El Asesor Sr./Sra./Srta.:{" "}
            <Text style={styles.dataInput}>{nombreAsesor}</Text>
            {"; "}
            <Text style={styles.bold}>EL COMISIONISTA</Text> iniciará el proceso de búsqueda de posibles compradores, de acuerdo con los términos que se establezcan en las cláusulas del presente contrato, siendo <Text style={styles.bold}>EL COMISIONISTA</Text> y su grupo de trabajo, las únicas personas autorizadas para promover <Text style={styles.bold}>EL INMUEBLE</Text>  dentro de los medios que se enunciarán en la cláusula siguiente, no pudiendo <Text style={styles.bold}>EL PROPIETARIO</Text> contratar con otra empresa o persona que se dedique al <Text style={styles.bold}>CORRETAJE INMOBILIARIO</Text>, dentro del plazo de duración del presente documento.
          </Text>
        </View>

        {/* Cuarta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>CUARTA:</Text></Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>EL COMISIONISTA</Text> se compromete a listar <Text style={styles.bold}>EL INMUEBLE</Text> dentro de la web de <Text style={styles.bold}>RE/MAX PERÚ</Text>
            {" (www.remax.pe), y a promocionarla según lo convenido con "}
            <Text style={styles.bold}>EL PROPIETARIO</Text>
            {", utilizando las diferentes herramientas con las que cuenta "}
            <Text style={styles.bold}>EL COMISIONISTA</Text>
            {" para este fin, así como informar a "}
            <Text style={styles.bold}>EL PROPIETARIO</Text>
            {" de los posibles interesados y los oferentes que tenga para su propiedad en venta. Asimismo, y por tratarse de un contrato en "}
            <Text style={styles.bold}>EXCLUSIVIDAD</Text>
            {", "}
            <Text style={styles.bold}>EL COMISIONISTA</Text>
            {" se compromete al cumplimiento de las actividades de Marketing para propiedades en exclusividad, las cuales son previamente comunicadas a "}
            <Text style={styles.bold}>EL PROPIETARIO</Text>
            {"."}
          </Text>
        </View>

        {/* Quinta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>QUINTA:</Text></Text>
          <Text style={styles.justified}>
            Que, a consecuencia del presente acuerdo, <Text style={styles.bold}>EL PROPIETARIO</Text> se compromete a brindar todas las facilidades para mostrar <Text style={styles.bold}>EL INMUEBLE</Text> y a entregar a <Text style={styles.bold}>EL COMISIONISTA</Text> una comisión equivalente a{" "}
            <Text style={styles.dataInput}>{comision}</Text>
            {" (no incluye IGV), sobre la base del precio final de venta negociado por "}
            <Text style={styles.bold}>EL COMISIONISTA</Text>
            {" con el futuro comprador y previamente aceptado por "}
            <Text style={styles.bold}>EL PROPIETARIO</Text>
            {". Las comisiones pactadas en la presente cláusula serán canceladas a "}
            <Text style={styles.bold}>EL COMISIONISTA</Text>
            {" al momento de la firma del Contrato de Compra-Venta que se genere entre "}
            <Text style={styles.bold}>EL PROPIETARIO</Text>
            {" y el comprador que haya sido presentado por "}
            <Text style={styles.bold}>EL COMISIONISTA</Text>
            {". Asimismo, "}
            <Text style={styles.bold}>LA PROPIETARIA</Text>
            {" se compromete a entregar los documentos señalados a continuación para poder iniciar el proceso de venta de "}
            <Text style={styles.bold}>EL INMUEBLE</Text>
            {":"}
          </Text>
          <View style={{ marginLeft: 14, marginTop: 4 }}>
            <Text style={styles.justified}>- Copia Simple de la partida registral de <Text style={styles.bold}>EL INMUEBLE</Text> actualizada con menos de 30 días.</Text>
            <Text style={styles.justified}>- Copia del documento de identidad de <Text style={styles.bold}>EL PROPIETARIO</Text></Text>
            <Text style={styles.justified}>- Copia del Testimonio de Compraventa de <Text style={styles.bold}>EL INMUEBLE</Text></Text>
            <Text style={styles.justified}>- Cualquier otro documento que sea solicitado por el Agente Responsable del manejo de la Propiedad y que sea necesario para la consecución del objeto del presente contrato.</Text>
          </View>
        </View>

        {/* Sexta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>SEXTA:</Text></Text>
          <Text style={styles.justified}>
            El plazo de duración del presente acuerdo será de <Text style={styles.dataInput}>{duracionMeses}</Text> meses contados a partir de la fecha consignada al final del presente documento. Las partes podrán renovar este contrato por mutuo acuerdo, debiendo realizarlo de manera escrita.
          </Text>
        </View>

        {/* Séptima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>SÉTIMA:</Text></Text>
          <Text style={styles.justified}>
            El presente contrato quedará resuelto automáticamente y sin necesidad de documento alguno, al vencimiento del mismo, salvo acuerdo de renovación de las partes. De igual manera en el caso que <Text style={styles.bold}>EL COMISIONISTA</Text> consiga el objetivo de vender <Text style={styles.bold}>EL INMUEBLE</Text> en un plazo menor a los <Text style={styles.dataInput}>{duracionMeses}</Text> meses, el contrato quedará resuelto en el momento que ambas partes hayan cumplido con las obligaciones adquiridas por el presente documento.
          </Text>
        </View>

        {/* Octava cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>OCTAVA:</Text></Text>
          <Text style={styles.justified}>
            Toda negociación para llegar a la venta de <Text style={styles.bold}>EL INMUEBLE</Text> deberá ser manejada exclusivamente por <Text style={styles.bold}>EL COMISIONISTA</Text> o algún miembro de su equipo de Agentes Inmobiliarios debidamente capacitado y autorizado. Cualquier propuesta a la que se llegue en la negociación deberá ser previamente aceptada por <Text style={styles.bold}>EL PROPIETARIO</Text> antes de su comunicación al futuro comprador.
          </Text>
        </View>

        {/* Novena cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>NOVENA:</Text></Text>
          <Text style={styles.justified}>
            En el caso que algún cliente que haya conocido <Text style={styles.bold}>EL INMUEBLE</Text> por gestión de <Text style={styles.bold}>EL COMISIONISTA</Text> y esté debidamente registrado por éste, lo compre después del vencimiento del presente acuerdo y haya sido negociado en forma directa con <Text style={styles.bold}>EL PROPIETARIO</Text>, las partes acuerdan que éste quedará obligado a hacer la cancelación de la comisión pactada en el presente documento a <Text style={styles.bold}>EL COMISIONISTA</Text>. Esta obligación será respetada por el plazo de <Text style={styles.bold}>6 MESES</Text> una vez vencido el presente documento.
          </Text>
        </View>

        {/* Décima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>DÉCIMA:</Text></Text>
          <View>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.1 Por el presente contrato <Text style={styles.bold}>EL PROPIETARIO</Text> manifiesta su voluntad expresa de vender <Text style={styles.bold}>EL INMUEBLE</Text>, declarando, asimismo, que el inmueble se encuentra en óptimas condiciones físicas y legales para ser vendido.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.2 En el supuesto caso que <Text style={styles.bold}>EL PROPIETARIO</Text> luego de haber aceptado de manera escrita al comprador presentado por <Text style={styles.bold}>EL COMISIONISTA</Text> y desista continuar con la celebración del Contrato de Compraventa, se le aplicará una penalidad correspondiente al <Text style={styles.bold}>50%</Text> del precio de la comisión pactada en la cláusula <Text style={styles.bold}>QUINTA</Text>, fijado para <Text style={styles.bold}>EL INMUEBLE</Text>.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.3 En el supuesto caso que <Text style={styles.bold}>EL PROPIETARIO</Text> decida no continuar con el presente contrato estando el mismo vigente, se le aplicará una penalidad correspondiente al <Text style={styles.bold}>25%</Text> del precio de la comisión pactada en la cláusula <Text style={styles.bold}>QUINTA</Text> fijado para <Text style={styles.bold}>EL INMUEBLE</Text>, como consecuencia del incumplimiento de su obligación.
            </Text>
            <Text style={styles.justified}>
              10.4 En el supuesto caso que <Text style={styles.bold}>EL PROPIETARIO</Text> venda <Text style={styles.bold}>EL INMUEBLE</Text> por su cuenta incumpliendo la cláusula <Text style={styles.bold}>TERCERA</Text> del presente contrato, éste deberá pagar el total de la comisión señalada en la cláusula <Text style={styles.bold}>QUINTA</Text>, de acuerdo al precio de venta del contrato de compraventa celebrado por <Text style={styles.bold}>EL PROPIETARIO</Text>.
            </Text>
          </View>
        </View>

        {/* Décima primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>DÉCIMO PRIMERA:</Text></Text>
          <Text style={styles.justified}>
            <Text style={styles.bold}>RESOLUCIÓN DE CONTROVERSIAS:</Text> En caso de presentarse alguna controversia relacionada con el presente contrato, las partes acuerdan someterse a los procesos de arbitraje, o resolver la controversia a través de los jueces y tribunales del <Text style={styles.bold}>DISTRITO JUDICIAL DE AREQUIPA</Text>, para lo cual señalan como sus domicilios los indicados en la introducción del presente documento. Los costos correrán por cuenta de la parte que resulte vencida.
          </Text>
        </View>

        {/* Décima segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}><Text style={styles.bold}>DÉCIMO SEGUNDA:</Text></Text>
          <Text style={styles.justified}>
            Las partes reconocen que han leído y entienden este acuerdo y aceptan voluntariamente los derechos y las obligaciones dispuestas y juntos firmamos por duplicado el día <Text style={styles.dataInput}>{diaFirma}</Text> del mes de <Text style={styles.dataInput}>{mesFirma}</Text> del año <Text style={styles.dataInput}>{anoFirma}</Text>.
          </Text>
        </View>


        <ContratoFirmas lista={lista} varios={varios} />
        <ContratoFooter qr={qr} fecha_creacion={fecha_generacion} id_publico={id_publico} />
      </Page>
    </Document>
  );
}