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
      admission_reports: {
        Row: {
          admission_id: string
          created_at: string
          id: string
          report_link: string
        }
        Insert: {
          admission_id: string
          created_at?: string
          id?: string
          report_link: string
        }
        Update: {
          admission_id?: string
          created_at?: string
          id?: string
          report_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "admission_reports_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
        ]
      }
      admissions: {
        Row: {
          created_at: string
          date_in: string
          date_out: string | null
          discharged: boolean | null
          feedback: string | null
          hospital_id: string
          id: string
          patient_id: string
          recovered: boolean | null
          time_in: string
          time_out: string | null
        }
        Insert: {
          created_at?: string
          date_in: string
          date_out?: string | null
          discharged?: boolean | null
          feedback?: string | null
          hospital_id: string
          id?: string
          patient_id: string
          recovered?: boolean | null
          time_in: string
          time_out?: string | null
        }
        Update: {
          created_at?: string
          date_in?: string
          date_out?: string | null
          discharged?: boolean | null
          feedback?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string
          recovered?: boolean | null
          time_in?: string
          time_out?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admissions_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          consultation_date: string
          consultation_time: string
          created_at: string
          doctor_id: string
          id: string
          patient_id: string
          place: string
          place_id: string | null
          prescription: string | null
          report_link: string | null
        }
        Insert: {
          consultation_date: string
          consultation_time: string
          created_at?: string
          doctor_id: string
          id?: string
          patient_id: string
          place: string
          place_id?: string | null
          prescription?: string | null
          report_link?: string | null
        }
        Update: {
          consultation_date?: string
          consultation_time?: string
          created_at?: string
          doctor_id?: string
          id?: string
          patient_id?: string
          place?: string
          place_id?: string | null
          prescription?: string | null
          report_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          clinic_country: string | null
          clinic_district: string | null
          clinic_house_number: string | null
          clinic_pincode: string | null
          clinic_state: string | null
          clinic_street: string | null
          clinic_village: string | null
          created_at: string
          dob: string
          email: string
          hospital_id: string | null
          id: string
          mobile_number: string
          name: string
          password: string | null
          speciality: string
          user_id: string | null
        }
        Insert: {
          clinic_country?: string | null
          clinic_district?: string | null
          clinic_house_number?: string | null
          clinic_pincode?: string | null
          clinic_state?: string | null
          clinic_street?: string | null
          clinic_village?: string | null
          created_at?: string
          dob: string
          email: string
          hospital_id?: string | null
          id?: string
          mobile_number: string
          name: string
          password?: string | null
          speciality: string
          user_id?: string | null
        }
        Update: {
          clinic_country?: string | null
          clinic_district?: string | null
          clinic_house_number?: string | null
          clinic_pincode?: string | null
          clinic_state?: string | null
          clinic_street?: string | null
          clinic_village?: string | null
          created_at?: string
          dob?: string
          email?: string
          hospital_id?: string | null
          id?: string
          mobile_number?: string
          name?: string
          password?: string | null
          speciality?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          country: string | null
          created_at: string
          district: string | null
          email: string
          house_number: number | null
          id: string
          license_number: string
          mobile: number
          name: string
          number_of_doctors: number
          number_of_icus: number
          number_of_op_rooms: number
          password: string | null
          pincode: number | null
          speciality: string | null
          state: string | null
          street: string | null
          type: string
          user_id: string | null
          village: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          district?: string | null
          email: string
          house_number?: number | null
          id?: string
          license_number: string
          mobile: number
          name: string
          number_of_doctors?: number
          number_of_icus?: number
          number_of_op_rooms?: number
          password?: string | null
          pincode?: number | null
          speciality?: string | null
          state?: string | null
          street?: string | null
          type: string
          user_id?: string | null
          village?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          district?: string | null
          email?: string
          house_number?: number | null
          id?: string
          license_number?: string
          mobile?: number
          name?: string
          number_of_doctors?: number
          number_of_icus?: number
          number_of_op_rooms?: number
          password?: string | null
          pincode?: number | null
          speciality?: string | null
          state?: string | null
          street?: string | null
          type?: string
          user_id?: string | null
          village?: string | null
        }
        Relationships: []
      }
      otps: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          otp_code: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          otp_code: string
          user_id: string
          user_type: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          otp_code?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number | null
          alcohol: boolean | null
          bmi: number | null
          bp: boolean | null
          bp_level: string | null
          cardiac: boolean | null
          cardiac_info: string | null
          country: string | null
          created_at: string
          district: string | null
          dob: string
          email: string
          height_cm: number | null
          house_number: string | null
          id: string
          in_treatment: boolean | null
          kidney: boolean | null
          kidney_info: string | null
          liver: boolean | null
          liver_info: string | null
          lungs: boolean | null
          lungs_info: string | null
          mobile_number: string
          name: string
          obesity_level: string | null
          password: string | null
          pincode: string | null
          smoke: boolean | null
          state: string | null
          street: string | null
          sugar: boolean | null
          sugar_level: string | null
          user_id: string | null
          village: string | null
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          alcohol?: boolean | null
          bmi?: number | null
          bp?: boolean | null
          bp_level?: string | null
          cardiac?: boolean | null
          cardiac_info?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          dob: string
          email: string
          height_cm?: number | null
          house_number?: string | null
          id?: string
          in_treatment?: boolean | null
          kidney?: boolean | null
          kidney_info?: string | null
          liver?: boolean | null
          liver_info?: string | null
          lungs?: boolean | null
          lungs_info?: string | null
          mobile_number: string
          name: string
          obesity_level?: string | null
          password?: string | null
          pincode?: string | null
          smoke?: boolean | null
          state?: string | null
          street?: string | null
          sugar?: boolean | null
          sugar_level?: string | null
          user_id?: string | null
          village?: string | null
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          alcohol?: boolean | null
          bmi?: number | null
          bp?: boolean | null
          bp_level?: string | null
          cardiac?: boolean | null
          cardiac_info?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          dob?: string
          email?: string
          height_cm?: number | null
          house_number?: string | null
          id?: string
          in_treatment?: boolean | null
          kidney?: boolean | null
          kidney_info?: string | null
          liver?: boolean | null
          liver_info?: string | null
          lungs?: boolean | null
          lungs_info?: string | null
          mobile_number?: string
          name?: string
          obesity_level?: string | null
          password?: string | null
          pincode?: string | null
          smoke?: boolean | null
          state?: string | null
          street?: string | null
          sugar?: boolean | null
          sugar_level?: string | null
          user_id?: string | null
          village?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          mobile_number: string | null
          name: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          mobile_number?: string | null
          name?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          mobile_number?: string | null
          name?: string | null
          role?: string
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
    Enums: {},
  },
} as const
