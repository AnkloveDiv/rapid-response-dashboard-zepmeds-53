export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string | null
          created_at: string | null
          customer_id: string
          id: string
          is_default: boolean | null
          latitude: number | null
          longitude: number | null
          state: string | null
          type: string
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address_line: string
          city?: string | null
          created_at?: string | null
          customer_id: string
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          type: string
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line?: string
          city?: string | null
          created_at?: string | null
          customer_id?: string
          id?: string
          is_default?: boolean | null
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          type?: string
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      ambulances: {
        Row: {
          created_at: string | null
          driver_name: string
          driver_phone: string
          id: string
          last_latitude: number | null
          last_longitude: number | null
          last_updated: string | null
          name: string
          status: string
          updated_at: string | null
          vehicle_number: string
        }
        Insert: {
          created_at?: string | null
          driver_name: string
          driver_phone: string
          id?: string
          last_latitude?: number | null
          last_longitude?: number | null
          last_updated?: string | null
          name: string
          status?: string
          updated_at?: string | null
          vehicle_number: string
        }
        Update: {
          created_at?: string | null
          driver_name?: string
          driver_phone?: string
          id?: string
          last_latitude?: number | null
          last_longitude?: number | null
          last_updated?: string | null
          name?: string
          status?: string
          updated_at?: string | null
          vehicle_number?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          default_address: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          default_address?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          default_address?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          order_id: string
          rider_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          order_id: string
          rider_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          order_id?: string
          rider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "earnings_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          emergency_request_id: string | null
          eta_minutes: number | null
          id: string
          notes: string | null
          responder_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          emergency_request_id?: string | null
          eta_minutes?: number | null
          id?: string
          notes?: string | null
          responder_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          emergency_request_id?: string | null
          eta_minutes?: number | null
          id?: string
          notes?: string | null
          responder_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_assignments_emergency_request_id_fkey"
            columns: ["emergency_request_id"]
            isOneToOne: false
            referencedRelation: "emergency_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emergency_assignments_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "emergency_responders"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_requests: {
        Row: {
          ambulance_id: string | null
          created_at: string | null
          id: string
          location: Json
          name: string
          notes: string | null
          patient_id: string | null
          phone: string
          status: string
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string | null
          id?: string
          location: Json
          name: string
          notes?: string | null
          patient_id?: string | null
          phone: string
          status?: string
          timestamp?: string
          updated_at?: string | null
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string | null
          id?: string
          location?: Json
          name?: string
          notes?: string | null
          patient_id?: string | null
          phone?: string
          status?: string
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_requests_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_responders: {
        Row: {
          created_at: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          name: string
          phone_number: string
          status: string
          updated_at: string | null
          vehicle_number: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          name: string
          phone_number: string
          status?: string
          updated_at?: string | null
          vehicle_number: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          name?: string
          phone_number?: string
          status?: string
          updated_at?: string | null
          vehicle_number?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string | null
          customer_id: string
          delivery_address: string
          delivery_location: string | null
          distance: number | null
          estimated_time: number | null
          id: string
          is_rider_assigned: boolean | null
          order_number: string
          payment_method: string | null
          pickup_location: string | null
          rider_id: string | null
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          customer_id: string
          delivery_address: string
          delivery_location?: string | null
          distance?: number | null
          estimated_time?: number | null
          id?: string
          is_rider_assigned?: boolean | null
          order_number: string
          payment_method?: string | null
          pickup_location?: string | null
          rider_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          customer_id?: string
          delivery_address?: string
          delivery_location?: string | null
          distance?: number | null
          estimated_time?: number | null
          id?: string
          is_rider_assigned?: boolean | null
          order_number?: string
          payment_method?: string | null
          pickup_location?: string | null
          rider_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          created_at: string | null
          emergency_contact: string | null
          id: string
          medical_notes: string | null
          name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          id?: string
          medical_notes?: string | null
          name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          id?: string
          medical_notes?: string | null
          name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          order_id: string
          updated_at: string | null
          verification_notes: string | null
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          order_id: string
          updated_at?: string | null
          verification_notes?: string | null
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          order_id?: string
          updated_at?: string | null
          verification_notes?: string | null
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      Product: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          requires_prescription: boolean
          stock_quantity: number
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          requires_prescription?: boolean
          stock_quantity?: number
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          requires_prescription?: boolean
          stock_quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          ambulance_id: string | null
          created_at: string | null
          description: string | null
          emergency_id: string | null
          id: string
          report_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string | null
          description?: string | null
          emergency_id?: string | null
          id?: string
          report_date?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string | null
          description?: string | null
          emergency_id?: string | null
          id?: string
          report_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_ambulance_id_fkey"
            columns: ["ambulance_id"]
            isOneToOne: false
            referencedRelation: "ambulances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_emergency_id_fkey"
            columns: ["emergency_id"]
            isOneToOne: false
            referencedRelation: "emergency_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          notification_type: string
          order_details: Json
          order_id: string
          rider_id: string
          status:
            | Database["public"]["Enums"]["rider_notification_status"]
            | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          notification_type: string
          order_details: Json
          order_id: string
          rider_id: string
          status?:
            | Database["public"]["Enums"]["rider_notification_status"]
            | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          notification_type?: string
          order_details?: Json
          order_id?: string
          rider_id?: string
          status?:
            | Database["public"]["Enums"]["rider_notification_status"]
            | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_notifications_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          created_at: string | null
          current_orders: number | null
          id: string
          last_active: string | null
          name: string
          online_status: boolean | null
          phone: string
          rider_code: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_orders?: number | null
          id?: string
          last_active?: string | null
          name: string
          online_status?: boolean | null
          phone: string
          rider_code: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_orders?: number | null
          id?: string
          last_active?: string | null
          name?: string
          online_status?: boolean | null
          phone?: string
          rider_code?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_health_profiles: {
        Row: {
          allergies: string[] | null
          blood_type: string | null
          created_at: string | null
          emergency_contacts: Json | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          emergency_contacts?: Json | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          emergency_contacts?: Json | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
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
      assign_ambulance_to_emergency: {
        Args: { emergency_id: string; ambulance_id: string }
        Returns: boolean
      }
      create_emergency_request: {
        Args: {
          name: string
          phone: string
          location: Json
          notes?: string
          status?: string
        }
        Returns: string
      }
      get_realtime_tables: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_rider_online: {
        Args: { last_active: string }
        Returns: boolean
      }
      update_ambulance_status: {
        Args: { a_id: string; new_status: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "rider"
      rider_notification_status: "pending" | "accepted" | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "rider"],
      rider_notification_status: ["pending", "accepted", "declined"],
    },
  },
} as const
