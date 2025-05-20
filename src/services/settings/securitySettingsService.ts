
import { supabase } from "@/integrations/supabase/client";
import { SecuritySettings } from "@/types/settings";

/**
 * Service for managing security settings
 */
class SecuritySettingsService {
  /**
   * Get security settings
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }

    return {
      passwordMinLength: data.password_min_length,
      passwordRequireSpecialChars: data.password_require_special_chars,
      passwordRequireNumbers: data.password_require_numbers,
      maxLoginAttempts: data.max_login_attempts,
      sessionTimeout: data.session_timeout
    };
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(settings: SecuritySettings): Promise<void> {
    const { error } = await supabase
      .from('security_settings')
      .update({
        password_min_length: settings.passwordMinLength,
        password_require_special_chars: settings.passwordRequireSpecialChars,
        password_require_numbers: settings.passwordRequireNumbers,
        max_login_attempts: settings.maxLoginAttempts,
        session_timeout: settings.sessionTimeout,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
    
    // Log the audit event
    await this.logSettingsUpdate('SECURITY_SETTINGS', 'Updated security settings');
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

export const securitySettingsService = new SecuritySettingsService();
