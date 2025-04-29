
import { apiService } from "./api.service";
import { LoginRequest, ResetPasswordRequest, LoginResponse } from "@/models/models";
import { toast } from "@/components/ui/use-toast";

class AuthService {
  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get current user type
  getUserType(): 'admin' | 'doctor' | 'hospital' | 'user' | null {
    return localStorage.getItem('userType') as 'admin' | 'doctor' | 'hospital' | 'user' | null;
  }

  // Get current user ID
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Get user name
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  // Login
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.login(request);
      
      if (response.success && response.token && response.userId) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userType', request.userType);
        if (response.name) {
          localStorage.setItem('userName', response.name);
        }
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    
    // Redirect to home page
    window.location.href = '/';
  }

  // Send OTP for password reset
  async sendOTP(userId: string, userType: 'doctor' | 'hospital' | 'user'): Promise<boolean> {
    try {
      const response = await apiService.forgotPassword({ userId, userType });
      
      if (response.success) {
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your registered email address.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Verify OTP
  async verifyOTP(userId: string, otp: string, userType: 'doctor' | 'hospital' | 'user'): Promise<boolean> {
    try {
      const response = await apiService.verifyOtp({ userId, otp, userType });
      
      if (response.success) {
        toast({
          title: "OTP Verified",
          description: "OTP verification successful.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Reset password
  async resetPassword(request: ResetPasswordRequest): Promise<boolean> {
    try {
      const response = await apiService.resetPassword(request);
      
      if (response.success) {
        toast({
          title: "Password Reset",
          description: "Your password has been successfully reset.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }

  // Change password for logged in user
  async changePassword(newPassword: string, confirmPassword: string): Promise<boolean> {
    const userId = this.getUserId();
    const userType = this.getUserType();
    
    if (!userId || !userType || !['doctor', 'hospital', 'user'].includes(userType)) {
      toast({
        title: "Error",
        description: "Session expired. Please login again.",
        variant: "destructive",
      });
      return false;
    }
    
    return await this.resetPassword({
      userId,
      newPassword,
      confirmPassword,
      userType: userType as 'doctor' | 'hospital' | 'user'
    });
  }
}

export const authService = new AuthService();
