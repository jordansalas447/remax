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
    PostgrestVersion: "14.5"
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
      alcances: {
        Row: {
          alcance: string | null
          created_at: string
          eliminado: boolean | null
          id_alcance: number
          nombre_propiedad: string | null
        }
        Insert: {
          alcance?: string | null
          created_at?: string
          eliminado?: boolean | null
          id_alcance?: number
          nombre_propiedad?: string | null
        }
        Update: {
          alcance?: string | null
          created_at?: string
          eliminado?: boolean | null
          id_alcance?: number
          nombre_propiedad?: string | null
        }
        Relationships: []
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
          cod_agente: string | null
          correo_corporativo: string | null
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          estado: Database["public"]["Enums"]["estado_asociado"] | null
          fecha_creacion: string | null
          id_asociado: number
          id_detalle_asociado: number | null
          id_persona: number | null
          nombre_completo: string | null
          url_resource: string | null
        }
        Insert: {
          cod_agente?: string | null
          correo_corporativo?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: Database["public"]["Enums"]["estado_asociado"] | null
          fecha_creacion?: string | null
          id_asociado?: number
          id_detalle_asociado?: number | null
          id_persona?: number | null
          nombre_completo?: string | null
          url_resource?: string | null
        }
        Update: {
          cod_agente?: string | null
          correo_corporativo?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: Database["public"]["Enums"]["estado_asociado"] | null
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
      configuracion_revisiones: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          fecha_creacion: string | null
          id_item: number | null
          id_operacion_inmobiliaria: number | null
          id_revision: number
          observacion: string | null
          timestamp: string | null
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          fecha_creacion?: string | null
          id_item?: number | null
          id_operacion_inmobiliaria?: number | null
          id_revision?: number
          observacion?: string | null
          timestamp?: string | null
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          fecha_creacion?: string | null
          id_item?: number | null
          id_operacion_inmobiliaria?: number | null
          id_revision?: number
          observacion?: string | null
          timestamp?: string | null
        }
        Relationships: [
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
            referencedRelation: "vista_revisiones"
            referencedColumns: ["id_operacion"]
          },
          {
            foreignKeyName: "revisiones_id_operacion_inmobiliaria_fkey"
            columns: ["id_operacion_inmobiliaria"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_operacion"]
          },
        ]
      }
      conformidad: {
        Row: {
          color: string | null
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          tipo: string
        }
        Insert: {
          color?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          tipo: string
        }
        Update: {
          color?: string | null
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
          comision: number | null
          deleted_at: string | null
          eliminado: boolean
          estado: boolean
          fecha_contrato_entregado: string | null
          fecha_contrato_recibido: string | null
          fecha_contrato_sigi: string | null
          fecha_creacion: string | null
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
          id_renovacion_contrato: number | null
          id_resource: number | null
          id_tipo_contrato: number | null
          id_tipo_moneda: number | null
          id_tipo_moneda_comision: number | null
          id_tipo_moneda_operacion_venta: number | null
          id_tipo_moneda_precio_venta: number | null
          nro_contrato: string | null
          observaciones: string | null
          operacion: string | null
          precio_inicio: number | null
          precio_maximo: number | null
          precio_venta: number | null
          timestamp: string | null
          tipo_contrato: string | null
        }
        Insert: {
          comision?: number | null
          deleted_at?: string | null
          eliminado?: boolean
          estado?: boolean
          fecha_contrato_entregado?: string | null
          fecha_contrato_recibido?: string | null
          fecha_contrato_sigi?: string | null
          fecha_creacion?: string | null
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
          id_renovacion_contrato?: number | null
          id_resource?: number | null
          id_tipo_contrato?: number | null
          id_tipo_moneda?: number | null
          id_tipo_moneda_comision?: number | null
          id_tipo_moneda_operacion_venta?: number | null
          id_tipo_moneda_precio_venta?: number | null
          nro_contrato?: string | null
          observaciones?: string | null
          operacion?: string | null
          precio_inicio?: number | null
          precio_maximo?: number | null
          precio_venta?: number | null
          timestamp?: string | null
          tipo_contrato?: string | null
        }
        Update: {
          comision?: number | null
          deleted_at?: string | null
          eliminado?: boolean
          estado?: boolean
          fecha_contrato_entregado?: string | null
          fecha_contrato_recibido?: string | null
          fecha_contrato_sigi?: string | null
          fecha_creacion?: string | null
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
          id_renovacion_contrato?: number | null
          id_resource?: number | null
          id_tipo_contrato?: number | null
          id_tipo_moneda?: number | null
          id_tipo_moneda_comision?: number | null
          id_tipo_moneda_operacion_venta?: number | null
          id_tipo_moneda_precio_venta?: number | null
          nro_contrato?: string | null
          observaciones?: string | null
          operacion?: string | null
          precio_inicio?: number | null
          precio_maximo?: number | null
          precio_venta?: number | null
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
            referencedRelation: "inmuebles"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "contratos_id_renovacion_contrato_fkey"
            columns: ["id_renovacion_contrato"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "contratos_id_renovacion_contrato_fkey"
            columns: ["id_renovacion_contrato"]
            isOneToOne: false
            referencedRelation: "vista_revisiones"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "contratos_id_renovacion_contrato_fkey"
            columns: ["id_renovacion_contrato"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_contrato"]
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
            foreignKeyName: "contratos_id_tipo_moneda_precio_venta_fkey"
            columns: ["id_tipo_moneda_precio_venta"]
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
      empresas: {
        Row: {
          created_at: string
          eliminado: boolean | null
          id: number
          razon_soc: string | null
          ruc: string | null
        }
        Insert: {
          created_at?: string
          eliminado?: boolean | null
          id?: number
          razon_soc?: string | null
          ruc?: string | null
        }
        Update: {
          created_at?: string
          eliminado?: boolean | null
          id?: number
          razon_soc?: string | null
          ruc?: string | null
        }
        Relationships: []
      }
      estado: {
        Row: {
          color: string | null
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          estado: string
          id: number
        }
        Insert: {
          color?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado: string
          id?: number
        }
        Update: {
          color?: string | null
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
      historial_observaciones: {
        Row: {
          eliminado: boolean | null
          fecha_creacion: string | null
          id: number
          id_alcance: number | null
          id_contratos: number | null
          id_inmueble_propietario_contrato: number | null
          id_inmuebles: number | null
          id_propietarios: number | null
          observacion: string
        }
        Insert: {
          eliminado?: boolean | null
          fecha_creacion?: string | null
          id?: number
          id_alcance?: number | null
          id_contratos?: number | null
          id_inmueble_propietario_contrato?: number | null
          id_inmuebles?: number | null
          id_propietarios?: number | null
          observacion: string
        }
        Update: {
          eliminado?: boolean | null
          fecha_creacion?: string | null
          id?: number
          id_alcance?: number | null
          id_contratos?: number | null
          id_inmueble_propietario_contrato?: number | null
          id_inmuebles?: number | null
          id_propietarios?: number | null
          observacion?: string
        }
        Relationships: [
          {
            foreignKeyName: "historial_observaciones_id_alcance_fkey"
            columns: ["id_alcance"]
            isOneToOne: false
            referencedRelation: "alcances"
            referencedColumns: ["id_alcance"]
          },
          {
            foreignKeyName: "historial_observaciones_id_contratos_fkey"
            columns: ["id_contratos"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "historial_observaciones_id_contratos_fkey"
            columns: ["id_contratos"]
            isOneToOne: false
            referencedRelation: "vista_revisiones"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "historial_observaciones_id_contratos_fkey"
            columns: ["id_contratos"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "historial_observaciones_id_inmueble_propietario_contrato_fkey"
            columns: ["id_inmueble_propietario_contrato"]
            isOneToOne: false
            referencedRelation: "propiedad_propietario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historial_observaciones_id_inmuebles_fkey"
            columns: ["id_inmuebles"]
            isOneToOne: false
            referencedRelation: "inmuebles"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "historial_observaciones_id_propietarios_fkey"
            columns: ["id_propietarios"]
            isOneToOne: false
            referencedRelation: "propietarios"
            referencedColumns: ["id_propietario"]
          },
        ]
      }
      inmuebles: {
        Row: {
          area_construida: number | null
          area_terreno: number | null
          captacion: string | null
          create_at: string | null
          deleted_at: string | null
          descripcion: string | null
          direccion: string | null
          eliminado: boolean
          estado: string | null
          fecha_est_titulo: string | null
          fotos: boolean | null
          id_conformidad: number | null
          id_distrito: number | null
          id_inmueble: number | null
          id_mes_captacion: number | null
          id_propiedad: number
          id_remax: number | null
          id_resource_est_titulo: number | null
          id_resource_partida: number | null
          id_tipo_propiedad: number | null
          n_partida: string | null
          observacion: string | null
          timestamp: string | null
        }
        Insert: {
          area_construida?: number | null
          area_terreno?: number | null
          captacion?: string | null
          create_at?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          eliminado?: boolean
          estado?: string | null
          fecha_est_titulo?: string | null
          fotos?: boolean | null
          id_conformidad?: number | null
          id_distrito?: number | null
          id_inmueble?: number | null
          id_mes_captacion?: number | null
          id_propiedad?: number
          id_remax?: number | null
          id_resource_est_titulo?: number | null
          id_resource_partida?: number | null
          id_tipo_propiedad?: number | null
          n_partida?: string | null
          observacion?: string | null
          timestamp?: string | null
        }
        Update: {
          area_construida?: number | null
          area_terreno?: number | null
          captacion?: string | null
          create_at?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          direccion?: string | null
          eliminado?: boolean
          estado?: string | null
          fecha_est_titulo?: string | null
          fotos?: boolean | null
          id_conformidad?: number | null
          id_distrito?: number | null
          id_inmueble?: number | null
          id_mes_captacion?: number | null
          id_propiedad?: number
          id_remax?: number | null
          id_resource_est_titulo?: number | null
          id_resource_partida?: number | null
          id_tipo_propiedad?: number | null
          n_partida?: string | null
          observacion?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inmuebles_id_inmueble_fkey"
            columns: ["id_inmueble"]
            isOneToOne: false
            referencedRelation: "inmuebles"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "inmuebles_id_mes_captacion_fkey"
            columns: ["id_mes_captacion"]
            isOneToOne: false
            referencedRelation: "mes"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "propiedades_id_resource_est_titulo_fkey"
            columns: ["id_resource_est_titulo"]
            isOneToOne: false
            referencedRelation: "resource"
            referencedColumns: ["id_resource"]
          },
          {
            foreignKeyName: "propiedades_id_resource_fkey"
            columns: ["id_resource_partida"]
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
            referencedRelation: "vista_revisiones"
            referencedColumns: ["id_operacion"]
          },
          {
            foreignKeyName: "items_checklist_id_operacion_inmobiliaria_fkey"
            columns: ["id_operacion_inmobiliaria"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_operacion"]
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
          color: string | null
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          id: number
          operacion: string
        }
        Insert: {
          color?: string | null
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id?: number
          operacion: string
        }
        Update: {
          color?: string | null
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
          correo_electronico: string | null
          correo_electronico_2: string | null
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
          numero_telefono_2: string | null
          url_dni: string | null
          url_foto: string | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          correo_electronico?: string | null
          correo_electronico_2?: string | null
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
          numero_telefono_2?: string | null
          url_dni?: string | null
          url_foto?: string | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          correo_electronico?: string | null
          correo_electronico_2?: string | null
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
          numero_telefono_2?: string | null
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
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      propiedad_propietario: {
        Row: {
          deleted_at: string | null
          eliminado: boolean | null
          id: number
          id_contrato: number | null
          id_propiedad: number | null
          id_propietario: number | null
          observacion: string | null
          resumen_operacion: string | null
        }
        Insert: {
          deleted_at?: string | null
          eliminado?: boolean | null
          id?: number
          id_contrato?: number | null
          id_propiedad?: number | null
          id_propietario?: number | null
          observacion?: string | null
          resumen_operacion?: string | null
        }
        Update: {
          deleted_at?: string | null
          eliminado?: boolean | null
          id?: number
          id_contrato?: number | null
          id_propiedad?: number | null
          id_propietario?: number | null
          observacion?: string | null
          resumen_operacion?: string | null
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
            referencedRelation: "vista_revisiones"
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
            referencedRelation: "inmuebles"
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
      propietarios: {
        Row: {
          contacto: string | null
          eliminado: boolean
          id_empresas: number | null
          id_personas: number | null
          id_propietario: number
          id_situacion: number | null
          nombre_completo: string | null
        }
        Insert: {
          contacto?: string | null
          eliminado?: boolean
          id_empresas?: number | null
          id_personas?: number | null
          id_propietario?: number
          id_situacion?: number | null
          nombre_completo?: string | null
        }
        Update: {
          contacto?: string | null
          eliminado?: boolean
          id_empresas?: number | null
          id_personas?: number | null
          id_propietario?: number
          id_situacion?: number | null
          nombre_completo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propietarios_id_empresa_fkey"
            columns: ["id_empresas"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propietarios_id_personas_fkey"
            columns: ["id_personas"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propietarios_id_situacion_fkey"
            columns: ["id_situacion"]
            isOneToOne: false
            referencedRelation: "situaciones"
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
          url_resource_2: string | null
          url_resource_3: string | null
          url_resource_4: string | null
          url_resource_5: string | null
          url_resource_6: string | null
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id_resource?: number
          url_resource: string
          url_resource_2?: string | null
          url_resource_3?: string | null
          url_resource_4?: string | null
          url_resource_5?: string | null
          url_resource_6?: string | null
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          id_resource?: number
          url_resource?: string
          url_resource_2?: string | null
          url_resource_3?: string | null
          url_resource_4?: string | null
          url_resource_5?: string | null
          url_resource_6?: string | null
        }
        Relationships: []
      }
      revisiones: {
        Row: {
          created_at: string
          eliminado: boolean
          fecha_creado: string | null
          fecha_recibido: string | null
          finalizado: boolean
          id_contrato: number | null
          id_estado_oficina: number
          id_estado_sigi: number
          id_inmueble: number | null
          id_propietario: number | null
          id_propietario_inmueble_contrato: number | null
          id_revision: number
          id_revisiones_configuracion: number | null
          id_revisor: number | null
          observacion: string | null
        }
        Insert: {
          created_at?: string
          eliminado?: boolean
          fecha_creado?: string | null
          fecha_recibido?: string | null
          finalizado?: boolean
          id_contrato?: number | null
          id_estado_oficina?: number
          id_estado_sigi?: number
          id_inmueble?: number | null
          id_propietario?: number | null
          id_propietario_inmueble_contrato?: number | null
          id_revision?: number
          id_revisiones_configuracion?: number | null
          id_revisor?: number | null
          observacion?: string | null
        }
        Update: {
          created_at?: string
          eliminado?: boolean
          fecha_creado?: string | null
          fecha_recibido?: string | null
          finalizado?: boolean
          id_contrato?: number | null
          id_estado_oficina?: number
          id_estado_sigi?: number
          id_inmueble?: number | null
          id_propietario?: number | null
          id_propietario_inmueble_contrato?: number | null
          id_revision?: number
          id_revisiones_configuracion?: number | null
          id_revisor?: number | null
          observacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revisiones_id_contrato_fkey"
            columns: ["id_contrato"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "revisiones_id_contrato_fkey"
            columns: ["id_contrato"]
            isOneToOne: false
            referencedRelation: "vista_revisiones"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "revisiones_id_contrato_fkey"
            columns: ["id_contrato"]
            isOneToOne: false
            referencedRelation: "vw_revisiones_detalle"
            referencedColumns: ["id_contrato"]
          },
          {
            foreignKeyName: "revisiones_id_estado_oficina_fkey1"
            columns: ["id_estado_oficina"]
            isOneToOne: false
            referencedRelation: "estados_revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_estado_sigi_fkey1"
            columns: ["id_estado_sigi"]
            isOneToOne: false
            referencedRelation: "estados_revision"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_inmueble_fkey"
            columns: ["id_inmueble"]
            isOneToOne: false
            referencedRelation: "inmuebles"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "revisiones_id_propietario_fkey"
            columns: ["id_propietario"]
            isOneToOne: false
            referencedRelation: "propietarios"
            referencedColumns: ["id_propietario"]
          },
          {
            foreignKeyName: "revisiones_id_propietario_inmueble_contrato_fkey"
            columns: ["id_propietario_inmueble_contrato"]
            isOneToOne: false
            referencedRelation: "propiedad_propietario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisiones_id_revisiones_configuracion_fkey"
            columns: ["id_revisiones_configuracion"]
            isOneToOne: false
            referencedRelation: "configuracion_revisiones"
            referencedColumns: ["id_revision"]
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
      situaciones: {
        Row: {
          created_at: string
          descripcion: string | null
          eliminado: boolean | null
          id: number
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          eliminado?: boolean | null
          id?: number
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          eliminado?: boolean | null
          id?: number
        }
        Relationships: []
      }
      tablas: {
        Row: {
          deleted_at: string | null
          descripcion: string | null
          eliminado: boolean
          estado: number | null
          grupo: string | null
          icon: string
          id: number
          nombre: string | null
          permiso: string | null
          prioridad: number | null
          tabla_id: number | null
        }
        Insert: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: number | null
          grupo?: string | null
          icon: string
          id?: number
          nombre?: string | null
          permiso?: string | null
          prioridad?: number | null
          tabla_id?: number | null
        }
        Update: {
          deleted_at?: string | null
          descripcion?: string | null
          eliminado?: boolean
          estado?: number | null
          grupo?: string | null
          icon?: string
          id?: number
          nombre?: string | null
          permiso?: string | null
          prioridad?: number | null
          tabla_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tablas_tabla_id_fkey"
            columns: ["tabla_id"]
            isOneToOne: false
            referencedRelation: "tablas"
            referencedColumns: ["id"]
          },
        ]
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
      vista_contratos: {
        Row: {
          fecha_contrato: string | null
          fecha_contrato_entregado: string | null
          fecha_contrato_recibido: string | null
          fecha_contrato_sigi: string | null
          fecha_est_titulo: string | null
          n_partida: string | null
          nombre_completo: string | null
          nro_contrato: string | null
        }
        Relationships: []
      }
      vista_revisiones: {
        Row: {
          estado_oficina: string | null
          estado_sigi: string | null
          fecha_creado: string | null
          fecha_recibido: string | null
          finalizado: boolean | null
          id_contrato: number | null
          id_operacion: number | null
          id_ref_propiedad_propietario_contrato: number | null
          nombre_item: string | null
          observacion: string | null
          operacion: string | null
          rev: string | null
        }
        Relationships: []
      }
      vw_revisiones_detalle: {
        Row: {
          estado_oficina: string | null
          estado_sigi: string | null
          fecha_creado: string | null
          fecha_recibido: string | null
          finalizado: boolean | null
          id_contrato: number | null
          id_operacion: number | null
          id_ref_propiedad_propietario_contrato: number | null
          id_revision: number | null
          nombre_item: string | null
          observacion: string | null
          operacion: string | null
          rev: string | null
        }
        Relationships: []
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
      estado_asociado: "activo" | "deshafiliado"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_asociado: ["activo", "deshafiliado"],
    },
  },
} as const
