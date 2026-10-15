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

export function TraspasoPDF({
  nroContrato,
  nroPropietarios,
  logoIzquierdo,
  logoDerecho,
  logoMarcadeAgua,
  logosEnTodasLasPaginas = false,
  propietarios,
  qr,
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
          <Text style={styles.clauseTitle}>PRIMERA:</Text>
          <Text style={styles.justified}>
            EL CLIENTE es el encargado del inmueble ubicado en:{" "}
            <Text style={styles.dataInput}>{inmuebleDireccion}</Text>
            , distrito de
            <Text style={styles.dataInput}>{inmuebleDistrito}</Text>
            , provincia y departamento de Arequipa, cuyos linderos y medidas perimétricas constan inscritos en la Partida Electrónica N°
            <Text style={styles.dataInput}>{inmueblePartida}</Text>
            del Registro de Predios de la Zona Registral XII - Sede Arequipa, en el que funciona el negocio de
            <Text style={styles.dataInput}>{giroNegocio}</Text>
            {" "}denominado “
            <Text style={styles.dataInput}>{nombreNegocio}</Text>
            ”, y al que en lo sucesivo se le denominará EL INMUEBLE.
          </Text>
        </View>

        {/* Segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SEGUNDA:</Text>
          <Text style={styles.justified}>
            EL COMISIONISTA es una persona jurídica de derecho privado, cuya función principal es la actividad de corretaje de toda clase de bienes inmuebles, y las demás actividades derivadas de la misma función, según consta en el objeto social de la empresa mencionada en la introducción del presente documento.
          </Text>
        </View>

        {/* Tercera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>TERCERA:</Text>
          <Text style={styles.justified}>
            Por medio del presente acuerdo, EL CLIENTE otorga a EL COMISIONISTA a partir de la firma del presente documento, la representación comercial para el TRASPASO de EL INMUEBLE descrito en la cláusula primera del presente contrato, en la modalidad de EXCLUSIVIDAD, gestión que será realizada por El Asesor Sr./Sra./Srta.:
            <Text style={styles.dataInput}>{nombreAsesor}</Text>
            , EL COMISIONISTA iniciará el proceso de búsqueda de posibles compradores, de acuerdo con los términos que se establezcan en las cláusulas del presente contrato, siendo EL COMISIONISTA y su grupo de trabajo, las únicas personas autorizadas para promover EL INMUEBLE dentro de los medios que se enunciarán en la cláusula siguiente, no pudiendo EL CLIENTE contratar con otra empresa o persona que se dedique al corretaje inmobiliario, dentro del plazo de duración del presente documento.
          </Text>
        </View>

        {/* Cuarta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>CUARTA:</Text>
          <Text style={styles.justified}>
            EL COMISIONISTA se compromete a listar EL INMUEBLE dentro de la web de RE/MAX Perú (www.remax.pe), y a promocionarla según lo convenido con EL CLIENTE, utilizando las diferentes herramientas con las que cuenta EL COMISIONISTA para este fin, así como informar a EL CLIENTE de los posibles interesados y los oferentes que tenga para la propiedad en traspaso. Asimismo, y por tratarse de un contrato en exclusividad, EL COMISIONISTA se compromete al cumplimiento de las actividades de Marketing para propiedades en exclusividad, las cuales son previamente comunicadas a EL PROPIETARIO.
          </Text>
        </View>

        {/* Quinta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>QUINTA:</Text>
          <Text style={styles.justified}>
            Que, a consecuencia del presente acuerdo, EL PROPIETARIO se compromete a brindar todas las facilidades para mostrar EL INMUEBLE y a entregar a EL COMISIONISTA una comisión equivalente a{" "}
            <Text style={styles.dataInput}>{comision}</Text>
            % (no incluye IGV), sobre la base del precio final de traspaso negociado por EL COMISIONISTA con el futuro cliente interesado y previamente aceptado por EL CLIENTE. Las comisiones pactadas en la presente cláusula serán canceladas a EL COMISIONISTA al momento de la firma del Contrato de Traspaso que se genere entre EL CLIENTE y el cliente interesado que haya sido presentado por EL COMISIONISTA. Asimismo, EL CLIENTE se compromete a entregar los documentos señalados a continuación para poder iniciar el proceso de venta de EL INMUEBLE:
          </Text>
          <View style={{ marginLeft: 14, marginTop: 4 }}>
            <Text style={styles.justified}>{"\u2714"} Copia del documento de identidad de EL CLIENTE</Text>
            <Text style={styles.justified}>{"\u2714"} Contrato de arrendamiento de EL INMUEBLE.</Text>
            <Text style={styles.justified}>{"\u2714"} Cualquier otro documento que sea solicitado por el Agente Responsable del manejo de la Propiedad y que sea necesario para la consecución del objeto del presente contrato.</Text>
          </View>
        </View>

        {/* Sexta cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SEXTA:</Text>
          <Text style={styles.justified}>
            El plazo de duración del presente acuerdo será de <Text style={styles.dataInput}>{duracionMeses}</Text> meses contados a partir de la fecha consignada al final del presente documento. Las partes podrán renovar este contrato por mutuo acuerdo, debiendo realizarlo de manera escrita.
          </Text>
        </View>

        {/* Séptima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>SÉTIMA:</Text>
          <Text style={styles.justified}>
            El presente contrato quedará resuelto automáticamente y sin necesidad de documento alguno, al vencimiento del mismo, salvo acuerdo de renovación de las partes. De igual manera en el caso que EL COMISIONISTA consiga el objetivo de vender EL INMUEBLE en un plazo menor a los <Text style={styles.dataInput}>{duracionMeses}</Text> meses, el contrato quedará resuelto en el momento que ambas partes hayan cumplido con las obligaciones adquiridas por el presente documento.
          </Text>
        </View>

        {/* Octava cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>OCTAVA:</Text>
          <Text style={styles.justified}>
            Toda negociación para llegar a el Traspaso de EL INMUEBLE deberá ser manejada exclusivamente por EL COMISIONISTA o algún miembro de su equipo de Agentes Inmobiliarios debidamente capacitado y autorizado. Cualquier propuesta a la que se llegue en la negociación deberá ser previamente aceptada por EL CLIENTE antes de su comunicación al futuro cliente interesado.
          </Text>
        </View>

        {/* Novena cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>NOVENA:</Text>
          <Text style={styles.justified}>
            En el caso que algún cliente que haya conocido EL INMUEBLE por gestión de EL COMISIONISTA y esté debidamente registrado por éste, lo Traspase después del vencimiento del presente acuerdo y haya sido negociado en forma directa con EL CLIENTE, las partes acuerdan que éste quedará obligado a hacer la cancelación de la comisión pactada en el presente documento a EL COMISIONISTA. Esta obligación será respetada por el plazo de 6 meses una vez vencido el presente documento.
          </Text>
        </View>

        {/* Décima cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMA:</Text>
          <View>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.1 Por el presente contrato EL CLIENTE manifiesta su voluntad expresa de traspasar EL INMUEBLE, declarando, asimismo, que el inmueble se encuentra en óptimas condiciones físicas y legales para ser traspasado.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.2 En el supuesto caso que EL CLIENTE luego de haber aceptado de manera escrita al cliente interesado presentado por EL COMISIONISTA y desistan continuar con la celebración del Contrato de Traspaso, se le aplicará una penalidad correspondiente al 50% del monto del traspaso fijado para EL INMUEBLE.
            </Text>
            <Text style={[styles.justified, styles.marginBottomSmall]}>
              10.3 En el supuesto caso que EL CLIENTE decida no continuar con el presente contrato estando el mismo vigente, se les aplicará una penalidad correspondiente al 25% del monto del traspaso fijado para EL INMUEBLE, como consecuencia del incumplimiento de su obligación.
            </Text>
            <Text style={styles.justified}>
              10.4 En el supuesto caso que EL CLIENTE realice el traspaso de EL INMUEBLE por su cuenta incumpliendo la cláusula tercera del presente contrato, éste deberá pagar el total de la comisión señalada en la cláusula quinta de acuerdo al monto del traspaso del contrato celebrado por EL CLIENTE.
            </Text>
          </View>
        </View>

        {/* Décima primera cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMO PRIMERA:</Text>
          <Text style={styles.justified}>
            Resolución de controversias: En caso de presentarse alguna controversia relacionada con el presente contrato, las partes acuerdan someterse a los procesos de arbitraje, o resolver la controversia a través de los jueces y tribunales del Distrito Judicial de Arequipa, para lo cual señalan como sus domicilios los indicados en la introducción del presente documento. Los costos correrán por cuenta de la parte que resulte vencida.
          </Text>
        </View>

        {/* Décima segunda cláusula */}
        <View style={styles.section}>
          <Text style={styles.clauseTitle}>DÉCIMO SEGUNDA:</Text>
          <Text style={styles.justified}>
            Las partes reconocen que han leído y entienden este acuerdo y aceptan voluntariamente los derechos y las obligaciones dispuestas y juntos firmamos por duplicado el día <Text style={styles.dataInput}>{diaFirma}</Text> del mes de <Text style={styles.dataInput}>{mesFirma}</Text> del año {anoFirma}.
          </Text>
        </View>

        <ContratoFirmas lista={lista} varios={varios} />
        <ContratoFooter qr={qr} />
      </Page>
    </Document>
  );
}