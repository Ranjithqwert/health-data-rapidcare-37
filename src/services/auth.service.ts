
import { apiService } from "./api.service";
import { LoginRequest, ResetPasswordRequest, LoginResponse } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // Different login logic for each user type
      if (request.userType === 'admin') {
        // For admin, use a special table or check
        if (request.userId === 'admin' && request.password === 'admin') {
          // Mock admin login for testing
          const token = 'admin-token-' + Date.now();
          localStorage.setItem('token', token);
          localStorage.setItem('userId', request.userId);
          localStorage.setItem('userType', request.userType);
          localStorage.setItem('userName', 'Administrator');
          
          return {
            success: true,
            token,
            userId: request.userId,
            name: 'Administrator'
          };
        } else {
          return { success: false, error: 'Invalid admin credentials' };
        }
      } else {
        // For other user types, query the appropriate table
        let tableName;
        switch (request.userType) {
          case 'doctor': tableName = 'doctors'; break;
          case 'hospital': tableName = 'hospitals'; break;
          case 'user': tableName = 'patients'; break;
          default: return { success: false, error: 'Invalid user type' };
        }
        
        // For testing purposes only - remove in production
        if (request.userId === request.userType && request.password === request.userType) {
          const token = `${request.userType}-token-${Date.now()}`;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', request.userId);
          localStorage.setItem('userType', request.userType);
          localStorage.setItem('userName', request.userType.charAt(0).toUpperCase() + request.userType.slice(1));
          
          return {
            success: true,
            token,
            userId: request.userId,
            name: request.userType.charAt(0).toUpperCase() + request.userType.slice(1)
          };
        }
        
        // In a real implementation, check the password against a hashed version in the database
        // This is simplified for demonstration purposes
        try {
          // Using maybeSingle() instead of single() to avoid errors with missing data
          const { data, error } = await supabase
            .from(tableName)
            .select('id, name')
            .eq('id', request.userId)
            .maybeSingle();
            
          if (error) {
            console.error("Supabase error:", error);
            return { success: false, error: 'User not found' };
          }
          
          if (!data) {
            return { success: false, error: 'User not found' };
          }
          
          // In a real application, you would verify the password here
          // For now, we're allowing any password for demonstration
          const token = `${request.userType}-token-${Date.now()}`;
          
          // Safely access properties after checking data exists
          const userId = data.id ? String(data.id) : '';
          const userName = data.name ? String(data.name) : '';
          
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userType', request.userType);
          localStorage.setItem('userName', userName);
          
          return {
            success: true,
            token,
            userId,
            name: userName
          };
        } catch (error) {
          console.error("Database query error:", error);
          return { success: false, error: 'User not found or database error' };
        }
      }
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
      // For demonstration, we'll just log the OTP request
      console.log(`OTP request for ${userType} with ID: ${userId}`);
      
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your registered email address.",
      });
      return true;
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
      // For demonstration, we'll accept any OTP value
      if (otp.length > 0) {
        toast({
          title: "OTP Verified",
          description: "OTP verification successful.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
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
      // For demonstration, just log the password reset
      console.log(`Password reset for ${request.userType} with ID: ${request.userId}`);
      
      toast({
        title: "Password Reset",
        description: "Your password has been successfully reset.",
      });
      return true;
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
