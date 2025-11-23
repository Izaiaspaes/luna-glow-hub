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
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          related_user_id: string | null
          severity: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          related_user_id?: string | null
          severity?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          related_user_id?: string | null
          severity?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      cycle_tracking: {
        Row: {
          created_at: string
          cycle_end_date: string | null
          cycle_length: number | null
          cycle_start_date: string
          flow_intensity: string | null
          id: string
          notes: string | null
          period_length: number | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length?: number | null
          cycle_start_date: string
          flow_intensity?: string | null
          id?: string
          notes?: string | null
          period_length?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length?: number | null
          cycle_start_date?: string
          flow_intensity?: string | null
          id?: string
          notes?: string | null
          period_length?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      energy_tracking: {
        Row: {
          created_at: string
          energy_date: string
          energy_level: number | null
          id: string
          notes: string | null
          time_of_day: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_date: string
          energy_level?: number | null
          id?: string
          notes?: string | null
          time_of_day?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          energy_date?: string
          energy_level?: number | null
          id?: string
          notes?: string | null
          time_of_day?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          code: string
          created_at: string
          created_by: string
          current_uses: number
          email: string | null
          expires_at: string
          id: string
          is_active: boolean
          max_uses: number
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          email?: string | null
          expires_at: string
          id?: string
          is_active?: boolean
          max_uses?: number
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          email?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean
          max_uses?: number
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      mood_tracking: {
        Row: {
          created_at: string
          id: string
          mood_date: string
          mood_level: number | null
          mood_type: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood_date: string
          mood_level?: number | null
          mood_type?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood_date?: string
          mood_level?: number | null
          mood_type?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          metadata: Json | null
          source: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          source?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      partner_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          notification_type: string
          phase: string | null
          read: boolean
          relationship_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          notification_type: string
          phase?: string | null
          read?: boolean
          relationship_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          notification_type?: string
          phase?: string | null
          read?: boolean
          relationship_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_notifications_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "partner_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_relationships: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invite_token: string
          invited_at: string
          owner_user_id: string
          partner_email: string
          partner_user_id: string | null
          sharing_settings: Json
          status: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invite_token: string
          invited_at?: string
          owner_user_id: string
          partner_email: string
          partner_user_id?: string | null
          sharing_settings?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invite_token?: string
          invited_at?: string
          owner_user_id?: string
          partner_email?: string
          partner_user_id?: string | null
          sharing_settings?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          encryption_enabled: boolean | null
          full_name: string | null
          id: string
          phone: string | null
          privacy_mode: boolean | null
          subscription_plan: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          encryption_enabled?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          privacy_mode?: boolean | null
          subscription_plan?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          encryption_enabled?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          privacy_mode?: boolean | null
          subscription_plan?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          days_of_week: number[]
          id: string
          is_active: boolean
          message: string | null
          reminder_time: string
          tracking_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_active?: boolean
          message?: string | null
          reminder_time: string
          tracking_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          id?: string
          is_active?: boolean
          message?: string | null
          reminder_time?: string
          tracking_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_tracking: {
        Row: {
          bedtime: string | null
          created_at: string
          id: string
          notes: string | null
          sleep_date: string
          sleep_duration_hours: number | null
          sleep_quality: number | null
          updated_at: string
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          sleep_date: string
          sleep_duration_hours?: number | null
          sleep_quality?: number | null
          updated_at?: string
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          sleep_date?: string
          sleep_duration_hours?: number | null
          sleep_quality?: number | null
          updated_at?: string
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      symptom_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          id: string
          predicted_phase: string
          predicted_symptoms: Json
          prediction_date: string
          recommendations: Json
          user_id: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          id?: string
          predicted_phase: string
          predicted_symptoms?: Json
          prediction_date: string
          recommendations?: Json
          user_id: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          id?: string
          predicted_phase?: string
          predicted_symptoms?: Json
          prediction_date?: string
          recommendations?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_onboarding_data: {
        Row: {
          age: number | null
          birth_city: string | null
          birth_coordinates: Json | null
          birth_country: string | null
          birth_date: string | null
          birth_time: string | null
          body_shapes: string[] | null
          care_improvement_goals: string[] | null
          completed_at: string | null
          content_preferences: string[] | null
          created_at: string
          current_care_routines: string[] | null
          current_city: string | null
          current_country: string | null
          eye_color: string | null
          favorite_color: string | null
          full_name: string | null
          hair_color: string | null
          hair_length: string | null
          hair_type: string | null
          height: number | null
          hobbies: string[] | null
          id: string
          life_area_to_improve: string | null
          main_app_goal: string | null
          most_explored_life_area: string | null
          nail_preference: string | null
          notification_frequency: string | null
          personal_interests: string | null
          profession: string | null
          self_love_notes: string | null
          skin_tone: string | null
          skin_types: string[] | null
          social_name: string | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          birth_city?: string | null
          birth_coordinates?: Json | null
          birth_country?: string | null
          birth_date?: string | null
          birth_time?: string | null
          body_shapes?: string[] | null
          care_improvement_goals?: string[] | null
          completed_at?: string | null
          content_preferences?: string[] | null
          created_at?: string
          current_care_routines?: string[] | null
          current_city?: string | null
          current_country?: string | null
          eye_color?: string | null
          favorite_color?: string | null
          full_name?: string | null
          hair_color?: string | null
          hair_length?: string | null
          hair_type?: string | null
          height?: number | null
          hobbies?: string[] | null
          id?: string
          life_area_to_improve?: string | null
          main_app_goal?: string | null
          most_explored_life_area?: string | null
          nail_preference?: string | null
          notification_frequency?: string | null
          personal_interests?: string | null
          profession?: string | null
          self_love_notes?: string | null
          skin_tone?: string | null
          skin_types?: string[] | null
          social_name?: string | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          birth_city?: string | null
          birth_coordinates?: Json | null
          birth_country?: string | null
          birth_date?: string | null
          birth_time?: string | null
          body_shapes?: string[] | null
          care_improvement_goals?: string[] | null
          completed_at?: string | null
          content_preferences?: string[] | null
          created_at?: string
          current_care_routines?: string[] | null
          current_city?: string | null
          current_country?: string | null
          eye_color?: string | null
          favorite_color?: string | null
          full_name?: string | null
          hair_color?: string | null
          hair_length?: string | null
          hair_type?: string | null
          height?: number | null
          hobbies?: string[] | null
          id?: string
          life_area_to_improve?: string | null
          main_app_goal?: string | null
          most_explored_life_area?: string | null
          nail_preference?: string | null
          notification_frequency?: string | null
          personal_interests?: string | null
          profession?: string | null
          self_love_notes?: string | null
          skin_tone?: string | null
          skin_types?: string[] | null
          social_name?: string | null
          updated_at?: string
          user_id?: string
          weight?: number | null
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
      wellness_plans: {
        Row: {
          ai_recommendations: string
          archived_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          is_active: boolean | null
          plan_content: Json
          plan_type: string | null
          status: string | null
          updated_at: string
          user_id: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          ai_recommendations: string
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          plan_content: Json
          plan_type?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          ai_recommendations?: string
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          plan_content?: Json
          plan_type?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_users_with_profiles: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          phone: string
          roles: Json
          subscription_plan: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_user_admin: { Args: { _email: string }; Returns: undefined }
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
