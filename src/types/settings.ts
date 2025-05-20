
import { AuditAction } from './enums';

export interface AuditLog {
  id: string;
  user_id?: string;
  action: AuditAction;
  resource: string;
  description?: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface SystemSettings {
  id: number;
  site_name: string;
  support_email: string;
  api_request_limit?: number;
  require_email_verification: boolean;
  allow_public_registration: boolean;
  maintenance_mode: boolean;
  updated_at: string;
  updated_by?: string;
}

export interface SecuritySettings {
  id: number;
  password_min_length: number;
  password_require_special_chars: boolean;
  password_require_numbers: boolean;
  max_login_attempts: number;
  session_timeout: number;
  updated_at: string;
  updated_by?: string;
}
