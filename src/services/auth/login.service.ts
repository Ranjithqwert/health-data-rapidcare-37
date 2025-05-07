
// Service for login functionality
import { supabase } from "@/integrations/supabase/client";
import { LoginRequest, LoginWithMobileRequest, LoginResponse } from "@/models/models";
import { TableName, UserType } from "./auth.types";
import { sessionService } from "./session.service";

class LoginService {
  // Login with ID
  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      // Different login logic for each user type
      if (request.userType === 'admin') {
        // For admin, use the admins table in the database
        const { data, error } = await supabase
          .from('admins')
          .select('id, username')
          .eq('username', request.userId)
          .eq('password', request.password)
          .maybeSingle();
          
        if (error) {
          console.error("Admin login error:", error);
          return { success: false, error: 'Database error' };
        }
        
        if (!data) {
          return { success: false, error: 'Invalid admin credentials' };
        }
        
        // Admin login successful
        const token = 'admin-token-' + Date.now();
        sessionService.setSessionData(token, data.id, request.userType, data.username);
        
        return {
          success: true,
          token,
          userId: data.id,
          name: data.username
        };
      } else {
        // For other user types, query the appropriate table
        let tableName: TableName;
        
        // Explicitly determine the table name based on user type
        if (request.userType === 'doctor') {
          tableName = 'doctors';
        } else if (request.userType === 'hospital') {
          tableName = 'hospitals'; 
        } else if (request.userType === 'user') {
          tableName = 'patients';
        } else {
          return { success: false, error: 'Invalid user type' };
        }
        
        // For testing purposes only - remove in production
        if (request.userId === request.userType && request.password === request.userType) {
          const token = `${request.userType}-token-${Date.now()}`;
          sessionService.setSessionData(token, request.userId, request.userType, request.userType.charAt(0).toUpperCase() + request.userType.slice(1));
          
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
          
          sessionService.setSessionData(token, userId, request.userType, userName, userEmail || undefined, userMobile || undefined);
          
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
        // For admin, check against the admins table
        const { data, error } = await supabase
          .from('admins')
          .select('id, username')
          .eq('username', request.mobileNumber)
          .eq('password', request.password)
          .maybeSingle();
          
        if (error) {
          console.error("Admin login error:", error);
          return { success: false, error: 'Database error' };
        }
        
        if (!data) {
          return { success: false, error: 'Invalid admin credentials' };
        }
        
        // Admin login successful
        const token = 'admin-token-' + Date.now();
        sessionService.setSessionData(token, data.id, request.userType, data.username);
        
        return {
          success: true,
          token,
          userId: data.id,
          name: data.username
        };
      } else {
        // For other user types, query the appropriate table
        let tableName: "doctors" | "hospitals" | "patients";
        let mobileField: "mobile_number" | "mobile";
        
        // Explicit assignment of tableName and mobileField
        if (request.userType === 'doctor') {
          tableName = 'doctors';
          mobileField = 'mobile_number';
        } else if (request.userType === 'hospital') {
          tableName = 'hospitals';
          mobileField = 'mobile';
        } else if (request.userType === 'user') {
          tableName = 'patients';
          mobileField = 'mobile_number';
        } else {
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
            if ('id' in data && data.id !== null) {
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
          
          sessionService.setSessionData(token, userId, request.userType, userName, userEmail || undefined, userMobile || undefined);
          
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
}

export const loginService = new LoginService();
