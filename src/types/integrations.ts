
export interface PaymentIntegration {
  id: string;
  merchantId: string;
  providerName: string;
  providerType: string;
  isActive: boolean;
  credentials: Record<string, any>;
  settings: Record<string, any>;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntegrationLog {
  id: string;
  integrationId: string;
  merchantId: string;
  eventType: string;
  status: string;
  requestData?: Record<string, any>;
  responseData?: Record<string, any>;
  errorMessage?: string;
  createdAt: string;
}
