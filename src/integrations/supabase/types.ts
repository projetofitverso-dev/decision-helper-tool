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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alimentos: {
        Row: {
          calorias: number | null
          carboidratos: number | null
          categoria: string | null
          criado_em: string | null
          gorduras_totais: number | null
          id: string
          nome_do_alimento: string
          observacoes: string | null
          porcao_padrao: string | null
          proteina: number | null
          usuario_id: string
        }
        Insert: {
          calorias?: number | null
          carboidratos?: number | null
          categoria?: string | null
          criado_em?: string | null
          gorduras_totais?: number | null
          id?: string
          nome_do_alimento: string
          observacoes?: string | null
          porcao_padrao?: string | null
          proteina?: number | null
          usuario_id: string
        }
        Update: {
          calorias?: number | null
          carboidratos?: number | null
          categoria?: string | null
          criado_em?: string | null
          gorduras_totais?: number | null
          id?: string
          nome_do_alimento?: string
          observacoes?: string | null
          porcao_padrao?: string | null
          proteina?: number | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alimentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      alimentos_referencia: {
        Row: {
          alimento: string
          calorias: number | null
          carboidratos: number | null
          criado_em: string | null
          id: string
          lipideos: number | null
          proteinas: number | null
          quantidade: number | null
          tipo_alimento: string
        }
        Insert: {
          alimento: string
          calorias?: number | null
          carboidratos?: number | null
          criado_em?: string | null
          id?: string
          lipideos?: number | null
          proteinas?: number | null
          quantidade?: number | null
          tipo_alimento: string
        }
        Update: {
          alimento?: string
          calorias?: number | null
          carboidratos?: number | null
          criado_em?: string | null
          id?: string
          lipideos?: number | null
          proteinas?: number | null
          quantidade?: number | null
          tipo_alimento?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          animacoes: boolean
          atualizacoes_progresso: boolean
          atualizado_em: string
          criado_em: string
          id: string
          idioma: string
          lembrete_agua: boolean
          som_notificacoes: string
          tamanho_fonte: string
          tema: string
          usuario_id: string
        }
        Insert: {
          animacoes?: boolean
          atualizacoes_progresso?: boolean
          atualizado_em?: string
          criado_em?: string
          id?: string
          idioma?: string
          lembrete_agua?: boolean
          som_notificacoes?: string
          tamanho_fonte?: string
          tema?: string
          usuario_id: string
        }
        Update: {
          animacoes?: boolean
          atualizacoes_progresso?: boolean
          atualizado_em?: string
          criado_em?: string
          id?: string
          idioma?: string
          lembrete_agua?: boolean
          som_notificacoes?: string
          tamanho_fonte?: string
          tema?: string
          usuario_id?: string
        }
        Relationships: []
      }
      consumo_agua: {
        Row: {
          criado_em: string | null
          id: string
          nome_usuario: string | null
          observacoes: string | null
          quantidade_ml: number
          registrado_em: string | null
          usuario_id: string
        }
        Insert: {
          criado_em?: string | null
          id?: string
          nome_usuario?: string | null
          observacoes?: string | null
          quantidade_ml: number
          registrado_em?: string | null
          usuario_id: string
        }
        Update: {
          criado_em?: string | null
          id?: string
          nome_usuario?: string | null
          observacoes?: string | null
          quantidade_ml?: number
          registrado_em?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumo_agua_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      medidas: {
        Row: {
          abdomen: number | null
          altura: number | null
          cintura: number | null
          criado_em: string | null
          id: string
          idade: number | null
          medido_em: string | null
          observacoes: string | null
          peso: number
          quadril: number | null
          usuario_id: string
        }
        Insert: {
          abdomen?: number | null
          altura?: number | null
          cintura?: number | null
          criado_em?: string | null
          id?: string
          idade?: number | null
          medido_em?: string | null
          observacoes?: string | null
          peso: number
          quadril?: number | null
          usuario_id: string
        }
        Update: {
          abdomen?: number | null
          altura?: number | null
          cintura?: number | null
          criado_em?: string | null
          id?: string
          idade?: number | null
          medido_em?: string | null
          observacoes?: string | null
          peso?: number
          quadril?: number | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medidas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          altura: number | null
          atualizado_em: string | null
          avatar_url: string | null
          criado_em: string | null
          data_nascimento: string | null
          fator_atividade: string | null
          genero: string | null
          id: string
          localizacao: string | null
          nome_completo: string | null
          peso_alvo: number | null
          peso_atual: number | null
          telefone: string | null
        }
        Insert: {
          altura?: number | null
          atualizado_em?: string | null
          avatar_url?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          fator_atividade?: string | null
          genero?: string | null
          id: string
          localizacao?: string | null
          nome_completo?: string | null
          peso_alvo?: number | null
          peso_atual?: number | null
          telefone?: string | null
        }
        Update: {
          altura?: number | null
          atualizado_em?: string | null
          avatar_url?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          fator_atividade?: string | null
          genero?: string | null
          id?: string
          localizacao?: string | null
          nome_completo?: string | null
          peso_alvo?: number | null
          peso_atual?: number | null
          telefone?: string | null
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
