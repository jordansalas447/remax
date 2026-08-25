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
import { propiedadesConfig } from "./propiedades";
import { propiedadPropietarioConfig } from "./propiedad-propietario";
import { propietariosConfig } from "./propietarios";
import { revisionesConfig } from "./revisiones";
import { tipoContratoConfig } from "./tipo-contrato";
import { tipoMonedaConfig } from "./tipo-moneda";
import { tipoPropiedadConfig } from "./tipo-propiedad";
import { tablasConfig } from "./tablas";
import { estados_revisionConfig } from "./estados-revision";
import { operacioninmobiliariaConfig } from "./operacion-inmobiliaria";

export const tableConfigs: Record<string, TableConfig> = {
  tablas: tablasConfig,
  asociados: asociadosConfig,
  administrativos: administrativosConfig,
  //checklist_estado: checklistEstadoConfig,
  conformidad: conformidadConfig,
  contratos: contratosConfig,
  detalle_asociado: detalleAsociadoConfig,
  distritos: distritosConfig,
  estado: estadoConfig,
  items_checklist: itemsChecklistConfig,
  mes: mesConfig,
  nivel_asociado: nivelAsociadoConfig,
  operacion: operacionConfig,
  personas: personasConfig,
  propiedades: propiedadesConfig,
  propiedad_propietario: propiedadPropietarioConfig,
  propietarios: propietariosConfig,
  revisiones: revisionesConfig,
  tipo_contrato: tipoContratoConfig,
  tipo_moneda: tipoMonedaConfig,
  tipo_propiedad: tipoPropiedadConfig,
  estados_revision:estados_revisionConfig,
  operacion_inmobiliaria:operacioninmobiliariaConfig
};

export const tableConfigEntries = Object.entries(tableConfigs) as Array<[string, TableConfig]>;
