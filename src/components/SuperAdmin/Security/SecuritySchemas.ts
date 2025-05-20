
import * as z from 'zod';

/**
 * Security settings form validation schema
 */
export const securitySettingsSchema = z.object({
  password_min_length: z.number()
    .int('Must be a whole number')
    .min(8, 'Minimum password length must be at least 8 characters')
    .max(32, 'Maximum password length should not exceed 32 characters'),
  
  password_require_numbers: z.boolean(),
  
  password_require_special_chars: z.boolean(),
  
  max_login_attempts: z.number()
    .int('Must be a whole number')
    .min(1, 'Must allow at least 1 attempt')
    .max(10, 'Maximum login attempts should not exceed 10'),
  
  session_timeout: z.number()
    .int('Must be a whole number')
    .min(15, 'Session timeout must be at least 15 minutes')
    .max(1440, 'Session timeout should not exceed 24 hours (1440 minutes)')
});

export type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

/**
 * Session management settings schema
 */
export const sessionSettingsSchema = z.object({
  session_timeout: z.number()
    .int('Must be a whole number')
    .min(15, 'Session timeout must be at least 15 minutes')
    .max(1440, 'Session timeout should not exceed 24 hours (1440 minutes)'),
  
  idle_timeout: z.number()
    .int('Must be a whole number')
    .min(1, 'Idle timeout must be at least 1 minute')
    .max(60, 'Idle timeout should not exceed 60 minutes'),
  
  enforce_single_session: z.boolean(),
  
  remember_me_duration: z.number()
    .int('Must be a whole number')
    .min(1, 'Remember me duration must be at least 1 day')
    .max(90, 'Remember me duration should not exceed 90 days')
});

export type SessionSettingsValues = z.infer<typeof sessionSettingsSchema>;

/**
 * System alert settings schema
 */
export const alertSettingsSchema = z.object({
  alert_on_login_failures: z.boolean(),
  alert_on_admin_actions: z.boolean(),
  alert_on_api_key_usage: z.boolean(),
  alert_email_recipients: z.array(
    z.string().email('Please enter a valid email address')
  )
});

export type AlertSettingsValues = z.infer<typeof alertSettingsSchema>;
