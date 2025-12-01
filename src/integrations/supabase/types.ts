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
      case_documents: {
        Row: {
          ai_summary: string | null
          case_id: string
          created_at: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          extracted_metadata: Json | null
          file_size: number | null
          file_url: string | null
          id: string
          is_verified: boolean | null
          mime_type: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          ai_summary?: string | null
          case_id: string
          created_at?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          extracted_metadata?: Json | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          ai_summary?: string | null
          case_id?: string
          created_at?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          extracted_metadata?: Json | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_verified?: boolean | null
          mime_type?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_documents_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_reassignment_log: {
        Row: {
          case_id: string
          changed_by: string | null
          created_at: string
          id: string
          new_assignee: string | null
          new_priority: Database["public"]["Enums"]["case_priority"]
          old_assignee: string | null
          old_priority: Database["public"]["Enums"]["case_priority"] | null
          reason: string | null
        }
        Insert: {
          case_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_assignee?: string | null
          new_priority: Database["public"]["Enums"]["case_priority"]
          old_assignee?: string | null
          old_priority?: Database["public"]["Enums"]["case_priority"] | null
          reason?: string | null
        }
        Update: {
          case_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_assignee?: string | null
          new_priority?: Database["public"]["Enums"]["case_priority"]
          old_assignee?: string | null
          old_priority?: Database["public"]["Enums"]["case_priority"] | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_reassignment_log_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_reassignment_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_schedules: {
        Row: {
          case_id: string
          courtroom: string | null
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          hearing_date: string
          hearing_type: string | null
          id: string
          notes: string | null
          status: string | null
        }
        Insert: {
          case_id: string
          courtroom?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          hearing_date: string
          hearing_type?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Update: {
          case_id?: string
          courtroom?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          hearing_date?: string
          hearing_type?: string | null
          id?: string
          notes?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_schedules_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_similarities: {
        Row: {
          case_id: string
          common_factors: string[] | null
          created_at: string | null
          id: string
          similar_case_id: string
          similarity_score: number
        }
        Insert: {
          case_id: string
          common_factors?: string[] | null
          created_at?: string | null
          id?: string
          similar_case_id: string
          similarity_score: number
        }
        Update: {
          case_id?: string
          common_factors?: string[] | null
          created_at?: string | null
          id?: string
          similar_case_id?: string
          similarity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_similarities_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_similarities_similar_case_id_fkey"
            columns: ["similar_case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          ai_priority_score: number | null
          assigned_judge_id: string | null
          case_number: string
          case_type: Database["public"]["Enums"]["case_type"]
          court_name: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_duration_months: number | null
          filing_date: string
          id: string
          metadata: Json | null
          next_hearing_date: string | null
          petitioner_lawyer_id: string | null
          petitioner_name: string
          priority: Database["public"]["Enums"]["case_priority"] | null
          respondent_lawyer_id: string | null
          respondent_name: string
          status: Database["public"]["Enums"]["case_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_priority_score?: number | null
          assigned_judge_id?: string | null
          case_number: string
          case_type: Database["public"]["Enums"]["case_type"]
          court_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration_months?: number | null
          filing_date?: string
          id?: string
          metadata?: Json | null
          next_hearing_date?: string | null
          petitioner_lawyer_id?: string | null
          petitioner_name: string
          priority?: Database["public"]["Enums"]["case_priority"] | null
          respondent_lawyer_id?: string | null
          respondent_name: string
          status?: Database["public"]["Enums"]["case_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_priority_score?: number | null
          assigned_judge_id?: string | null
          case_number?: string
          case_type?: Database["public"]["Enums"]["case_type"]
          court_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration_months?: number | null
          filing_date?: string
          id?: string
          metadata?: Json | null
          next_hearing_date?: string | null
          petitioner_lawyer_id?: string | null
          petitioner_name?: string
          priority?: Database["public"]["Enums"]["case_priority"] | null
          respondent_lawyer_id?: string | null
          respondent_name?: string
          status?: Database["public"]["Enums"]["case_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_assigned_judge_id_fkey"
            columns: ["assigned_judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_petitioner_lawyer_id_fkey"
            columns: ["petitioner_lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_respondent_lawyer_id_fkey"
            columns: ["respondent_lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_consultations: {
        Row: {
          context: Json | null
          created_at: string | null
          helpful_rating: number | null
          id: string
          query: string
          response: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          helpful_rating?: number | null
          id?: string
          query: string
          response?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          helpful_rating?: number | null
          id?: string
          query?: string
          response?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      legal_precedents: {
        Row: {
          case_type: Database["public"]["Enums"]["case_type"] | null
          citation: string
          court_name: string
          created_at: string | null
          full_text: string | null
          id: string
          judges: string[] | null
          judgment_date: string | null
          key_principles: string[] | null
          related_laws: string[] | null
          summary: string
          title: string
        }
        Insert: {
          case_type?: Database["public"]["Enums"]["case_type"] | null
          citation: string
          court_name: string
          created_at?: string | null
          full_text?: string | null
          id?: string
          judges?: string[] | null
          judgment_date?: string | null
          key_principles?: string[] | null
          related_laws?: string[] | null
          summary: string
          title: string
        }
        Update: {
          case_type?: Database["public"]["Enums"]["case_type"] | null
          citation?: string
          court_name?: string
          created_at?: string | null
          full_text?: string | null
          id?: string
          judges?: string[] | null
          judgment_date?: string | null
          key_principles?: string[] | null
          related_laws?: string[] | null
          summary?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bar_council_id: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          specialization: string | null
          updated_at: string | null
          years_of_experience: number | null
        }
        Insert: {
          bar_council_id?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Update: {
          bar_council_id?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          specialization?: string | null
          updated_at?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
    }
    Enums: {
      app_role: "admin" | "judge" | "lawyer" | "public_user"
      case_priority: "critical" | "high" | "medium" | "low"
      case_status:
        | "filed"
        | "under_review"
        | "hearing_scheduled"
        | "evidence_submission"
        | "judgment_pending"
        | "closed"
        | "appealed"
      case_type:
        | "civil"
        | "criminal"
        | "family"
        | "corporate"
        | "constitutional"
        | "tax"
        | "labor"
      document_type:
        | "petition"
        | "evidence"
        | "affidavit"
        | "order"
        | "judgment"
        | "notice"
        | "appeal"
        | "contract"
        | "other"
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
      app_role: ["admin", "judge", "lawyer", "public_user"],
      case_priority: ["critical", "high", "medium", "low"],
      case_status: [
        "filed",
        "under_review",
        "hearing_scheduled",
        "evidence_submission",
        "judgment_pending",
        "closed",
        "appealed",
      ],
      case_type: [
        "civil",
        "criminal",
        "family",
        "corporate",
        "constitutional",
        "tax",
        "labor",
      ],
      document_type: [
        "petition",
        "evidence",
        "affidavit",
        "order",
        "judgment",
        "notice",
        "appeal",
        "contract",
        "other",
      ],
    },
  },
} as const
