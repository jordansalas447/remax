import type { TableConfig } from "@/lib/crud/types";
import { asociadosConfig } from "./asociados";
import { administrativosConfig } from "./administrativos";
import { checklistEstadoConfig } from "./checklist-estado";
import { conformidadConfig } from "./conformidad";
import { contratosConfig } from "./contratos";
import { detalleAsociadoConfig } from "./detalle-asociado";
import { distritosConfig } from "./distritos";
import { estadoConfig } from "./estado";
import { itemsChecklistConfig } from "./items-checklist";
import { mesConfig } from "./mes";
import { nivelAsociadoConfig } from "./nivel-asociado";
import { operacionConfig } from "./operacion";
import { personasConfig } from "./personas";
import { inmueblesConfig } from "./inmuebles";
import { propiedadPropietarioConfig } from "./propiedad-propietario";
import { propietariosConfig } from "./propietarios";
import { configuracion_revisionesConfig } from "./configuracion_revisiones";
import { revisionesConfig } from "./revisiones" 
import { tipoContratoConfig } from "./tipo-contrato";
import { tipoMonedaConfig } from "./tipo-moneda";
import { tipoPropiedadConfig } from "./tipo-propiedad";
import { tablasConfig } from "./tablas";
import { estados_revisionConfig } from "./estados-revision";
import { operacioninmobiliariaConfig } from "./operacion-inmobiliaria";
import { resourceConfig } from "./resource";
import { situacionesConfig } from "./situaciones";
import { empresasConfig } from "./empresas";
import { historial_observacionesConfig } from "./historial-observaciones";
import { alcanceConfig } from "./alcance";

export const tableConfigs: Record<string, TableConfig> = {
  tablas: tablasConfig,
  asociados: asociadosConfig,
  administrativos: administrativosConfig,
  historial_observaciones: historial_observacionesConfig,
  //checklist_estado: checklistEstadoConfig,
  conformidad: conformidadConfig,
  contratos: contratosConfig,
  detalle_asociado: detalleAsociadoConfig,
  situaciones:situacionesConfig,
  distritos: distritosConfig,
  estado: estadoConfig,
  alcances:alcanceConfig,
  items_checklist: itemsChecklistConfig,
  mes: mesConfig,
  nivel_asociado: nivelAsociadoConfig,
  empresas:empresasConfig,
  operacion: operacionConfig,
  personas: personasConfig,
  inmuebles: inmueblesConfig,
  propiedad_propietario: propiedadPropietarioConfig,
  propietarios: propietariosConfig,
  revisiones: revisionesConfig,
  configuracion_revisiones:configuracion_revisionesConfig,
  tipo_contrato: tipoContratoConfig,
  tipo_moneda: tipoMonedaConfig,
  tipo_propiedad: tipoPropiedadConfig,
  estados_revision:estados_revisionConfig,
  operacion_inmobiliaria:operacioninmobiliariaConfig,
  resource:resourceConfig
};

export const tableConfigEntries = Object.entries(tableConfigs) as Array<[string, TableConfig]>;
