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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      availability_rules: {
        Row: {
          buffer_minutes: number | null
          created_at: string
          day_of_week: number | null
          end_time: string
          id: string
          is_active: boolean | null
          slot_duration: number | null
          start_time: string
          updated_at: string
        }
        Insert: {
          buffer_minutes?: number | null
          created_at?: string
          day_of_week?: number | null
          end_time: string
          id?: string
          is_active?: boolean | null
          slot_duration?: number | null
          start_time: string
          updated_at?: string
        }
        Update: {
          buffer_minutes?: number | null
          created_at?: string
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          slot_duration?: number | null
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      blocked_times: {
        Row: {
          created_at: string
          end_datetime: string
          id: string
          reason: string | null
          start_datetime: string
        }
        Insert: {
          created_at?: string
          end_datetime: string
          id?: string
          reason?: string | null
          start_datetime: string
        }
        Update: {
          created_at?: string
          end_datetime?: string
          id?: string
          reason?: string | null
          start_datetime?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          admin_notes: string | null
          client_email: string
          client_name: string
          client_phone: string | null
          created_at: string
          end_datetime: string
          id: string
          note: string | null
          service_id: string | null
          start_datetime: string
          status: Database["public"]["Enums"]["booking_status"] | null
          time_slot_id: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          client_email: string
          client_name: string
          client_phone?: string | null
          created_at?: string
          end_datetime: string
          id?: string
          note?: string | null
          service_id?: string | null
          start_datetime: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string | null
          created_at?: string
          end_datetime?: string
          id?: string
          note?: string | null
          service_id?: string | null
          start_datetime?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          time_slot_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          full_name: string
          gender: string | null
          id: string
          notes: string | null
          phone: string | null
          referral_source: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name: string
          gender?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          referral_source?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          referral_source?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          duration_minutes: number | null
          featured: boolean | null
          id: string
          is_published: boolean | null
          price_amount: number | null
          session_format: Database["public"]["Enums"]["session_format"] | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
          who_its_for: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          is_published?: boolean | null
          price_amount?: number | null
          session_format?: Database["public"]["Enums"]["session_format"] | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
          who_its_for?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          is_published?: boolean | null
          price_amount?: number | null
          session_format?: Database["public"]["Enums"]["session_format"] | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
          who_its_for?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          bio_long: string | null
          bio_short: string | null
          clinic_name: string | null
          created_at: string
          doctor_name: string | null
          email_public: string | null
          id: string
          languages: string[] | null
          policies: string | null
          timezone: string | null
          title: string | null
          updated_at: string
          whatsapp_phone: string | null
          whatsapp_template: string | null
        }
        Insert: {
          address?: string | null
          bio_long?: string | null
          bio_short?: string | null
          clinic_name?: string | null
          created_at?: string
          doctor_name?: string | null
          email_public?: string | null
          id?: string
          languages?: string[] | null
          policies?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          whatsapp_phone?: string | null
          whatsapp_template?: string | null
        }
        Update: {
          address?: string | null
          bio_long?: string | null
          bio_short?: string | null
          clinic_name?: string | null
          created_at?: string
          doctor_name?: string | null
          email_public?: string | null
          id?: string
          languages?: string[] | null
          policies?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          whatsapp_phone?: string | null
          whatsapp_template?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          display_name: string | null
          id: string
          is_published: boolean | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_published?: boolean | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_published?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string
          end_datetime: string
          id: string
          start_datetime: string
          status: Database["public"]["Enums"]["slot_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_datetime: string
          id?: string
          start_datetime: string
          status?: Database["public"]["Enums"]["slot_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_datetime?: string
          id?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["slot_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "canceled"
        | "no_show"
      message_status: "new" | "replied" | "archived"
      session_format: "online" | "in_person" | "both"
      slot_status: "available" | "booked"
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
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "canceled",
        "no_show",
      ],
      message_status: ["new", "replied", "archived"],
      session_format: ["online", "in_person", "both"],
      slot_status: ["available", "booked"],
    },
  },
} as const
