
// Service for ID generation and validation
import { supabase } from "@/integrations/supabase/client";
import { generate10DigitId } from "@/utils/email-utils";
import { TableName } from "./auth.types";

class IdService {
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
}

export const idService = new IdService();
