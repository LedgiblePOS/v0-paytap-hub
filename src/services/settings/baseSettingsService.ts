
import { supabase } from "@/integrations/supabase/client";
import auditService from "../auditService";

/**
 * Base service for settings management with common utility methods
 */
export class BaseSettingsService {
  /**
   * Log an update operation to the audit log
   * @param table The table that was updated
   * @param id The ID of the record that was updated
   * @param message The message to log
   */
  protected async logSettingsUpdate(table: string, id: string, message: string): Promise<void> {
    try {
      await auditService.logUpdate(table, id, message);
    } catch (error) {
      console.error(`Error logging settings update for ${table}:`, error);
    }
  }

  /**
   * Check if a settings record exists for the specified table
   * @param tableName The name of the table to check
   * @returns The ID of the existing record, or null if none exists
   */
  protected async checkSettingsRecordExists(tableName: string): Promise<string | null> {
    try {
      // Use a type assertion to handle the dynamic table name
      const { data, error } = await supabase
        .from(tableName as any)
        .select('id')
        .maybeSingle();
      
      if (error) {
        console.error(`Error checking if ${tableName} record exists:`, error);
        return null;
      }
      
      // First check if data is null
      if (data === null) {
        return null;
      }
      
      // Type guard function to verify if the data has an id property
      function hasId(obj: any): obj is { id: string | number } {
        return obj !== null && 
               typeof obj === 'object' && 
               'id' in obj && 
               obj.id !== null;
      }
      
      // Use the type guard to safely access the id
      if (hasId(data)) {
        return String(data.id);
      }
      
      return null;
    } catch (error) {
      console.error(`Error checking if ${tableName} record exists:`, error);
      return null;
    }
  }
}
