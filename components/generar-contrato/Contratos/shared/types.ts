export type Propietario = {
  nombre?: string;
  dni?: string;
  estadoCivil?: string;
  celular?: string;
  domicilio?: string;
  distrito?: string;
  ocupacion?: string;
  provincia?: string;
  departamento?: string;
};

export type ContratoPDFProps = {
  nroContrato: string;
  nroPropietarios?: number;
  tipoContrato?: number;
  tipoOperacion?: number;
  id_publico?: string;
  descripcion?: string;
  fecha_generacion?: string;
  porcentajeMontoAlquiler?: string;
  qr?: string;
  logoMarcadeAgua?: NonSharedBuffer;
  logoIzquierdo?: NonSharedBuffer;
  logoDerecho?: NonSharedBuffer;
  logosEnTodasLasPaginas?: boolean;
  inmuebleProvincia?: string,
  inmuebleDepartamento?: string,
  giroNegocio?: string,
  nombreNegocio?: string,
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
  mesesObligacionPostVencimiento?: string;
  // Empresa propietaria
  empresaPropietario?: string;
  rucPropietario?: string;
  domicilioPropietario?: string;
  distritoPropietario?: string;
  telefonoFijoPropietario?: string;
  poderRegistral?: string;

  // Representante de la empresa propietaria
  representanteNombre?: string;
  representanteDni?: string;
  representanteEstadoCivil?: string;
  representanteTelefono?: string;
  representanteDomicilio?: string;
  representanteDistrito?: string;
};
