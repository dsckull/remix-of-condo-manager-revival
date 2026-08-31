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
      alertas_defcom: {
        Row: {
          created_at: string
          data_ocorrencia: string
          data_resolucao: string | null
          descricao: string | null
          id: number
          local: string | null
          nivel: string
          observacoes: string | null
          reportado_por: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_ocorrencia?: string
          data_resolucao?: string | null
          descricao?: string | null
          id?: number
          local?: string | null
          nivel?: string
          observacoes?: string | null
          reportado_por?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_ocorrencia?: string
          data_resolucao?: string | null
          descricao?: string | null
          id?: number
          local?: string | null
          nivel?: string
          observacoes?: string | null
          reportado_por?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      areas_comuns: {
        Row: {
          capacidade: number | null
          created_at: string
          descricao: string | null
          disponivel: boolean
          foto_url: string | null
          id: number
          nome: string
          regras: string | null
          updated_at: string
        }
        Insert: {
          capacidade?: number | null
          created_at?: string
          descricao?: string | null
          disponivel?: boolean
          foto_url?: string | null
          id?: number
          nome: string
          regras?: string | null
          updated_at?: string
        }
        Update: {
          capacidade?: number | null
          created_at?: string
          descricao?: string | null
          disponivel?: boolean
          foto_url?: string | null
          id?: number
          nome?: string
          regras?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      assembleias: {
        Row: {
          ata_url: string | null
          created_at: string
          data_realizacao: string
          descricao: string | null
          id: number
          local: string | null
          observacoes: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ata_url?: string | null
          created_at?: string
          data_realizacao: string
          descricao?: string | null
          id?: number
          local?: string | null
          observacoes?: string | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ata_url?: string | null
          created_at?: string
          data_realizacao?: string
          descricao?: string | null
          id?: number
          local?: string | null
          observacoes?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      condominios: {
        Row: {
          cnpj: string | null
          created_at: string
          endereco: string | null
          id: number
          nome: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          endereco?: string | null
          id?: number
          nome: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          endereco?: string | null
          id?: number
          nome?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      documentos_juridicos: {
        Row: {
          arquivo_url: string | null
          created_at: string
          data_documento: string | null
          descricao: string | null
          id: number
          observacoes: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
          validade: string | null
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          data_documento?: string | null
          descricao?: string | null
          id?: number
          observacoes?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
          validade?: string | null
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          data_documento?: string | null
          descricao?: string | null
          id?: number
          observacoes?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          validade?: string | null
        }
        Relationships: []
      }
      encomendas: {
        Row: {
          created_at: string
          data_recebimento: string
          data_retirada: string | null
          descricao: string
          id: number
          morador_id: number
          observacoes: string | null
          recebido_por: string | null
          retirado_por: string | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_recebimento?: string
          data_retirada?: string | null
          descricao: string
          id?: number
          morador_id: number
          observacoes?: string | null
          recebido_por?: string | null
          retirado_por?: string | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_recebimento?: string
          data_retirada?: string | null
          descricao?: string
          id?: number
          morador_id?: number
          observacoes?: string | null
          recebido_por?: string | null
          retirado_por?: string | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "encomendas_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          categoria: string
          created_at: string
          data_pagamento: string | null
          data_vencimento: string | null
          descricao: string
          id: number
          morador_id: number | null
          observacoes: string | null
          status: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria?: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao: string
          id?: number
          morador_id?: number | null
          observacoes?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string | null
          descricao?: string
          id?: number
          morador_id?: number | null
          observacoes?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          cargo: string | null
          condominio: string | null
          created_at: string
          email: string
          id: string
          mensagem: string | null
          nome: string
          origem: string | null
          plano_interesse: string | null
          telefone: string | null
          unidades: number | null
        }
        Insert: {
          cargo?: string | null
          condominio?: string | null
          created_at?: string
          email: string
          id?: string
          mensagem?: string | null
          nome: string
          origem?: string | null
          plano_interesse?: string | null
          telefone?: string | null
          unidades?: number | null
        }
        Update: {
          cargo?: string | null
          condominio?: string | null
          created_at?: string
          email?: string
          id?: string
          mensagem?: string | null
          nome?: string
          origem?: string | null
          plano_interesse?: string | null
          telefone?: string | null
          unidades?: number | null
        }
        Relationships: []
      }
      logs_interacao: {
        Row: {
          canal: string | null
          created_at: string
          id: number
          mensagem: string
          morador_id: number | null
          resposta: string | null
          tipo: string
        }
        Insert: {
          canal?: string | null
          created_at?: string
          id?: number
          mensagem: string
          morador_id?: number | null
          resposta?: string | null
          tipo?: string
        }
        Update: {
          canal?: string | null
          created_at?: string
          id?: number
          mensagem?: string
          morador_id?: number | null
          resposta?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_interacao_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      moradores: {
        Row: {
          apartamento: string
          bloco: string
          cpf: string | null
          created_at: string
          data_entrada: string | null
          email: string | null
          foto_url: string | null
          id: number
          nome: string
          observacoes: string | null
          status: string
          telefone: string | null
          updated_at: string
          veiculo_placa: string | null
        }
        Insert: {
          apartamento: string
          bloco?: string
          cpf?: string | null
          created_at?: string
          data_entrada?: string | null
          email?: string | null
          foto_url?: string | null
          id?: number
          nome: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          veiculo_placa?: string | null
        }
        Update: {
          apartamento?: string
          bloco?: string
          cpf?: string | null
          created_at?: string
          data_entrada?: string | null
          email?: string | null
          foto_url?: string | null
          id?: number
          nome?: string
          observacoes?: string | null
          status?: string
          telefone?: string | null
          updated_at?: string
          veiculo_placa?: string | null
        }
        Relationships: []
      }
      notificacoes_juridicas: {
        Row: {
          created_at: string
          data_envio: string
          data_prazo: string | null
          descricao: string | null
          id: number
          morador_id: number
          observacoes: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_envio?: string
          data_prazo?: string | null
          descricao?: string | null
          id?: number
          morador_id: number
          observacoes?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_envio?: string
          data_prazo?: string | null
          descricao?: string | null
          id?: number
          morador_id?: number
          observacoes?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_juridicas_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          created_at: string
          data_abertura: string
          data_fechamento: string | null
          descricao: string
          id: number
          morador_id: number | null
          observacoes: string | null
          prioridade: string
          responsavel: string | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_abertura?: string
          data_fechamento?: string | null
          descricao: string
          id?: number
          morador_id?: number | null
          observacoes?: string | null
          prioridade?: string
          responsavel?: string | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_abertura?: string
          data_fechamento?: string | null
          descricao?: string
          id?: number
          morador_id?: number | null
          observacoes?: string | null
          prioridade?: string
          responsavel?: string | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          condominio_ativo_id: number | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          condominio_ativo_id?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          condominio_ativo_id?: number | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_condominio_ativo_fkey"
            columns: ["condominio_ativo_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
      reservas: {
        Row: {
          area_id: number
          created_at: string
          data_reserva: string
          hora_fim: string
          hora_inicio: string
          id: number
          morador_id: number
          observacoes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          area_id: number
          created_at?: string
          data_reserva: string
          hora_fim: string
          hora_inicio: string
          id?: number
          morador_id: number
          observacoes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          area_id?: number
          created_at?: string
          data_reserva?: string
          hora_fim?: string
          hora_inicio?: string
          id?: number
          morador_id?: number
          observacoes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_comuns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservas_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: number
          plano: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: number
          plano?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: number
          plano?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitantes: {
        Row: {
          apartamento_destino: string | null
          autorizado_por: string | null
          created_at: string
          data_entrada: string
          data_saida: string | null
          dentro: boolean
          documento: string | null
          id: number
          morador_id: number | null
          nome: string
          observacoes: string | null
          tipo: string
          updated_at: string
          veiculo_placa: string | null
        }
        Insert: {
          apartamento_destino?: string | null
          autorizado_por?: string | null
          created_at?: string
          data_entrada?: string
          data_saida?: string | null
          dentro?: boolean
          documento?: string | null
          id?: number
          morador_id?: number | null
          nome: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
          veiculo_placa?: string | null
        }
        Update: {
          apartamento_destino?: string | null
          autorizado_por?: string | null
          created_at?: string
          data_entrada?: string
          data_saida?: string | null
          dentro?: boolean
          documento?: string | null
          id?: number
          morador_id?: number | null
          nome?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
          veiculo_placa?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitantes_morador_id_fkey"
            columns: ["morador_id"]
            isOneToOne: false
            referencedRelation: "moradores"
            referencedColumns: ["id"]
          },
        ]
      }
      votacoes: {
        Row: {
          assembleia_id: number
          created_at: string
          descricao: string | null
          id: number
          opcoes: Json
          resultado: Json | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          assembleia_id: number
          created_at?: string
          descricao?: string | null
          id?: number
          opcoes?: Json
          resultado?: Json | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          assembleia_id?: number
          created_at?: string
          descricao?: string | null
          id?: number
          opcoes?: Json
          resultado?: Json | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votacoes_assembleia_id_fkey"
            columns: ["assembleia_id"]
            isOneToOne: false
            referencedRelation: "assembleias"
            referencedColumns: ["id"]
          },
        ]
      }
      votacoes_sindicancia: {
        Row: {
          condominio_id: number | null
          created_at: string
          created_by: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          id: number
          resultado: Json | null
          status: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          condominio_id?: number | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: number
          resultado?: Json | null
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          condominio_id?: number | null
          created_at?: string
          created_by?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: number
          resultado?: Json | null
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "votacoes_sindicancia_condominio_fkey"
            columns: ["condominio_id"]
            isOneToOne: false
            referencedRelation: "condominios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
