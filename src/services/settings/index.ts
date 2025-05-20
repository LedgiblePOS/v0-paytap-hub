
export interface SystemSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  notificationsEnabled: boolean;
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  passwordRequireNumbers: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  twoFactorAuthEnabled: boolean;
}

class SystemSettingsService {
  async getSystemSettings(): Promise<SystemSettings> {
    // This would normally fetch from API/database
    return {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      notificationsEnabled: true
    };
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    console.log('Updating system settings:', settings);
    // This would normally update via API/database
    return {
      theme: settings.theme || 'system',
      language: settings.language || 'en',
      timezone: settings.timezone || 'UTC',
      dateFormat: settings.dateFormat || 'MM/DD/YYYY',
      notificationsEnabled: settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : true
    };
  }
}

class SecuritySettingsService {
  async getSecuritySettings(): Promise<SecuritySettings> {
    // This would normally fetch from API/database
    return {
      passwordMinLength: 12,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      twoFactorAuthEnabled: false
    };
  }

  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    console.log('Updating security settings:', settings);
    // This would normally update via API/database
    return {
      passwordMinLength: settings.passwordMinLength || 12,
      passwordRequireSpecialChars: settings.passwordRequireSpecialChars !== undefined ? settings.passwordRequireSpecialChars : true,
      passwordRequireNumbers: settings.passwordRequireNumbers !== undefined ? settings.passwordRequireNumbers : true,
      sessionTimeout: settings.sessionTimeout || 60,
      maxLoginAttempts: settings.maxLoginAttempts || 5,
      twoFactorAuthEnabled: settings.twoFactorAuthEnabled !== undefined ? settings.twoFactorAuthEnabled : false
    };
  }
}

export const systemSettingsService = new SystemSettingsService();
export const securitySettingsService = new SecuritySettingsService();
