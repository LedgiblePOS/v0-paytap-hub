
import { supabase } from "@/integrations/supabase/client";
import { SystemSettings, SecuritySettings } from "@/types/settings";

export const systemSettingsService = {
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
  },

  async updateSystemSettings(settings: SystemSettings) {
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

    // Log audit trail
    await supabase.from('audit_logs').insert({
      action: 'UPDATE',
      resource: 'system_settings',
      description: 'Updated system-wide settings',
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
  }
};

export const securitySettingsService = {
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
  },

  async updateSecuritySettings(settings: SecuritySettings) {
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

    // Log audit trail
    await supabase.from('audit_logs').insert({
      action: 'UPDATE',
      resource: 'security_settings',
      description: 'Updated security configuration settings',
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
  }
};
