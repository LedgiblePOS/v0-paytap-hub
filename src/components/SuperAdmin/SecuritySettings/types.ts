
export interface SecuritySettingsFormValues {
  password_min_length: number;
  password_require_numbers: boolean;
  password_require_special_chars: boolean;
  max_login_attempts: number;
  session_timeout: number;
}
