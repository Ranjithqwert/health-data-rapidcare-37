
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TableName } from "./auth.types";

class VillageService {
  // Verify village name
  async verifyVillage(userId: string, village: string, userType: 'doctor' | 'hospital' | 'user'): Promise<boolean> {
    try {
      // Define table name and village field based on user type
      let tableName: TableName;
      let villageField: string;
      
      if (userType === 'doctor') {
        tableName = 'doctors';
        villageField = 'clinic_village';
      } else if (userType === 'hospital') {
        tableName = 'hospitals';
        villageField = 'village';
      } else if (userType === 'user') {
        tableName = 'patients';
        villageField = 'village';
      } else {
        console.error("Invalid user type for village verification");
        return false;
      }
      
      // Get user from database and check if village matches
      const { data, error } = await supabase
        .from(tableName)
        .select(villageField)
        .eq('id', userId)
        .maybeSingle();
      
      if (error || !data) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "User not found. Please check your mobile number.",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if the village matches
      const actualVillage = data[villageField];
      
      if (actualVillage && actualVillage.toLowerCase() === village.toLowerCase()) {
        toast({
          title: "Verification Successful",
          description: "Village verified successfully.",
        });
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: "Village name doesn't match our records.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Verify village error:", error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }
}

export const villageService = new VillageService();
