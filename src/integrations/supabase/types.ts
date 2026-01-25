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
      alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          city: string | null
          contractor: string | null
          created_at: string
          description: string
          entity_id: string | null
          id: string
          project: Database["public"]["Enums"]["project_type"]
          resolved: boolean
          severity: Database["public"]["Enums"]["alert_severity"]
          state: string | null
          supplier: string | null
          title: string
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          city?: string | null
          contractor?: string | null
          created_at?: string
          description: string
          entity_id?: string | null
          id?: string
          project: Database["public"]["Enums"]["project_type"]
          resolved?: boolean
          severity?: Database["public"]["Enums"]["alert_severity"]
          state?: string | null
          supplier?: string | null
          title: string
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          city?: string | null
          contractor?: string | null
          created_at?: string
          description?: string
          entity_id?: string | null
          id?: string
          project?: Database["public"]["Enums"]["project_type"]
          resolved?: boolean
          severity?: Database["public"]["Enums"]["alert_severity"]
          state?: string | null
          supplier?: string | null
          title?: string
        }
        Relationships: []
      }
      contractor_scores: {
        Row: {
          avg_completion_time: number
          avg_response_time: number
          completed: number
          contractor_name: string
          id: string
          repeat_occurrence: number
          score: number
          total_assigned: number
          updated_at: string
        }
        Insert: {
          avg_completion_time?: number
          avg_response_time?: number
          completed?: number
          contractor_name: string
          id?: string
          repeat_occurrence?: number
          score?: number
          total_assigned?: number
          updated_at?: string
        }
        Update: {
          avg_completion_time?: number
          avg_response_time?: number
          completed?: number
          contractor_name?: string
          id?: string
          repeat_occurrence?: number
          score?: number
          total_assigned?: number
          updated_at?: string
        }
        Relationships: []
      }
      potholes: {
        Row: {
          city: string
          contractor: string
          created_at: string
          date_reported: string
          days_open: number
          days_since_last_repair: number | null
          expected_sla: number
          id: string
          location: string
          monsoon_impact: boolean | null
          pothole_id: string
          previous_repairs: boolean
          sla_status: Database["public"]["Enums"]["sla_status"]
          state: string
          status: Database["public"]["Enums"]["pothole_status"]
          updated_at: string
        }
        Insert: {
          city: string
          contractor: string
          created_at?: string
          date_reported?: string
          days_open?: number
          days_since_last_repair?: number | null
          expected_sla?: number
          id?: string
          location: string
          monsoon_impact?: boolean | null
          pothole_id: string
          previous_repairs?: boolean
          sla_status?: Database["public"]["Enums"]["sla_status"]
          state: string
          status?: Database["public"]["Enums"]["pothole_status"]
          updated_at?: string
        }
        Update: {
          city?: string
          contractor?: string
          created_at?: string
          date_reported?: string
          days_open?: number
          days_since_last_repair?: number | null
          expected_sla?: number
          id?: string
          location?: string
          monsoon_impact?: boolean | null
          pothole_id?: string
          previous_repairs?: boolean
          sla_status?: Database["public"]["Enums"]["sla_status"]
          state?: string
          status?: Database["public"]["Enums"]["pothole_status"]
          updated_at?: string
        }
        Relationships: []
      }
      supplier_scores: {
        Row: {
          accuracy_rate: number
          delivery_on_time: number
          fulfilled_orders: number
          id: string
          phantom_stock_incidents: number
          score: number
          supplier_name: string
          total_orders: number
          updated_at: string
        }
        Insert: {
          accuracy_rate?: number
          delivery_on_time?: number
          fulfilled_orders?: number
          id?: string
          phantom_stock_incidents?: number
          score?: number
          supplier_name: string
          total_orders?: number
          updated_at?: string
        }
        Update: {
          accuracy_rate?: number
          delivery_on_time?: number
          fulfilled_orders?: number
          id?: string
          phantom_stock_incidents?: number
          score?: number
          supplier_name?: string
          total_orders?: number
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          actual_stock: number | null
          city: string
          created_at: string
          current_utilization: number
          disruption_risk: Database["public"]["Enums"]["disruption_risk"]
          id: string
          last_audit_date: string | null
          lead_time_days: number
          name: string
          phantom_stock_percentage: number
          production_capacity: number
          regional_factors: string[] | null
          reported_stock: number
          state: string
          status: Database["public"]["Enums"]["supplier_status"]
          supplier_id: string
          tier: Database["public"]["Enums"]["supplier_tier"]
          updated_at: string
        }
        Insert: {
          actual_stock?: number | null
          city: string
          created_at?: string
          current_utilization?: number
          disruption_risk?: Database["public"]["Enums"]["disruption_risk"]
          id?: string
          last_audit_date?: string | null
          lead_time_days?: number
          name: string
          phantom_stock_percentage?: number
          production_capacity?: number
          regional_factors?: string[] | null
          reported_stock?: number
          state: string
          status?: Database["public"]["Enums"]["supplier_status"]
          supplier_id: string
          tier?: Database["public"]["Enums"]["supplier_tier"]
          updated_at?: string
        }
        Update: {
          actual_stock?: number | null
          city?: string
          created_at?: string
          current_utilization?: number
          disruption_risk?: Database["public"]["Enums"]["disruption_risk"]
          id?: string
          last_audit_date?: string | null
          lead_time_days?: number
          name?: string
          phantom_stock_percentage?: number
          production_capacity?: number
          regional_factors?: string[] | null
          reported_stock?: number
          state?: string
          status?: Database["public"]["Enums"]["supplier_status"]
          supplier_id?: string
          tier?: Database["public"]["Enums"]["supplier_tier"]
          updated_at?: string
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
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_type:
        | "delay"
        | "quality"
        | "safety"
        | "performance"
        | "phantom_stock"
        | "disruption"
        | "capacity"
      disruption_risk: "low" | "medium" | "high" | "critical"
      pothole_status:
        | "reported"
        | "assigned"
        | "in_progress"
        | "repaired"
        | "closed"
      project_type:
        | "road_guardian"
        | "phantom_x"
        | "water_monitoring"
        | "power_outage"
        | "waste_collection"
      sla_status: "on_track" | "at_risk" | "breached"
      supplier_status:
        | "active"
        | "at_risk"
        | "disrupted"
        | "resolved"
        | "blacklisted"
      supplier_tier: "tier_1" | "tier_2" | "tier_3"
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
      alert_severity: ["low", "medium", "high", "critical"],
      alert_type: [
        "delay",
        "quality",
        "safety",
        "performance",
        "phantom_stock",
        "disruption",
        "capacity",
      ],
      disruption_risk: ["low", "medium", "high", "critical"],
      pothole_status: [
        "reported",
        "assigned",
        "in_progress",
        "repaired",
        "closed",
      ],
      project_type: [
        "road_guardian",
        "phantom_x",
        "water_monitoring",
        "power_outage",
        "waste_collection",
      ],
      sla_status: ["on_track", "at_risk", "breached"],
      supplier_status: [
        "active",
        "at_risk",
        "disrupted",
        "resolved",
        "blacklisted",
      ],
      supplier_tier: ["tier_1", "tier_2", "tier_3"],
    },
  },
} as const
