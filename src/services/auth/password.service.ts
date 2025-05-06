
// Service for password management
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ResetPasswordRequest } from "@/models/models";
import { TableName } from "./auth.types";
import { sessionService } from "./session.service";

class PasswordService {
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
    const userId = sessionService.getUserId();
    const userType = sessionService.getUserType();
    
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

export const passwordService = new PasswordService();
