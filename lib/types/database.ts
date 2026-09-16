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
  | "items_checklist"
  | "checklist_estado"
  | "situaciones"
  | "empresas"
  | "estado"
  | "resource"
  | "mes"
  | "operacion"
  | "tipo_contrato"
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
export type Configuracion_Revisiones = TableRow<"configuracion_revisiones">
export type historial_observaciones = TableRow<"historial_observaciones">
//export type ItemChecklist = TableRow<"items_checklist">;
export type ChecklistEstado = TableRow<"checklist_estado">;
export type estados_revision = TableRow<"estados_revision">;
export type operacion_inmobiliaria = TableRow<"operacion_inmobiliaria">;
export type Tabla = TableRow<"tablas">;

export type RowRecord = Record<string, string | number | boolean | null>;
