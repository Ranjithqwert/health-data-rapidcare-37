
import { 
  LoginRequest, 
  LoginResponse, 
  Admin,
  Doctor,
  Hospital,
  User,
  OTP,
  Consultation,
  Admission,
  ForgotPasswordRequest, 
  OTPVerificationRequest,
  ResetPasswordRequest 
} from "@/models/models";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// API URL configuration - modify this to point to your backend API
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // Auth related APIs
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async verifyOtp(request: OTPVerificationRequest): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      return await response.json();
    } catch (error) {
      console.error("OTP verification error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // User related APIs
  async getUserDetails(userId: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Get user details error:", error);
      return null;
    }
  }

  async createUser(user: Partial<User>): Promise<{ success: boolean; userId?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(user)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Create user error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async updateUser(userId: string, user: Partial<User>): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(user)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Update user error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async deleteUser(userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error("Delete user error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get all users error:", error);
      return [];
    }
  }

  // Doctor related APIs
  async getDoctorDetails(doctorId: string): Promise<Doctor | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Get doctor details error:", error);
      return null;
    }
  }

  async createDoctor(doctor: Partial<Doctor>): Promise<{ success: boolean; doctorId?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(doctor)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Create doctor error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async updateDoctor(doctorId: string, doctor: Partial<Doctor>): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(doctor)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Update doctor error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async deleteDoctor(doctorId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error("Delete doctor error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getAllDoctors(): Promise<Doctor[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get all doctors error:", error);
      return [];
    }
  }

  // Hospital related APIs
  async getHospitalDetails(hospitalId: string): Promise<Hospital | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Get hospital details error:", error);
      return null;
    }
  }

  async createHospital(hospital: Partial<Hospital>): Promise<{ success: boolean; hospitalId?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/hospitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(hospital)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Create hospital error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async updateHospital(hospitalId: string, hospital: Partial<Hospital>): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/hospitals/${hospitalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(hospital)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Update hospital error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async deleteHospital(hospitalId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/hospitals/${hospitalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      return await response.json();
    } catch (error) {
      console.error("Delete hospital error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getAllHospitals(): Promise<Hospital[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/hospitals`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get all hospitals error:", error);
      return [];
    }
  }

  // Consultation related APIs
  async createConsultation(consultation: Partial<Consultation>): Promise<{ success: boolean; id?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(consultation)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Create consultation error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getConsultationsForUser(userId: string): Promise<Consultation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get consultations for user error:", error);
      return [];
    }
  }

  async getConsultationsForDoctor(doctorId: string): Promise<Consultation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/doctor/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get consultations for doctor error:", error);
      return [];
    }
  }

  // Admission related APIs
  async createAdmission(admission: Partial<Admission>): Promise<{ success: boolean; id?: string; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(admission)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Create admission error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async getAdmissionsForUser(userId: string): Promise<Admission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get admissions for user error:", error);
      return [];
    }
  }

  async getAdmissionsForHospital(hospitalId: string): Promise<Admission[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/hospital/${hospitalId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get admissions for hospital error:", error);
      return [];
    }
  }

  async updateAdmission(id: string, admission: Partial<Admission>): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(admission)
      });
      
      return await response.json();
    } catch (error) {
      console.error("Update admission error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async dischargePatient(id: string, feedback: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/${id}/discharge`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ feedback })
      });
      
      return await response.json();
    } catch (error) {
      console.error("Discharge patient error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  async uploadReport(id: string, file: File): Promise<{ success: boolean; reportUrl?: string; message?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/reports/upload/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      });
      
      return await response.json();
    } catch (error) {
      console.error("Upload report error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Admin dashboard APIs
  async getDashboardStats(): Promise<{ 
    userCount: number; 
    doctorCount: number; 
    hospitalCount: number;
    usersByDisease: { [key: string]: number };
    usersByAddiction: { [key: string]: number };
    monthlyUserCreation: { [key: string]: number };
  } | null> {
    try {
      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Get doctor count
      const { count: doctorCount, error: doctorError } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });

      // Get hospital count
      const { count: hospitalCount, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*', { count: 'exact', head: true });

      if (userError || doctorError || hospitalError) {
        console.error("Error fetching counts:", userError || doctorError || hospitalError);
        return null;
      }

      // Get users by disease
      const { data: patientsData, error: diseaseError } = await supabase
        .from('patients')
        .select('sugar, bp, cardiac, kidney, liver, lungs');

      if (diseaseError) {
        console.error("Error fetching disease data:", diseaseError);
        return null;
      }

      const usersByDisease: { [key: string]: number } = {
        Sugar: 0,
        BP: 0,
        Cardiac: 0,
        Kidney: 0,
        Liver: 0,
        Lungs: 0
      };

      patientsData?.forEach(patient => {
        if (patient.sugar) usersByDisease.Sugar++;
        if (patient.bp) usersByDisease.BP++;
        if (patient.cardiac) usersByDisease.Cardiac++;
        if (patient.kidney) usersByDisease.Kidney++;
        if (patient.liver) usersByDisease.Liver++;
        if (patient.lungs) usersByDisease.Lungs++;
      });

      // Get users by addiction - we need to fetch addiction data separately
      const { data: addictionData, error: addictionError } = await supabase
        .from('patients')
        .select('smoke, alcohol');

      if (addictionError) {
        console.error("Error fetching addiction data:", addictionError);
        return null;
      }

      const usersByAddiction: { [key: string]: number } = {
        Smoke: 0,
        Alcohol: 0,
        None: 0
      };

      addictionData?.forEach(patient => {
        if (patient.smoke && patient.alcohol) {
          usersByAddiction.Smoke++;
          usersByAddiction.Alcohol++;
        } else if (patient.smoke) {
          usersByAddiction.Smoke++;
        } else if (patient.alcohol) {
          usersByAddiction.Alcohol++;
        } else {
          usersByAddiction.None++;
        }
      });

      // Get monthly user creation
      const { data: patientsByDate, error: monthlyError } = await supabase
        .from('patients')
        .select('created_at');

      if (monthlyError) {
        console.error("Error fetching monthly data:", monthlyError);
        return null;
      }

      const monthlyUserCreation: { [key: string]: number } = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      patientsByDate?.forEach(patient => {
        const date = new Date(patient.created_at);
        const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
        
        if (!monthlyUserCreation[monthYear]) {
          monthlyUserCreation[monthYear] = 0;
        }
        monthlyUserCreation[monthYear]++;
      });

      return {
        userCount: userCount || 0,
        doctorCount: doctorCount || 0,
        hospitalCount: hospitalCount || 0,
        usersByDisease,
        usersByAddiction,
        monthlyUserCreation
      };
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics.",
        variant: "destructive"
      });
      return null;
    }
  }

  async getTargetAnalysis(target: string, filterLevel: string): Promise<{ name: string; percentage: number }[]> {
    try {
      // Get all patients with location data
      const { data: patients, error } = await supabase
        .from('patients')
        .select(`
          ${target.toLowerCase()}, 
          ${filterLevel}, 
          id
        `);

      if (error) {
        console.error("Error fetching target analysis:", error);
        toast({
          title: "Error",
          description: "Failed to fetch target analysis data.",
          variant: "destructive"
        });
        return [];
      }

      // Group by location and calculate percentages
      const locationStats: { [key: string]: { total: number; affected: number } } = {};
      
      patients?.forEach(patient => {
        const locationValue = patient[filterLevel as keyof typeof patient] as string;
        
        if (!locationValue) return; // Skip if location is not defined
        
        if (!locationStats[locationValue]) {
          locationStats[locationValue] = { total: 0, affected: 0 };
        }
        
        locationStats[locationValue].total++;
        
        // Check if patient has the target condition
        const hasCondition = patient[target.toLowerCase() as keyof typeof patient];
        if (hasCondition) {
          locationStats[locationValue].affected++;
        }
      });
      
      // Calculate percentages and return sorted by percentage
      return Object.entries(locationStats)
        .map(([name, stats]) => ({
          name,
          percentage: (stats.affected / stats.total) * 100
        }))
        .sort((a, b) => b.percentage - a.percentage);
      
    } catch (error) {
      console.error("Get target analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch target analysis data.",
        variant: "destructive"
      });
      return [];
    }
  }

  // Utility methods
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}

export const apiService = new ApiService();
