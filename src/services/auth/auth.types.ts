
// Types related to authentication
import { LoginRequest, LoginWithMobileRequest, ResetPasswordRequest, LoginResponse } from "@/models/models";

// Define valid table names to match Supabase's expected types
export type TableName = "admins" | "admission_reports" | "admissions" | "hospitals" | "patients" | "consultations" | "doctors" | "otps";
