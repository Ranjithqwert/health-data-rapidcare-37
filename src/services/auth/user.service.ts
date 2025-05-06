
// Service for user details
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "./auth.types";
import { sessionService } from "./session.service";

class UserService {
  // Get current user details
  async getCurrentUserDetails() {
    const userId = sessionService.getUserId();
    const userType = sessionService.getUserType();
    
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

export const userService = new UserService();
