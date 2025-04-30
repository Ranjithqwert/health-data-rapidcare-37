
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
          
          // Correctly extract values from the data object with proper type checking
          let userId = '';
          let userName = '';
          
          if (data && typeof data === 'object') {
            if ('id' in data && (typeof data.id === 'string' || typeof data.id === 'number')) {
              userId = String(data.id);
            }
            
            if ('name' in data && typeof data.name === 'string') {
              userName = data.name;
            }
          }
          
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
      // Get the user's email based on userType
      let tableName;
      let email = '';
      
      switch (userType) {
        case 'doctor': tableName = 'doctors'; break;
        case 'hospital': tableName = 'hospitals'; break;
        case 'user': tableName = 'patients'; break;
        default: return false;
      }
      
      // Get user email from the appropriate table
      const { data, error } = await supabase
        .from(tableName)
        .select('email')
        .eq('id', userId)
        .maybeSingle();
        
      if (error || !data || !data.email) {
        console.error("Error fetching user email:", error);
        toast({
          title: "Error",
          description: "User not found or email not available.",
          variant: "destructive",
        });
        return false;
      }
      
      email = data.email;
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in Supabase with expiration time (10 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes from now
      
      // Check if an OTP entry already exists
      const { data: existingOtp } = await supabase
        .from('otps')
        .select()
        .eq('user_id', userId)
        .eq('user_type', userType)
        .maybeSingle();
      
      if (existingOtp) {
        // Update existing OTP
        const { error: updateError } = await supabase
          .from('otps')
          .update({
            otp_code: otp,
            expires_at: expiresAt.toISOString()
          })
          .eq('user_id', userId)
          .eq('user_type', userType);
          
        if (updateError) {
          console.error("Error updating OTP:", updateError);
          return false;
        }
      } else {
        // Create new OTP entry
        const { error: insertError } = await supabase
          .from('otps')
          .insert({
            user_id: userId,
            user_type: userType,
            otp_code: otp,
            expires_at: expiresAt.toISOString()
          });
          
        if (insertError) {
          console.error("Error creating OTP:", insertError);
          return false;
        }
      }
      
      // In a real application, send email with OTP
      console.log(`OTP for ${userType} with ID ${userId}: ${otp} (would be sent to ${email})`);
      
      toast({
        title: "OTP Sent",
        description: `An OTP has been sent to ${email}.`,
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
      // Get the stored OTP for this user
      const { data, error } = await supabase
        .from('otps')
        .select('otp_code, expires_at')
        .eq('user_id', userId)
        .eq('user_type', userType)
        .maybeSingle();
      
      if (error || !data) {
        console.error("Error fetching OTP:", error);
        toast({
          title: "Error",
          description: "Invalid or expired OTP. Please request a new one.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if OTP is expired
      const now = new Date();
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        toast({
          title: "Error",
          description: "OTP has expired. Please request a new one.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if OTP matches
      if (data.otp_code === otp) {
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
      // Update password in the appropriate table
      let tableName;
      
      switch (request.userType) {
        case 'doctor': tableName = 'doctors'; break;
        case 'hospital': tableName = 'hospitals'; break;
        case 'user': tableName = 'patients'; break;
        default: return false;
      }
      
      // In a real application, you would hash the password before storing it
      const { error } = await supabase
        .from(tableName)
        .update({ password: request.newPassword }) // In production, this should be a hashed password
        .eq('id', request.userId);
        
      if (error) {
        console.error("Error resetting password:", error);
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      // Delete the OTP entry after successful password reset
      await supabase
        .from('otps')
        .delete()
        .eq('user_id', request.userId)
        .eq('user_type', request.userType);
      
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
