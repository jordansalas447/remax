export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      administrativos: {
        Row: {
          area: string | null
          cargo: string | null
          deleted_at: string | null
          descripcion: string
          eliminado: boolean
          id: number
          id_persona: number | null
          nombre_completo: string | null
        }
        Insert: {
          area?: string | null
          cargo?: string | null
          deleted_at?: string | null
          descripcion: string
          eliminado?: boolean
          id?: number
          id_persona?: number | null
          nombre_completo?: string | null
        }
        Update: {
          area?: string | null
          cargo?: string | null
          deleted_at?: string | null
          descripcion?: string
          eliminado?: boolean
          id?: number
          id_persona?: number | null
          nombre_completo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "administrativos_id_persona_fkey"
            columns: ["id_persona"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      area: {
        Row: {
          area: string
          id: number
        }
        Insert: {
          area: string
          id?: number
        }
        Update: {
          area?: string
          id?: number
        }
        Relationships: []
      }
      asistencias: {
        Row: {
          created_at: string | null
          estado: string
          fecha_hora_registro: string
          id: number
          id_evento: number | null
          id_persona: number | null
          id_tardanza: number | null
          observacion: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string
          fecha_hora_registro: string
          id?: number
          id_evento?: number | null
          id_persona?: number | null
          id_tardanza?: number | null
          observacion?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          fecha_hora_registro?: string
          id?: number
          id_evento?: number | null
          id_persona?: number | null
          id_tardanza?: number | null
          observacion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asistencias_id_evento_fkey"
            columns: ["id_evento"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencias_id_persona_fkey"
            columns: ["id_persona"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencias_id_tardanza_fkey"
            columns: ["id_tardanza"]
            isOneToOne: false
            referencedRelation: "tardanzas"
            referencedColumns: ["id"]
          },
        ]
      }
      asociados: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          fecha_creacion: string | null
          id_asociado: number
          id_detalle_asociado: number | null
          id_persona: number | null
          nombre_completo: string | null
          url_resource: string | null
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          fecha_creacion?: string | null
          id_asociado?: number
          id_detalle_asociado?: number | null
          id_persona?: number | null
          nombre_completo?: string | null
          url_resource?: string | null
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          fecha_creacion?: string | null
          id_asociado?: number
          id_detalle_asociado?: number | null
          id_persona?: number | null
          nombre_completo?: string | null
          url_resource?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asociados_id_detalle_asociado_fkey"
            columns: ["id_detalle_asociado"]
            isOneToOne: false
            referencedRelation: "detalle_asociado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asociados_id_persona_fkey"
            columns: ["id_persona"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      cargo: {
        Row: {
          cargo: string
          id: number
        }
        Insert: {
          cargo: string
          id?: number
        }
        Update: {
          cargo?: string
          id?: number
        }
        Relationships: []
      }
      checklist_estado: {
        Row: {
          descripcion: string | null
          id_checklist_estado: number
          id_estado_oficina: number | null
          id_estado_sigi: number | null
          id_item: number
          id_revision: number
        }
        Insert: {
          descripcion?: string | null
          id_checklist_estado?: number
          id_estado_oficina?: number | null
          id_estado_sigi?: number | null
          id_item: number
          id_revision: number
        }
        Update: {
          descripcion?: string | null
          id_checklist_estado?: number
          id_estado_oficina?: number | null
          id_estado_sigi?: number | null
          id_item?: number
          id_revision?: number
        }
        Relationships: []
      }
      conformidad: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          tipo: string
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo: string
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo?: string
        }
        Relationships: []
      }
      contratos: {
        Row: {
          captacion: string | null
          comision: number | null
          deleted_at: string | null
          eliminado: boolean
          estado: boolean
          fecha_fin: string | null
          fecha_inicio: string | null
          id_asociado: number | null
          id_conformidad: number | null
          id_contrato: number
          id_estado: number | null
          id_mes_captacion: number | null
          id_mes_vencimiento: number | null
          id_operacion: number | null
          id_propiedad: number
          id_resource: number | null
          id_tipo_contrato: number | null
          id_tipo_moneda: number | null
          id_tipo_moneda_comision: number | null
          id_tipo_moneda_operacion: number | null
          id_tipo_moneda_precio_maximo: number | null
          nro_contrato: string | null
          observaciones: string | null
          operacion: string | null
          precio_cierre: number | null
          precio_inicio: number | null
          precio_maximo: number | null
          timestamp: string | null
          tipo_contrato: string | null
        }
        Insert: {
          captacion?: string | null
          comision?: number | null
          deleted_at?: string | null
          eliminado?: boolean
          estado?: boolean
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id_asociado?: number | null
          id_conformidad?: number | null
          id_contrato?: number
          id_estado?: number | null
          id_mes_captacion?: number | null
          id_mes_vencimiento?: number | null
          id_operacion?: number | null
          id_propiedad: number
          id_resource?: number | null
          id_tipo_contrato?: number | null
          id_tipo_moneda?: number | null
          id_tipo_moneda_comision?: number | null
          id_tipo_moneda_operacion?: number | null
          id_tipo_moneda_precio_maximo?: number | null
          nro_contrato?: string | null
          observaciones?: string | null
          operacion?: string | null
          precio_cierre?: number | null
          precio_inicio?: number | null
          precio_maximo?: number | null
          timestamp?: string | null
          tipo_contrato?: string | null
        }
        Update: {
          captacion?: string | null
          comision?: number | null
          deleted_at?: string | null
          eliminado?: boolean
          estado?: boolean
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id_asociado?: number | null
          id_conformidad?: number | null
          id_contrato?: number
          id_estado?: number | null
          id_mes_captacion?: number | null
          id_mes_vencimiento?: number | null
          id_operacion?: number | null
          id_propiedad?: number
          id_resource?: number | null
          id_tipo_contrato?: number | null
          id_tipo_moneda?: number | null
          id_tipo_moneda_comision?: number | null
          id_tipo_moneda_operacion?: number | null
          id_tipo_moneda_precio_maximo?: number | null
          nro_contrato?: string | null
          observaciones?: string | null
          operacion?: string | null
          precio_cierre?: number | null
          precio_inicio?: number | null
          precio_maximo?: number | null
          timestamp?: string | null
          tipo_contrato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_id_asociado_fkey"
            columns: ["id_asociado"]
            isOneToOne: false
            referencedRelation: "asociados"
            referencedColumns: ["id_asociado"]
          },
          {
            foreignKeyName: "contratos_id_conformidad_fkey"
            columns: ["id_conformidad"]
            isOneToOne: false
            referencedRelation: "conformidad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_estado_fkey"
            columns: ["id_estado"]
            isOneToOne: false
            referencedRelation: "estado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_mes_captacion_fkey"
            columns: ["id_mes_captacion"]
            isOneToOne: false
            referencedRelation: "mes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_mes_vencimiento_fkey"
            columns: ["id_mes_vencimiento"]
            isOneToOne: false
            referencedRelation: "mes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_operacion_fkey"
            columns: ["id_operacion"]
            isOneToOne: false
            referencedRelation: "operacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_propiedad_fkey"
            columns: ["id_propiedad"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "contratos_id_resource_fkey"
            columns: ["id_resource"]
            isOneToOne: false
            referencedRelation: "resource"
            referencedColumns: ["id_resource"]
          },
          {
            foreignKeyName: "contratos_id_tipo_contrato_fkey"
            columns: ["id_tipo_contrato"]
            isOneToOne: false
            referencedRelation: "tipo_contrato"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_tipo_moneda_comision_fkey"
            columns: ["id_tipo_moneda_comision"]
            isOneToOne: false
            referencedRelation: "tipo_moneda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_tipo_moneda_fkey"
            columns: ["id_tipo_moneda"]
            isOneToOne: false
            referencedRelation: "tipo_moneda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_id_tipo_moneda_precio_maximo_fkey"
            columns: ["id_tipo_moneda_precio_maximo"]
            isOneToOne: false
            referencedRelation: "tipo_moneda"
            referencedColumns: ["id"]
          },
        ]
      }
      detalle_asociado: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          fecha_registro: string
          id: number
          id_nivel_asociado: number | null
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          fecha_registro: string
          id?: number
          id_nivel_asociado?: number | null
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          fecha_registro?: string
          id?: number
          id_nivel_asociado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "detalle_asociado_id_nivel_asociado_fkey"
            columns: ["id_nivel_asociado"]
            isOneToOne: false
            referencedRelation: "nivel_asociado"
            referencedColumns: ["id"]
          },
        ]
      }
      distritos: {
        Row: {
          deleted_at: string | null
          distrito: string
          eliminado: boolean
          id: number
        }
        Insert: {
          deleted_at?: string | null
          distrito: string
          eliminado?: boolean
          id?: number
        }
        Update: {
          deleted_at?: string | null
          distrito?: string
          eliminado?: boolean
          id?: number
        }
        Relationships: []
      }
      documentos: {
        Row: {
          descripcion: string | null
          documento: string
          fecha_registro: string | null
          id: number
        }
        Insert: {
          descripcion?: string | null
          documento: string
          fecha_registro?: string | null
          id?: number
        }
        Update: {
          descripcion?: string | null
          documento?: string
          fecha_registro?: string | null
          id?: number
        }
        Relationships: []
      }
      estado: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          estado: string
          id: number
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado: string
          id?: number
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: string
          id?: number
        }
        Relationships: []
      }
      estados_revision: {
        Row: {
          color: string | null
          deleted_at: string | null
          descripcion: string
          eliminado: boolean
          id: number
        }
        Insert: {
          color?: string | null
          deleted_at?: string | null
          descripcion: string
          eliminado?: boolean
          id?: number
        }
        Update: {
          color?: string | null
          deleted_at?: string | null
          descripcion?: string
          eliminado?: boolean
          id?: number
        }
        Relationships: []
      }
      eventos: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          fecha: string | null
          hora_fin: string | null
          hora_inicio: string
          id: number
          nombre: string
          obligatorio: boolean
          tolerancia_minutos: number
          updated_at: string | null
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          fecha?: string | null
          hora_fin?: string | null
          hora_inicio: string
          id?: number
          nombre: string
          obligatorio?: boolean
          tolerancia_minutos?: number
          updated_at?: string | null
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          fecha?: string | null
          hora_fin?: string | null
          hora_inicio?: string
          id?: number
          nombre?: string
          obligatorio?: boolean
          tolerancia_minutos?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      items_checklist: {
        Row: {
          delete_at: string | null
          eliminado: boolean
          icon: string | null
          id_item: number
          id_operacion_inmobiliaria: number | null
          nombre_item: string
        }
        Insert: {
          delete_at?: string | null
          eliminado?: boolean
          icon?: string | null
          id_item?: number
          id_operacion_inmobiliaria?: number | null
          nombre_item: string
        }
        Update: {
          delete_at?: string | null
          eliminado?: boolean
          icon?: string | null
          id_item?: number
          id_operacion_inmobiliaria?: number | null
          nombre_item?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_checklist_id_operacion_inmobiliaria_fkey"
            columns: ["id_operacion_inmobiliaria"]
            isOneToOne: false
            referencedRelation: "operacion_inmobiliaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_checklist_id_operacion_inmobiliaria_fkey"
            columns: ["id_operacion_inmobiliaria"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_operacion_inmobiliaria"]
          },
        ]
      }
      mes: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          mes: string
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          mes: string
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          mes?: string
        }
        Relationships: []
      }
      multas: {
        Row: {
          estado: string
          fecha: string | null
          fecha_creacion: string | null
          id: number
          monto: number | null
          motivo: string
          tipo: string | null
        }
        Insert: {
          estado?: string
          fecha?: string | null
          fecha_creacion?: string | null
          id?: number
          monto?: number | null
          motivo: string
          tipo?: string | null
        }
        Update: {
          estado?: string
          fecha?: string | null
          fecha_creacion?: string | null
          id?: number
          monto?: number | null
          motivo?: string
          tipo?: string | null
        }
        Relationships: []
      }
      nivel_asociado: {
        Row: {
          deleted_at: string | null
          descripcion: string
          eliminado: boolean
          id: number
        }
        Insert: {
          deleted_at?: string | null
          descripcion: string
          eliminado?: boolean
          id?: number
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string
          eliminado?: boolean
          id?: number
        }
        Relationships: []
      }
      operacion: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          operacion: string
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          operacion: string
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          operacion?: string
        }
        Relationships: []
      }
      operacion_inmobiliaria: {
        Row: {
          deleted_at: string | null
          eliminado: boolean
          id: number
          operacion: string
        }
        Insert: {
          deleted_at?: string | null
          eliminado?: boolean
          id?: number
          operacion: string
        }
        Update: {
          deleted_at?: string | null
          eliminado?: boolean
          id?: number
          operacion?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          apellido_materno: string | null
          apellido_paterno: string | null
          deleted_at: string | null
          direccion: string | null
          documento_identidad: string | null
          eliminado: boolean
          fecha_creacion: string | null
          fecha_nacimiento: string | null
          fecha_registro: string | null
          id: number
          id_resource: number | null
          nombre: string
          nombre_completo: string | null
          numero_telefono: string | null
          url_dni: string | null
          url_foto: string | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          deleted_at?: string | null
          direccion?: string | null
          documento_identidad?: string | null
          eliminado?: boolean
          fecha_creacion?: string | null
          fecha_nacimiento?: string | null
          fecha_registro?: string | null
          id?: number
          id_resource?: number | null
          nombre: string
          nombre_completo?: string | null
          numero_telefono?: string | null
          url_dni?: string | null
          url_foto?: string | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          deleted_at?: string | null
          direccion?: string | null
          documento_identidad?: string | null
          eliminado?: boolean
          fecha_creacion?: string | null
          fecha_nacimiento?: string | null
          fecha_registro?: string | null
          id?: number
          id_resource?: number | null
          nombre?: string
          nombre_completo?: string | null
          numero_telefono?: string | null
          url_dni?: string | null
          url_foto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_id_resource_fkey"
            columns: ["id_resource"]
            isOneToOne: false
            referencedRelation: "resource"
            referencedColumns: ["id_resource"]
          },
        ]
      }
      precios: {
        Row: {
          id: number
          precio: number
        }
        Insert: {
          id?: number
          precio: number
        }
        Update: {
          id?: number
          precio?: number
        }
        Relationships: []
      }
      propiedad_propietario: {
        Row: {
          deleted_at: string | null
          eliminado: boolean | null
          id: number
          id_contrato: number | null
          id_propiedad: number
          id_propietario: number
        }
        Insert: {
          deleted_at?: string | null
          eliminado?: boolean | null
          id?: number
          id_contrato?: number | null
          id_propiedad: number
          id_propietario: number
        }
        Update: {
          deleted_at?: string | null
          eliminado?: boolean | null
          id?: number
          id_contrato?: number | null
          id_propiedad?: number
          id_propietario?: number
        }
        Relationships: [
          {
            foreignKeyName: "propiedad_propietario_id_contrato_fkey"
            columns: ["id_contrato"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "propiedad_propietario_id_contrato_fkey"
            columns: ["id_contrato"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "propiedad_propietario_id_propiedad_fkey"
            columns: ["id_propiedad"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "propiedad_propietario_id_propietario_fkey"
            columns: ["id_propietario"]
            isOneToOne: false
            referencedRelation: "propietarios"
            referencedColumns: ["id_propietario"]
          },
        ]
      }
      propiedades: {
        Row: {
          area_construida: number | null
          area_terreno: number | null
          captacion: string | null
          deleted_at: string | null
          descripcion: string | null
          direccion: string | null
          eliminado: boolean
          estado: string | null
          fotos: boolean | null
          id_conformidad: number | null
          id_distrito: number | null
          id_propiedad: number
          id_remax: number | null
          id_resource: number | null
          id_tipo_propiedad: number | null
          n_partida: string | null
          observacion: string | null
          timestamp: string | null
        }
        Insert: {
          area_construida?: number | null
          area_terreno?: number | null
          captacion?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          eliminado?: boolean
          estado?: string | null
          fotos?: boolean | null
          id_conformidad?: number | null
          id_distrito?: number | null
          id_propiedad?: number
          id_remax?: number | null
          id_resource?: number | null
          id_tipo_propiedad?: number | null
          n_partida?: string | null
          observacion?: string | null
          timestamp?: string | null
        }
        Update: {
          area_construida?: number | null
          area_terreno?: number | null
          captacion?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          eliminado?: boolean
          estado?: string | null
          fotos?: boolean | null
          id_conformidad?: number | null
          id_distrito?: number | null
          id_propiedad?: number
          id_remax?: number | null
          id_resource?: number | null
          id_tipo_propiedad?: number | null
          n_partida?: string | null
          observacion?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propiedades_id_conformidad_fkey"
            columns: ["id_conformidad"]
            isOneToOne: false
            referencedRelation: "conformidad"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedades_id_distrito_fkey"
            columns: ["id_distrito"]
            isOneToOne: false
            referencedRelation: "distritos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedades_id_resource_fkey"
            columns: ["id_resource"]
            isOneToOne: false
            referencedRelation: "resource"
            referencedColumns: ["id_resource"]
          },
          {
            foreignKeyName: "propiedades_id_tipo_propiedad_fkey"
            columns: ["id_tipo_propiedad"]
            isOneToOne: false
            referencedRelation: "tipo_propiedad"
            referencedColumns: ["id"]
          },
        ]
      }
      propietarios: {
        Row: {
          contacto: string | null
          eliminado: boolean
          id_personas: number | null
          id_propietario: number
          nombre_completo: string | null
        }
        Insert: {
          contacto?: string | null
          eliminado?: boolean
          id_personas?: number | null
          id_propietario?: number
          nombre_completo?: string | null
        }
        Update: {
          contacto?: string | null
          eliminado?: boolean
          id_personas?: number | null
          id_propietario?: number
          nombre_completo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propietarios_id_personas_fkey"
            columns: ["id_personas"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      resource: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id_resource: number
          url_resource: string
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id_resource?: number
          url_resource: string
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id_resource?: number
          url_resource?: string
        }
        Relationships: []
      }
      revisiones: {
        Row: {
          conformidad_descripcion: string | null
          deleted_at: string | null
          eliminado: boolean
          fecha_entregado: string | null
          fecha_recibido: string | null
          fecha_sigi: string | null
          id_estado_oficina: number | null
          id_estado_sigi: number | null
          id_item: number | null
          id_operacion_inmobiliaria: number | null
          id_propiedad_propietario_contrato: number | null
          id_ref_propiedad_propietario_contrato: number | null
          id_revision: number
          id_revisor: number | null
          observaciones: string | null
          timestamp: string | null
        }
        Insert: {
          conformidad_descripcion?: string | null
          deleted_at?: string | null
          eliminado?: boolean
          fecha_entregado?: string | null
          fecha_recibido?: string | null
          fecha_sigi?: string | null
          id_estado_oficina?: number | null
          id_estado_sigi?: number | null
          id_item?: number | null
          id_operacion_inmobiliaria?: number | null
          id_propiedad_propietario_contrato?: number | null
          id_ref_propiedad_propietario_contrato?: number | null
          id_revision?: number
          id_revisor?: number | null
          observaciones?: string | null
          timestamp?: string | null
        }
        Update: {
          conformidad_descripcion?: string | null
          deleted_at?: string | null
          eliminado?: boolean
          fecha_entregado?: string | null
          fecha_recibido?: string | null
          fecha_sigi?: string | null
          id_estado_oficina?: number | null
          id_estado_sigi?: number | null
          id_item?: number | null
          id_operacion_inmobiliaria?: number | null
          id_propiedad_propietario_contrato?: number | null
          id_ref_propiedad_propietario_contrato?: number | null
          id_revision?: number
          id_revisor?: number | null
          observaciones?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revisiones_id_estado_oficina_fkey"
            columns: ["id_estado_oficina"]
            isOneToOne: false
            referencedRelation: "estados_revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_estado_sigi_fkey"
            columns: ["id_estado_sigi"]
            isOneToOne: false
            referencedRelation: "estados_revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_item_fkey"
            columns: ["id_item"]
            isOneToOne: false
            referencedRelation: "items_checklist"
            referencedColumns: ["id_item"]
          },
          {
            foreignKeyName: "revisiones_id_operacion_inmobiliaria_fkey"
            columns: ["id_operacion_inmobiliaria"]
            isOneToOne: false
            referencedRelation: "operacion_inmobiliaria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_operacion_inmobiliaria_fkey"
            columns: ["id_operacion_inmobiliaria"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_operacion_inmobiliaria"]
          },
          {
            foreignKeyName: "revisiones_id_propiedad_propietario_contrato_fkey"
            columns: ["id_propiedad_propietario_contrato"]
            isOneToOne: false
            referencedRelation: "propiedad_propietario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_revisor_fkey"
            columns: ["id_revisor"]
            isOneToOne: false
            referencedRelation: "administrativos"
            referencedColumns: ["id"]
          },
        ]
      }
      tablas: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          estado: number | null
          icon: string
          id: number
          nombre: string | null
          permiso: string | null
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: number | null
          icon: string
          id?: number
          nombre?: string | null
          permiso?: string | null
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: number | null
          icon?: string
          id?: number
          nombre?: string | null
          permiso?: string | null
        }
        Relationships: []
      }
      tardanzas: {
        Row: {
          created_at: string
          hora_llegada: string | null
          hora_programada: string
          id: number
          id_multa: number | null
          justificada: boolean
          minutos_tardanza: number
          motivo: string | null
        }
        Insert: {
          created_at?: string
          hora_llegada?: string | null
          hora_programada: string
          id?: number
          id_multa?: number | null
          justificada?: boolean
          minutos_tardanza: number
          motivo?: string | null
        }
        Update: {
          created_at?: string
          hora_llegada?: string | null
          hora_programada?: string
          id?: number
          id_multa?: number | null
          justificada?: boolean
          minutos_tardanza?: number
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tardanzas_id_multa_fkey"
            columns: ["id_multa"]
            isOneToOne: false
            referencedRelation: "multas"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_contrato: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          tipo_contrato: string
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo_contrato: string
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo_contrato?: string
        }
        Relationships: []
      }
      tipo_moneda: {
        Row: {
          deleted_at: string | null
          eliminado: boolean
          id: number
          simbolo: string | null
          tipo_moneda: string
        }
        Insert: {
          deleted_at?: string | null
          eliminado?: boolean
          id?: number
          simbolo?: string | null
          tipo_moneda: string
        }
        Update: {
          deleted_at?: string | null
          eliminado?: boolean
          id?: number
          simbolo?: string | null
          tipo_moneda?: string
        }
        Relationships: []
      }
      tipo_propiedad: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          tipo_propiedad: string
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo_propiedad: string
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo_propiedad?: string
        }
        Relationships: []
      }
    }
    Views: {
      vw_revisiones_detalle: {
        Row: {
          color_estado_oficina: string | null
          color_estado_sigi: string | null
          estado_oficina: string | null
          estado_sigi: string | null
          id_contrato: number | null
          id_operacion: number | null
          id_operacion_inmobiliaria: number | null
          id_propiedad: number | null
          id_propietario: number | null
          id_revision: number | null
          nombre_item: string | null
          operacion: string | null
          rev: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propiedad_propietario_id_propiedad_fkey"
            columns: ["id_propiedad"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "propiedad_propietario_id_propietario_fkey"
            columns: ["id_propietario"]
            isOneToOne: false
            referencedRelation: "propietarios"
            referencedColumns: ["id_propietario"]
          },
        ]
      }
    }
    Functions: {
      obtener_reporte_contrato: {
        Args: never
        Returns: {
          area_construida: number
          area_terreno: number
          comentarios_docs: string
          comision: number
          contacto: string
          descripcion: string
          direccion: string
          distrito: string
          estado_contrato: boolean
          estado_oficina: boolean
          estado_sigi: boolean
          fecha_elab_eett: string
          fecha_entregado: string
          fecha_fin: string
          fecha_inicio: string
          fecha_recibido: string
          fecha_sigi: string
          id_remax: number
          levant_observ: string
          mes_captacion: string
          mes_vencimiento: string
          n_partida: string
          nombre: string
          nombre_item: string
          nombres_propietario: string
          observaciones: string
          operacion: string
          precio: number
          precio_alquiler_venta: number
          snap_asociado: string
          tipo_conformidad: string
          tipo_contrato: string
          tipo_propiedad: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
