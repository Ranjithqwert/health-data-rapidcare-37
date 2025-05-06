import { apiService } from "./api.service";
import { LoginRequest, LoginWithMobileRequest, ResetPasswordRequest, LoginResponse } from "@/models/models";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generate10DigitId } from "@/utils/email-utils";

// Define valid table names to match Supabase's expected types
type TableName = "admins" | "admission_reports" | "admissions" | "hospitals" | "patients" | "consultations" | "doctors" | "otps";

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

  // Generate a unique 10-digit ID
  async generateUniqueId(tableName: TableName): Promise<string> {
    let isUnique = false;
    let newId = '';
    
    while (!isUnique) {
      newId = generate10DigitId();
      
      // Check if ID already exists
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .eq('id', newId)
        .maybeSingle();
        
      if (error) {
        console.error(`Error checking ID uniqueness: ${error.message}`);
      }
      
      isUnique = !data; // If no data returned, ID is unique
    }
    
    return newId;
  }

  // Login with ID
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      // Different login logic for each user type
      if (request.userType === 'admin') {
        // For admin, use a special table or check
        if (request.userId === 'admin' && request.password === 'admin123') {
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
        let tableName: TableName;
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
        
        try {
          // Select different fields based on user type to handle the mobile/mobile_number difference
          let query;
          if (request.userType === 'hospital') {
            query = supabase
              .from(tableName)
              .select('id, name, email, mobile, password')
              .eq('id', request.userId)
              .maybeSingle();
          } else {
            query = supabase
              .from(tableName)
              .select('id, name, email, mobile_number, password')
              .eq('id', request.userId)
              .maybeSingle();
          }
          
          const { data, error } = await query;
            
          if (error) {
            console.error("Supabase error:", error);
            return { success: false, error: 'User not found' };
          }
          
          if (!data) {
            return { success: false, error: 'User not found' };
          }
          
          // Safely check if password exists and matches
          if (!('password' in data) || data.password !== request.password) {
            return { success: false, error: 'Invalid password' };
          }
          
          const token = `${request.userType}-token-${Date.now()}`;
          
          // Correctly extract values from the data object with proper type checking
          let userId = '';
          let userName = '';
          let userEmail = '';
          let userMobile = '';
          
          // Ensuring data is not null before accessing its properties
          if (data) {
            // Check if id exists and is of the right type
            if ('id' in data && data.id !== null && (typeof data.id === 'string' || typeof data.id === 'number')) {
              userId = String(data.id);
            }
            
            // Check if name exists and is of the right type
            if ('name' in data && data.name !== null && typeof data.name === 'string') {
              userName = data.name;
            }
            
            // Check if email exists
            if ('email' in data && data.email !== null && typeof data.email === 'string') {
              userEmail = data.email;
            }
            
            // Check if mobile_number or mobile exists based on user type
            if (request.userType === 'hospital' && 'mobile' in data && data.mobile !== null && typeof data.mobile === 'string') {
              userMobile = data.mobile;
            } else if ('mobile_number' in data && data.mobile_number !== null && typeof data.mobile_number === 'string') {
              userMobile = data.mobile_number;
            }
          }
          
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userType', request.userType);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userEmail', userEmail || '');
          localStorage.setItem('userMobile', userMobile || '');
          
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

  // Login with mobile number
  async loginWithMobile(request: LoginWithMobileRequest): Promise<LoginResponse> {
    try {
      // Different login logic for each user type
      if (request.userType === 'admin') {
        // For admin, use a special table or check
        if (request.mobileNumber === 'admin' && request.password === 'admin123') {
          // Mock admin login for testing
          const token = 'admin-token-' + Date.now();
          localStorage.setItem('token', token);
          localStorage.setItem('userId', 'admin');
          localStorage.setItem('userType', request.userType);
          localStorage.setItem('userName', 'Administrator');
          
          return {
            success: true,
            token,
            userId: 'admin',
            name: 'Administrator'
          };
        } else {
          return { success: false, error: 'Invalid admin credentials' };
        }
      } else {
        // For other user types, query the appropriate table
        let tableName: TableName;
        let mobileField: string;
        
        switch (request.userType) {
          case 'doctor': 
            tableName = 'doctors'; 
            mobileField = 'mobile_number';
            break;
          case 'hospital': 
            tableName = 'hospitals'; 
            mobileField = 'mobile';
            break;
          case 'user': 
            tableName = 'patients'; 
            mobileField = 'mobile_number';
            break;
          default: 
            return { success: false, error: 'Invalid user type' };
        }
        
        try {
          // Query by mobile number instead of ID
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq(mobileField, request.mobileNumber)
            .maybeSingle();
            
          if (error) {
            console.error("Supabase error:", error);
            return { success: false, error: 'User not found' };
          }
          
          if (!data) {
            return { success: false, error: 'User not found' };
          }
          
          // Safely check if password exists and matches
          if (!('password' in data) || data.password !== request.password) {
            return { success: false, error: 'Invalid password' };
          }
          
          const token = `${request.userType}-token-${Date.now()}`;
          
          // Correctly extract values from the data object with proper type checking
          let userId = '';
          let userName = '';
          let userEmail = '';
          let userMobile = '';
          
          // Ensuring data is not null before accessing its properties
          if (data) {
            // Check if id exists and is of the right type
            if ('id' in data && data.id !== null && (typeof data.id === 'string' || typeof data.id === 'number')) {
              userId = String(data.id);
            }
            
            // Check if name exists and is of the right type
            if ('name' in data && data.name !== null && typeof data.name === 'string') {
              userName = data.name;
            }
            
            // Check if email exists
            if ('email' in data && data.email !== null && typeof data.email === 'string') {
              userEmail = data.email;
            }
            
            // Check if mobile_number or mobile exists based on user type
            if (request.userType === 'hospital' && 'mobile' in data && data.mobile !== null && typeof data.mobile === 'string') {
              userMobile = data.mobile;
            } else if ('mobile_number' in data && data.mobile_number !== null && typeof data.mobile_number === 'string') {
              userMobile = data.mobile_number;
            }
          }
          
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userType', request.userType);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userEmail', userEmail || '');
          localStorage.setItem('userMobile', userMobile || '');
          
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
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    
    // Redirect to home page
    window.location.href = '/';
  }

  // Send OTP for password reset
  async sendOTP(mobileNumber: string, userType: 'doctor' | 'hospital' | 'user'): Promise<boolean> {
    try {
      // Define table name and mobile field based on user type
      let tableName: string;
      let mobileField: string;
      
      if (userType === 'doctor') {
        tableName = 'doctors';
        mobileField = 'mobile_number';
      } else if (userType === 'hospital') {
        tableName = 'hospitals';
        mobileField = 'mobile';
      } else if (userType === 'user') {
        tableName = 'patients';
        mobileField = 'mobile_number';
      } else {
        console.error("Invalid user type for OTP");
        return false;
      }
      
      // Get user email from the appropriate table using mobile number
      const userQuery = await supabase
        .from(tableName)
        .select('email, id')
        .eq(mobileField, mobileNumber)
        .maybeSingle();
        
      if (userQuery.error) {
        console.error("Error fetching user email:", userQuery.error);
        toast({
          title: "Error",
          description: "User not found or email not available.",
          variant: "destructive",
        });
        return false;
      }

      const userData = userQuery.data;
      
      // Ensure userData and email exist before proceeding
      if (!userData) {
        console.error("User email not found");
        toast({
          title: "Error",
          description: "User not found or email not available.",
          variant: "destructive",
        });
        return false;
      }
      
      // Safely type check and extract email and ID
      if (!('email' in userData) || typeof userData.email !== 'string' || !('id' in userData)) {
        console.error("Email field missing or invalid in user data");
        toast({
          title: "Error",
          description: "Email not available for this user.",
          variant: "destructive",
        });
        return false;
      }
      
      const email = userData.email;
      const userId = userData.id;
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in Supabase with expiration time (10 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes from now
      
      // Check if an OTP entry already exists
      const existingOtpQuery = await supabase
        .from('otps')
        .select()
        .eq('id', userId)
        .maybeSingle();
      
      if (existingOtpQuery.error) {
        console.error("Error checking existing OTP:", existingOtpQuery.error);
        return false;
      }
      
      if (existingOtpQuery.data) {
        // Update existing OTP
        const updateResult = await supabase
          .from('otps')
          .update({
            otp_value: otp,
            validity: expiresAt.toISOString()
          })
          .eq('id', userId);
          
        if (updateResult.error) {
          console.error("Error updating OTP:", updateResult.error);
          return false;
        }
      } else {
        // Create new OTP entry
        const insertResult = await supabase
          .from('otps')
          .insert({
            id: userId,
            otp_value: otp,
            validity: expiresAt.toISOString(),
            expired: false
          });
          
        if (insertResult.error) {
          console.error("Error creating OTP:", insertResult.error);
          return false;
        }
      }
      
      // Send email with OTP using our edge function
      try {
        const emailResult = await supabase.functions.invoke('send-otp-email', {
          body: {
            email,
            otp,
            userType,
            name: userId // We're using the user ID as name since we don't have it here
          }
        });
        
        if (emailResult.error) {
          console.error("Error sending OTP email:", emailResult.error);
          toast({
            title: "Error",
            description: "Failed to send OTP email. Please try again.",
            variant: "destructive",
          });
          return false;
        }
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError);
        // We still continue as the OTP is stored in the database
      }
      
      console.log(`OTP for ${userType} with mobile ${mobileNumber}: ${otp} (would be sent to ${email})`);
      
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
        .select('otp_value, validity') 
        .eq('id', userId)
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
      const expiresAt = new Date(data.validity);
      
      if (now > expiresAt) {
        toast({
          title: "Error",
          description: "OTP has expired. Please request a new one.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if OTP matches
      if (data.otp_value === otp) {
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
      let tableName: TableName;
      
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
        .eq('id', request.userId);
      
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

  // Get current user details
  async getCurrentUserDetails() {
    const userId = this.getUserId();
    const userType = this.getUserType();
    
    if (!userId || !userType) {
      return null;
    }
    
    let tableName: TableName;
    switch (userType) {
      case 'doctor': tableName = 'doctors'; break;
      case 'hospital': tableName = 'hospitals'; break;
      case 'user': tableName = 'patients'; break;
      default: return null;
    }
    
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error(`Error fetching ${userType} details:`, error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${userType} details:`, error);
      return null;
    }
  }
}

export const authService = new AuthService();
