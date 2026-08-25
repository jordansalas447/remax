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
  | "propiedades"
  | "propiedad_propietario"
  | "contratos"
  | "conformidad"
  | "revisiones"
  | "items_checklist"
  | "checklist_estado"
  | "estado"
  | "mes"
  | "operacion"
  | "tipo_contrato"
  | "tipo_propiedad"
  | "tipo_moneda"
  | "tablas";

export type TableName = Extract<keyof PublicTableMap, SupportedTableName>;

export type TableRow<T extends TableName> = PublicTableMap[T]["Row"];
export type TableInsert<T extends TableName> = PublicTableMap[T]["Insert"];
export type TableUpdate<T extends TableName> = PublicTableMap[T]["Update"];

export type Asociados = TableRow<"asociados">;
export type Propietario = TableRow<"propietarios">;
export type Propiedad = TableRow<"propiedades">;
export type PropiedadPropietario = TableRow<"propiedad_propietario">;
export type Contrato = TableRow<"contratos">;
export type Conformidad = TableRow<"conformidad">;
export type Revision = TableRow<"revisiones">;
//export type ItemChecklist = TableRow<"items_checklist">;
export type ChecklistEstado = TableRow<"checklist_estado">;
export type estados_revision = TableRow<"estados_revision">;
export type operacion_inmobiliaria = TableRow<"operacion_inmobiliaria">;
export type Tabla = TableRow<"tablas">;

export type RowRecord = Record<string, string | number | boolean | null>;
