
import { supabase } from "@/integrations/supabase/client";
import { SystemSettings } from "@/types/settings";
import { useToast } from "@/hooks/use-toast";

/**
 * Service for managing system settings
 */
class SystemSettingsService {
  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<SystemSettings> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }

    return {
      siteName: data.site_name,
      supportEmail: data.support_email,
      maintenanceMode: data.maintenance_mode,
      allowPublicRegistration: data.allow_public_registration,
      requireEmailVerification: data.require_email_verification,
      apiRequestLimit: data.api_request_limit
    };
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: SystemSettings): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .update({
        site_name: settings.siteName,
        support_email: settings.supportEmail,
        maintenance_mode: settings.maintenanceMode,
        allow_public_registration: settings.allowPublicRegistration,
        require_email_verification: settings.requireEmailVerification,
        api_request_limit: settings.apiRequestLimit,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
    
    // Log the audit event
    await this.logSettingsUpdate('SYSTEM_SETTINGS', 'Updated system settings');
  }
  
  /**
   * Log settings update to audit log
   */
  private async logSettingsUpdate(resource: string, description: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'UPDATE',
          resource,
          description,
          ip_address: null, // This would typically come from the server
          user_agent: navigator.userAgent
        });
        
      if (error) {
        console.error('Error logging to audit:', error);
      }
    } catch (err) {
      console.error('Error logging to audit:', err);
    }
  }
}

export const systemSettingsService = new SystemSettingsService();
