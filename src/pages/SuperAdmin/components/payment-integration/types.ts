
export interface FACCredentials {
  merchantId: string;
  apiKey: string;
  apiUrl: string;
  testMode: boolean;
}

// Update the SystemSetting type to match what's used in the hook
export interface SystemSetting {
  key: string;
  value: Record<string, any>;
  updated_at?: string;
}
