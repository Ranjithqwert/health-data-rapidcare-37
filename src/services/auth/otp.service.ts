
// Service for OTP functionality
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TableName } from "./auth.types";

class OtpService {
  // Send OTP for password reset
  async sendOTP(mobileNumber: string, userType: 'doctor' | 'hospital' | 'user'): Promise<boolean> {
    try {
      // Define table name and mobile field based on user type
      let tableName: TableName;
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
      if (!userData || !userData.email) {
        console.error("User email not found");
        toast({
          title: "Error",
          description: "User not found or email not available.",
          variant: "destructive",
        });
        return false;
      }
      
      const email = userData.email;
      const userId = userData.id as string;
      
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
      
      let otpResult;
      if (existingOtpQuery.data) {
        // Update existing OTP
        otpResult = await supabase
          .from('otps')
          .update({
            otp_value: otp,
            validity: expiresAt.toISOString()
          })
          .eq('id', userId);
      } else {
        // Create new OTP entry
        otpResult = await supabase
          .from('otps')
          .insert({
            id: userId,
            otp_value: otp,
            validity: expiresAt.toISOString(),
            expired: false
          });
      }
      
      if (otpResult.error) {
        console.error("Error managing OTP:", otpResult.error);
        return false;
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
}

export const otpService = new OtpService();
