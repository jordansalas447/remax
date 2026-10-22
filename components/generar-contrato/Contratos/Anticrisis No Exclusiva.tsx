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

export function AnticrisisPDFNoExclusiva({
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
  inmueblePartida = "______________",
  comision = "________________________",
  duracionMeses = "____",
  diaFirma = "____",
  mesesObligacionPostVencimiento = "_______",
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
            EL PROPIETARIO es dueña(o) del inmueble, ubicado en <Text style={styles.dataInput}>{inmuebleDireccion}</Text>, Distrito de <Text style={styles.dataInput}>{inmuebleDistrito}</Text>, provincia y departamento de Arequipa, cuyos linderos y medidas perimétricas constan inscritos en la partida electrónica N° <Text style={styles.dataInput}>{inmueblePartida}</Text> en el Registro de Predios de la Zona Registral XII - Sede Arequipa y al que en lo sucesivo se le denominará EL INMUEBLE.
          </Text>
        </View>
        {/* Segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SEGUNDO:</Text>
          <Text style={styles.justified}>
            EL COMISIONISTA, es una persona jurídica de derecho privado, cuya función principal es la actividad de corretaje de toda clase de bienes inmuebles y las demás actividades derivadas de la misma función, según consta en el objeto social de la empresa mencionada en la introducción del presente documento.
          </Text>
        </View>
        {/* Tercera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>TERCERO:</Text>
          <Text style={styles.justified}>
            Por medio del presente acuerdo, EL PROPIETARIO otorga a EL COMISIONISTA a partir de la firma del presente documento, la representación comercial para ofrecer en anticresis EL INMUEBLE descrito en la cláusula primera del presente contrato, en la modalidad de NO EXCLUSIVIDAD; gestión que será realizada por el asesor comercial Sr./Srta./Sra. <Text style={styles.dataInput}>{nombreAsesor}</Text>. EL COMISIONISTA iniciará el proceso de búsqueda de posibles acreedores anticréticos, de acuerdo con los términos que se establezcan en las cláusulas del presente contrato; siendo EL COMISIONISTA y su grupo de trabajo, y EL PROPIETARIO las únicas personas autorizadas para promover EL INMUEBLE dentro de los medios que se anunciarán en la cláusula siguiente.
          </Text>
        </View>
        {/* Cuarta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CUARTO:</Text>
          <Text style={styles.justified}>
            EL COMISIONISTA se compromete a listar EL INMUEBLE dentro de la web de RE/MAX Perú (www.remax.pe), y a promocionarlo según lo convenido con EL PROPIETARIO, utilizando las diferentes herramientas con las que cuenta EL COMISIONISTA para este fin, así como informar a EL PROPIETARIO de los posibles interesados y oferentes que tenga para su propiedad. Asimismo, y por tratarse de un contrato en no exclusividad, EL COMISIONISTA se compromete al cumplimiento de las actividades de marketing para propiedades en no exclusividad, las cuales son previamente comunicadas a EL PROPIETARIO.
          </Text>
        </View>
        {/* Quinta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>QUINTO:</Text>
          <Text style={styles.justified}>
            Que a consecuencia del presente acuerdo EL PROPIETARIO se compromete a brindar todas las facilidades para mostrar EL INMUEBLE y a entregar a EL COMISIONISTA una comisión equivalente a <Text style={styles.dataInput}>{comision}</Text> (no incluye IGV), sobre la base del monto negociado por EL COMISIONISTA con el futuro acreedor anticrético y previamente aceptado por EL PROPIETARIO. Las comisiones pactadas en la presente cláusula serán canceladas a EL COMISIONISTA al momento de la firma del Contrato de Mutuo Anticrético que se genere entre EL PROPIETARIO y el acreedor anticrético que haya sido presentado por EL COMISIONISTA. Asimismo, EL PROPIETARIO se compromete a entregar los documentos señalados a continuación para poder iniciar el proceso de anticresis de EL INMUEBLE:
          </Text>
          <View style={{ marginLeft: 14, marginTop: 4 }}>
            <Text style={styles.justified}>✓ Copia simple de la partida registral de EL INMUEBLE actualizada (menos de 30 días).</Text>
            <Text style={styles.justified}>✓ Copia del documento de identidad de EL PROPIETARIO.</Text>
            <Text style={styles.justified}>✓ Copia del testimonio de compraventa de EL INMUEBLE.</Text>
            <Text style={styles.justified}>✓ Cualquier otro documento que sea solicitado por el agente responsable del manejo de la propiedad y que sea necesario para la consecución del objeto del presente contrato.</Text>
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
            Toda negociación para llegar a la anticresis de EL INMUEBLE deberá ser manejada por EL COMISIONISTA o algún miembro de su equipo de agentes inmobiliarios debidamente capacitado y autorizado. Cualquier propuesta a la que se llegue en la negociación deberá ser previamente aceptada por EL PROPIETARIO antes de su comunicación al futuro acreedor anticrético.
          </Text>
        </View>
        {/* Novena cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>NOVENA:</Text>
          <Text style={styles.justified}>
            En el caso que algún cliente que haya conocido EL INMUEBLE por gestión de EL COMISIONISTA y esté debidamente registrado por este, lo anticrete después del vencimiento del presente acuerdo, negociando de forma directa con EL PROPIETARIO, las partes acuerdan que EL PROPIETARIO quedará obligado a hacer la cancelación de la comisión pactada en el presente documento a EL COMISIONISTA. Esta obligación será respetada por el plazo de <Text style={styles.dataInput}>{mesesObligacionPostVencimiento}</Text> meses una vez vencido el presente documento.
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
              10.2 En el supuesto que LOS PROPIETARIOS luego de haber aceptado de manera escrita al acreedor anticrético presentado por EL COMISIONISTA y desistan de continuar con la celebración del Contrato de Anticresis, LOS PROPIETARIOS se obligan a pagar el 2% (no incluye IGV), sobre la base del monto negociado del mutuo anticrético, a favor de EL COMISIONISTA.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.3 En el supuesto caso que LOS PROPIETARIOS decidan no continuar con el presente contrato estando el mismo vigente, se le aplicará una penalidad correspondiente al 25% del monto de comisión señalado para el anticresis de EL INMUEBLE, como consecuencia del incumplimiento de su obligación.
            </Text>
          </View>
        </View>
        {/* Décima primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMA PRIMERA:</Text>
          <Text style={styles.justified}>
            Resolución de controversias: En caso de presentarse alguna controversia relacionada con el presente acuerdo, las partes acuerdan someterse a procesos de arbitraje, o resolver la controversia a través de los jueces y tribunales del Distrito Judicial de Arequipa, para lo que señalan como sus domicilios los indicados en la introducción del presente documento. Los costos correrán por cuenta de la parte que resultare vencida.
          </Text>
        </View>
        {/* Décima segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMA SEGUNDA:</Text>
          <Text style={styles.justified}>
            Las partes reconocen que han leído y entienden este acuerdo y aceptan voluntariamente los derechos y las obligaciones dispuestas; y juntos firmamos por duplicado el día <Text style={styles.dataInput}>{diaFirma}</Text> del mes de <Text style={styles.dataInput}>{mesFirma}</Text> del año <Text style={styles.dataInput}>{anoFirma}</Text>.
          </Text>
        </View>
        {/* Firmas */}
        <ContratoFirmas lista={lista} varios={varios} />
        <ContratoFooter qr={qr} fecha_creacion={fecha_generacion} id_publico={id_publico} />
      </Page>
    </Document>
  );
}