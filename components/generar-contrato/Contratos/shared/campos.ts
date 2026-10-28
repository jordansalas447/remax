import type { ContratoPDFProps, Propietario } from "./types";

/**
 * Configuración de los campos rellenables de cada contrato.
 * Este archivo NO importa nada de @react-pdf, así que puede usarse
 * tanto en el formulario (cliente) como en la API (servidor).
 *
 * IDs de operación:  1 = Venta, 2 = Arrendamiento, 3 = Anticresis, 4 = Traspaso
 * IDs de tipo:       1 = Exclusiva, 2 = No exclusiva
 */

export type CampoTextoContratoKey =
  | "nombreAsesor"
  | "giroNegocio"
  | "nombreNegocio"
  | "inmuebleDireccion"
  | "inmuebleDistrito"
  | "inmuebleProvincia"
  | "inmuebleDepartamento"
  | "porcentajeMontoAlquiler"
  | "inmueblePartida"
  | "comision"
  | "duracionMeses"
  | "mesesObligacionPostVencimiento"
  | "diaFirma"
  | "mesFirma"
  | "anoFirma";

export type SeccionCampo = "inmueble" | "condiciones" | "firma";

export type CampoContrato = {
  key: CampoTextoContratoKey;
  label: string;
  seccion: SeccionCampo;
  placeholder?: string;
  type?: "text" | "number" | "mes";
  sufijo?: string;
  /** Ocupa las 2 columnas del grid */
  ancho?: boolean;
};

export type CampoPropietario = {
  key: keyof Propietario;
  label: string;
  placeholder?: string;
  ancho?: boolean;
  inputMode?: "numeric" | "tel" | "text";
  maxLength?: number;
};

/** Todas las claves de texto que la API acepta (lista blanca). */
export const CLAVES_TEXTO_CONTRATO: CampoTextoContratoKey[] = [
  "nombreAsesor",
  "giroNegocio",
  "nombreNegocio",
  "inmuebleDireccion",
  "inmuebleDistrito",
  "inmuebleProvincia",
  "inmuebleDepartamento",
  "inmueblePartida",
  "porcentajeMontoAlquiler",
  "comision",
  "duracionMeses",
  "mesesObligacionPostVencimiento",
  "diaFirma",
  "mesFirma",
  "anoFirma",
];

export const CLAVES_PROPIETARIO: (keyof Propietario)[] = [
  "nombre",
  "dni",
  "estadoCivil",
  "ocupacion",
  "celular",
  "domicilio",
  "distrito",
];

export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export const SECCIONES: Record<SeccionCampo, string> = {
  inmueble: "Datos del inmueble",
  condiciones: "Condiciones del contrato",
  firma: "Fecha de firma",
};

// ---------- Bloques reutilizables ----------

const ASESOR: CampoContrato = {
  key: "nombreAsesor",
  label: "Nombre del asesor",
  seccion: "condiciones",
  placeholder: "Nombre completo del asesor",
  ancho: true,
};

const DIRECCION: CampoContrato = {
  key: "inmuebleDireccion",
  label: "Dirección del inmueble",
  seccion: "inmueble",
  placeholder: "Av. / Calle, Nro., Urb.",
  ancho: true,
};

const DISTRITO: CampoContrato = {
  key: "inmuebleDistrito",
  label: "Distrito",
  seccion: "inmueble",
  placeholder: "Ej. Cayma",
};

const PARTIDA: CampoContrato = {
  key: "inmueblePartida",
  label: "Partida electrónica N°",
  seccion: "inmueble",
  placeholder: "Ej. 11012345",
};

const DURACION: CampoContrato = {
  key: "duracionMeses",
  label: "Duración",
  seccion: "condiciones",
  type: "number",
  placeholder: "6",
  sufijo: "meses",
};

const OBLIGACION_POST: CampoContrato = {
  key: "mesesObligacionPostVencimiento",
  label: "Obligación post vencimiento",
  seccion: "condiciones",
  type: "number",
  placeholder: "6",
  sufijo: "meses",
};

const PORCENTAJEMONTOALQUILER:CampoContrato = {
  key: "porcentajeMontoAlquiler",
  label: "Porcentaje Meses Alquiler",
  seccion: "condiciones",
  type: "number",
  placeholder: "3",
}

const FIRMA: CampoContrato[] = [
  { key: "diaFirma", label: "Día", seccion: "firma", type: "number", placeholder: "15" },
  { key: "mesFirma", label: "Mes", seccion: "firma", type: "mes" },
  { key: "anoFirma", label: "Año", seccion: "firma", type: "number", placeholder: "2026" },
];

// ---------- Configuración por contrato ----------

export function getCamposContrato(
  tipoOperacion: number,
  tipoContrato: number
): CampoContrato[] {
  const exclusiva = tipoContrato === 1;

  switch (tipoOperacion) {
    // VENTA
    case 1:
      return [
        DIRECCION,
        DISTRITO,
        ...(exclusiva
          ? [
              { key: "inmuebleProvincia", label: "Provincia", seccion: "inmueble", placeholder: "Arequipa" } as CampoContrato,
              { key: "inmuebleDepartamento", label: "Departamento", seccion: "inmueble", placeholder: "Arequipa" } as CampoContrato,
            ]
          : []),
        PARTIDA,
        ASESOR,
        {
          key: "comision",
          label: "Comisión",
          seccion: "condiciones",
          placeholder: "Ej. 5% del precio de venta",
        },
        DURACION,
        ...FIRMA,
      ];

    // ARRENDAMIENTO
    case 2:
      return [DIRECCION, DISTRITO, PARTIDA, ASESOR, DURACION, OBLIGACION_POST, ...(exclusiva ? [] : [PORCENTAJEMONTOALQUILER]), ...FIRMA];

    // ANTICRESIS
    case 3:
      return [
        DIRECCION,
        DISTRITO,
        PARTIDA,
        ASESOR,
        {
          key: "comision",
          label: "Comisión",
          seccion: "condiciones",
          placeholder: "Ej. 3% del monto",
        },
        DURACION,
        ...(exclusiva ? [] : [OBLIGACION_POST]),
        ...FIRMA,
      ];

    // TRASPASO
    case 4:
      return [
        {
          key: "giroNegocio",
          label: "Giro del negocio",
          seccion: "inmueble",
          placeholder: "Ej. restaurante",
        },
        {
          key: "nombreNegocio",
          label: "Nombre del negocio",
          seccion: "inmueble",
          placeholder: "Nombre comercial",
        },
        { ...DIRECCION, label: "Dirección del local" },
        DISTRITO,
        ASESOR,
        {
          key: "comision",
          label: "Comisión",
          seccion: "condiciones",
          type: "number",
          placeholder: "5",
          sufijo: "%",
        },
        DURACION,
        OBLIGACION_POST,
        ...FIRMA,
      ];

    default:
      return [];
  }
}

export function getCamposPropietario(tipoOperacion: number): CampoPropietario[] {
  const campos: CampoPropietario[] = [
    { key: "nombre", label: "Nombre completo", placeholder: "Nombres y apellidos", ancho: true },
    { key: "dni", label: "DNI", placeholder: "12345678", inputMode: "numeric", maxLength: 8 },
    { key: "estadoCivil", label: "Estado civil", placeholder: "Soltero(a)" },
  ];

  // El traspaso (cabecera con ocupación) pide la ocupación del cliente
  if (tipoOperacion === 4) {
    campos.push({ key: "ocupacion", label: "Ocupación", placeholder: "Ej. comerciante" });
  }

  campos.push(
    { key: "celular", label: "Celular", placeholder: "987654321", inputMode: "tel", maxLength: 9 },
    { key: "domicilio", label: "Domicilio", placeholder: "Dirección del domicilio", ancho: true },
    { key: "distrito", label: "Distrito (domicilio)", placeholder: "Ej. Yanahuara" }
  );

  return campos;
}

/** Denominación de la parte en el contrato (para los títulos del formulario). */
export function getDenominacionParte(tipoOperacion: number) {
  return tipoOperacion === 4 ? "Cliente" : "Propietario";
}

/**
 * Construye el payload de datos rellenables que se envía a la API,
 * incluyendo solo los campos que aplican al contrato seleccionado.
 */
export function construirDatosContrato(
  tipoOperacion: number,
  tipoContrato: number,
  datos: Partial<Record<CampoTextoContratoKey, string>>,
  propietarios: Propietario[],
  nroPropietarios: number
): Partial<ContratoPDFProps> {
  const resultado: Partial<ContratoPDFProps> = {};

  for (const campo of getCamposContrato(tipoOperacion, tipoContrato)) {
    const valor = datos[campo.key]?.trim();
    if (valor) resultado[campo.key] = valor;
  }

  const clavesPropietario = getCamposPropietario(tipoOperacion).map((c) => c.key);
  const lista = Array.from({ length: Math.max(1, nroPropietarios) }, (_, i) => {
    const p = propietarios[i] ?? {};
    const limpio: Propietario = {};
    for (const k of clavesPropietario) {
      const v = p[k]?.trim();
      if (v) limpio[k] = v;
    }
    return limpio;
  });

  if (lista.some((p) => Object.keys(p).length > 0)) {
    resultado.propietarios = lista;
  }

  return resultado;
}
