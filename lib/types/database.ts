import type { Database } from "@/database.types";

type PublicTableMap = Database["public"]["Tables"];

type SupportedTableName =
  | "estados_revision"
  | "operacion_inmobiliaria"
  | "asociados"
  | "personas"
  | "administrativos"
  | "detalle_asociado"
  | "nivel_asociado"
  | "distritos"
  | "propietarios"
  | "inmuebles"
  | "propiedad_propietario"
  | "configuracion_revisiones"
  | "contratos"
  | "conformidad"
  | "revisiones"
  | "control_acceso"
  | "sesiones_acceso"
  | "horarios_acceso"
  | "items_checklist"
  | "checklist_estado"
  | "situaciones"
  | "empresas"
  | "eventos"
  | "multas"
  | "areas"
  | "alcances"
  | "documentos"
  | "estado"
  | "tardanzas"
  | "resource"
  | "dias_semana"
  | "alcance"
  | "mes"
  | "llamadas"
  | "estado_llamada"
  | "estado_documento"
  | "asistencias"
  | "concepto_multa"
  | "justificaciones"
  | "operacion"
  | "tipo_multa"
  | "tipo_contrato"
  | "profiles"
  | "tipo_propiedad"
  | "tipo_moneda"
  | "historial_observaciones"
  | "tablas";

export type TableName = Extract<keyof PublicTableMap, SupportedTableName>;

export type TableRow<T extends TableName> = PublicTableMap[T]["Row"];
export type TableInsert<T extends TableName> = PublicTableMap[T]["Insert"];
export type TableUpdate<T extends TableName> = PublicTableMap[T]["Update"];

export type Asociados = TableRow<"asociados">;
export type Propietario = TableRow<"propietarios">;
export type Propiedad = TableRow<"inmuebles">;
export type PropiedadPropietario = TableRow<"propiedad_propietario">;
export type Contrato = TableRow<"contratos">;
export type Conformidad = TableRow<"conformidad">;
export type Revision = TableRow<"revisiones">;
export type Resource = TableRow<"resource">;
export type Situacion = TableRow<"situaciones">
export type Empresas = TableRow<"empresas">
export type Alcances = TableRow<"alcances">
export type Areas = TableRow<"areas">
export type Eventos = TableRow<"eventos">
export type Multas = TableRow<"multas">
export type Control_Acceso = TableRow<"control_acceso">
export type Sesiones_Acceso = TableRow<"sesiones_acceso">
export type Horarios_Acceso = TableRow<"horarios_acceso">
export type Llamadas = TableRow<"llamadas">
export type Asistencias = TableRow<"asistencias">
export type Documentos = TableRow<"documentos">
export type EstadoDocumentos = TableRow<"estado_documento">
export type DiasSemana = TableRow<"dias_semana">
export type Profiles = TableRow<"profiles">
export type Justificaciones = TableRow<"justificaciones">
export type Tipo_Multa = TableRow<"tipo_multa">
export type Estado_Llmada = TableRow<"estado_llamada">
export type Configuracion_Revisiones = TableRow<"configuracion_revisiones">
export type historial_observaciones = TableRow<"historial_observaciones">
//export type ItemChecklist = TableRow<"items_checklist">;
export type ChecklistEstado = TableRow<"checklist_estado">;
export type estados_revision = TableRow<"estados_revision">;
export type operacion_inmobiliaria = TableRow<"operacion_inmobiliaria">;
export type Tabla = TableRow<"tablas">;

export type RowRecord = Record<string, string | number | boolean | null>;
