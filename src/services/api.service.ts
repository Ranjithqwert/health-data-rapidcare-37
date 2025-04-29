
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
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      return null;
    }
  }

  async getTargetAnalysis(target: string, filterLevel: string): Promise<{ name: string; percentage: number }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/analysis?target=${target}&filterLevel=${filterLevel}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Get target analysis error:", error);
      return [];
    }
  }

  // Utility methods
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}

export const apiService = new ApiService();
