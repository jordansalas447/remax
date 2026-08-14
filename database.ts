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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      asesores: {
        Row: {
          id_asesor: number
          nombre_asesor: string
        }
        Insert: {
          id_asesor?: number
          nombre_asesor: string
        }
        Update: {
          id_asesor?: number
          nombre_asesor?: string
        }
        Relationships: []
      }
      checklist_estado: {
        Row: {
          descripcion: string | null
          estado_oficina: boolean | null
          estado_sigi: boolean | null
          id_item: number
          id_revision: number
        }
        Insert: {
          descripcion?: string | null
          estado_oficina?: boolean | null
          estado_sigi?: boolean | null
          id_item: number
          id_revision: number
        }
        Update: {
          descripcion?: string | null
          estado_oficina?: boolean | null
          estado_sigi?: boolean | null
          id_item?: number
          id_revision?: number
        }
        Relationships: [
          {
            foreignKeyName: "checklist_estado_id_item_fkey"
            columns: ["id_item"]
            isOneToOne: false
            referencedRelation: "items_checklist"
            referencedColumns: ["id_item"]
          },
          {
            foreignKeyName: "checklist_estado_id_revision_fkey"
            columns: ["id_revision"]
            isOneToOne: false
            referencedRelation: "revisiones"
            referencedColumns: ["id_revision"]
          },
        ]
      }
      conformidad: {
        Row: {
          descripcion: string | null
          id: number
          tipo: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          tipo: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          tipo?: string
        }
        Relationships: []
      }
      contratos: {
        Row: {
          comision: number | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id_captacion: number | null
          id_conformidad: number | null
          id_contrato: number
          id_estado: number | null
          id_mes_captacion: number | null
          id_mes_vencimiento: number | null
          id_operacion: number | null
          id_propiedad: number
          id_tipo_contrato: string | null
          id_tipo_moneda: number | null
          operacion: string | null
          precio: number | null
          precio_alquiler_venta: number | null
          tipo_contrato: string | null
        }
        Insert: {
          comision?: number | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id_captacion?: number | null
          id_conformidad?: number | null
          id_contrato?: number
          id_estado?: number | null
          id_mes_captacion?: number | null
          id_mes_vencimiento?: number | null
          id_operacion?: number | null
          id_propiedad: number
          id_tipo_contrato?: string | null
          id_tipo_moneda?: number | null
          operacion?: string | null
          precio?: number | null
          precio_alquiler_venta?: number | null
          tipo_contrato?: string | null
        }
        Update: {
          comision?: number | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id_captacion?: number | null
          id_conformidad?: number | null
          id_contrato?: number
          id_estado?: number | null
          id_mes_captacion?: number | null
          id_mes_vencimiento?: number | null
          id_operacion?: number | null
          id_propiedad?: number
          id_tipo_contrato?: string | null
          id_tipo_moneda?: number | null
          operacion?: string | null
          precio?: number | null
          precio_alquiler_venta?: number | null
          tipo_contrato?: string | null
        }
        Relationships: [
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
            foreignKeyName: "contratos_id_tipo_contrato_fkey"
            columns: ["id_tipo_contrato"]
            isOneToOne: false
            referencedRelation: "tipo_contrato"
            referencedColumns: ["tipo_contrato"]
          },
          {
            foreignKeyName: "contratos_id_tipo_moneda_fkey"
            columns: ["id_tipo_moneda"]
            isOneToOne: false
            referencedRelation: "tipo_moneda"
            referencedColumns: ["id"]
          },
        ]
      }
      distritos: {
        Row: {
          distrito: string
          id: number
        }
        Insert: {
          distrito: string
          id?: number
        }
        Update: {
          distrito?: string
          id?: number
        }
        Relationships: []
      }
      estado: {
        Row: {
          descripcion: string | null
          estado: string
          id: number
        }
        Insert: {
          descripcion?: string | null
          estado: string
          id?: number
        }
        Update: {
          descripcion?: string | null
          estado?: string
          id?: number
        }
        Relationships: []
      }
      items_checklist: {
        Row: {
          id_item: number
          nombre_item: string
        }
        Insert: {
          id_item?: number
          nombre_item: string
        }
        Update: {
          id_item?: number
          nombre_item?: string
        }
        Relationships: []
      }
      mes: {
        Row: {
          descripcion: string | null
          id: number
          mes: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          mes: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          mes?: string
        }
        Relationships: []
      }
      operacion: {
        Row: {
          descripcion: string | null
          id: number
          operacion: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          operacion: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          operacion?: string
        }
        Relationships: []
      }
      propiedad_propietario: {
        Row: {
          id_propiedad: number
          id_propietario: number
        }
        Insert: {
          id_propiedad: number
          id_propietario: number
        }
        Update: {
          id_propiedad?: number
          id_propietario?: number
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
      propiedades: {
        Row: {
          area_construida: number | null
          area_terreno: number | null
          captacion: string | null
          descripcion: string | null
          direccion: string | null
          distrito: string | null
          estado: string | null
          fotos: boolean | null
          id_asesor: number | null
          id_distrito: number | null
          id_propiedad: number
          id_remax: number | null
          id_tipo_propiedad: number | null
          n_partida: string | null
          tipo_propiedad: string | null
        }
        Insert: {
          area_construida?: number | null
          area_terreno?: number | null
          captacion?: string | null
          descripcion?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: string | null
          fotos?: boolean | null
          id_asesor?: number | null
          id_distrito?: number | null
          id_propiedad?: number
          id_remax?: number | null
          id_tipo_propiedad?: number | null
          n_partida?: string | null
          tipo_propiedad?: string | null
        }
        Update: {
          area_construida?: number | null
          area_terreno?: number | null
          captacion?: string | null
          descripcion?: string | null
          direccion?: string | null
          distrito?: string | null
          estado?: string | null
          fotos?: boolean | null
          id_asesor?: number | null
          id_distrito?: number | null
          id_propiedad?: number
          id_remax?: number | null
          id_tipo_propiedad?: number | null
          n_partida?: string | null
          tipo_propiedad?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "propiedades_id_asesor_fkey"
            columns: ["id_asesor"]
            isOneToOne: false
            referencedRelation: "asesores"
            referencedColumns: ["id_asesor"]
          },
          {
            foreignKeyName: "propiedades_id_distrito_fkey"
            columns: ["id_distrito"]
            isOneToOne: false
            referencedRelation: "distritos"
            referencedColumns: ["id"]
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
          id_propietario: number
          nombres: string
        }
        Insert: {
          contacto?: string | null
          id_propietario?: number
          nombres: string
        }
        Update: {
          contacto?: string | null
          id_propietario?: number
          nombres?: string
        }
        Relationships: []
      }
      revisiones: {
        Row: {
          comentarios_docs: string | null
          conformidad_descripcion: string | null
          correo_elab_eett: string | null
          fecha_elab_eett: string | null
          fecha_entregado: string | null
          fecha_recibido: string | null
          fecha_sigi: string | null
          id_propiedad: number
          id_revision: number
          id_revisor: number | null
          levant_observ: string | null
          observaciones: string | null
        }
        Insert: {
          comentarios_docs?: string | null
          conformidad_descripcion?: string | null
          correo_elab_eett?: string | null
          fecha_elab_eett?: string | null
          fecha_entregado?: string | null
          fecha_recibido?: string | null
          fecha_sigi?: string | null
          id_propiedad: number
          id_revision?: number
          id_revisor?: number | null
          levant_observ?: string | null
          observaciones?: string | null
        }
        Update: {
          comentarios_docs?: string | null
          conformidad_descripcion?: string | null
          correo_elab_eett?: string | null
          fecha_elab_eett?: string | null
          fecha_entregado?: string | null
          fecha_recibido?: string | null
          fecha_sigi?: string | null
          id_propiedad?: number
          id_revision?: number
          id_revisor?: number | null
          levant_observ?: string | null
          observaciones?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revisiones_id_propiedad_fkey"
            columns: ["id_propiedad"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id_propiedad"]
          },
          {
            foreignKeyName: "revisiones_id_revisor_fkey"
            columns: ["id_revisor"]
            isOneToOne: false
            referencedRelation: "asesores"
            referencedColumns: ["id_asesor"]
          },
        ]
      }
      tipo_contrato: {
        Row: {
          descripcion: string | null
          id: number
          tipo_contrato: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          tipo_contrato: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          tipo_contrato?: string
        }
        Relationships: []
      }
      tipo_moneda: {
        Row: {
          id: number
          simbolo: string | null
          tipo_moneda: string
        }
        Insert: {
          id?: number
          simbolo?: string | null
          tipo_moneda: string
        }
        Update: {
          id?: number
          simbolo?: string | null
          tipo_moneda?: string
        }
        Relationships: []
      }
      tipo_propiedad: {
        Row: {
          descripcion: string | null
          id: number
          tipo_propiedad: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          tipo_propiedad: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          tipo_propiedad?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
