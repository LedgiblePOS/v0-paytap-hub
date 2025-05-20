
import securitySettingsService from '../securitySettingsService';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockImplementation((table) => ({
      select: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({
          data: {
            password_min_length: 8,
            password_require_special_chars: true,
            password_require_numbers: true,
            max_login_attempts: 5,
            session_timeout: 60
          },
          error: null
        })
      }),
      update: jest.fn().mockResolvedValue({
        data: {},
        error: null
      }),
      insert: jest.fn().mockResolvedValue({
        data: {},
        error: null
      }),
      eq: jest.fn().mockReturnThis()
    }))
  }
}));

describe('Security Settings Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should get security settings successfully', async () => {
    const settings = await securitySettingsService.getSecuritySettings();
    
    expect(settings).toEqual({
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60
    });
    
    expect(supabase.from).toHaveBeenCalledWith('security_settings');
  });
  
  it('should update security settings successfully', async () => {
    // Mock the checkSettingsRecordExists method
    jest.spyOn(securitySettingsService, 'checkSettingsRecordExists' as any)
      .mockResolvedValue('1');
    
    // Mock the logSettingsUpdate method
    jest.spyOn(securitySettingsService, 'logSettingsUpdate' as any)
      .mockResolvedValue(undefined);
    
    const updatedSettings = {
      passwordMinLength: 10,
      passwordRequireSpecialChars: false,
      passwordRequireNumbers: true,
      maxLoginAttempts: 3,
      sessionTimeout: 30
    };
    
    const result = await securitySettingsService.updateSecuritySettings(updatedSettings);
    
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('security_settings');
  });
  
  it('should create new security settings if no existing record', async () => {
    // Mock the checkSettingsRecordExists method to return no existing record
    jest.spyOn(securitySettingsService, 'checkSettingsRecordExists' as any)
      .mockResolvedValue(null);
    
    // Mock the logSettingsUpdate method
    jest.spyOn(securitySettingsService, 'logSettingsUpdate' as any)
      .mockResolvedValue(undefined);
    
    const newSettings = {
      passwordMinLength: 12,
      passwordRequireSpecialChars: true,
      passwordRequireNumbers: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60
    };
    
    const result = await securitySettingsService.updateSecuritySettings(newSettings);
    
    expect(result).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('security_settings');
  });
});
