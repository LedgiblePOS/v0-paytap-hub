
export interface MerchantApiCredentials {
  id: string;
  merchant_id: string;
  fasstap_username: string | null;
  fasstap_password: string | null;
  fasstap_api_url: string | null;
  cbdc_username: string | null;
  cbdc_password: string | null;
  cbdc_api_url: string | null;
  use_fasstap_bridge: boolean;
  use_cbdc: boolean;
  apple_pay_enabled: boolean;
  google_pay_enabled: boolean;
  // WiPay fields for merchant credentials
  wipay_username?: string | null;
  wipay_password?: string | null;
  wipay_api_url?: string | null;
  wipay_enabled?: boolean; // Track if WiPay is enabled for this merchant
  created_at: string;
  updated_at: string;
}

export type PaymentMethod =
  | 'CARD'
  | 'CASH'
  | 'TAP_TO_PAY'
  | 'CBDC'
  | 'LYNK'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY'
  | 'WIPAY';

export interface CheckoutOptions {
  merchantId: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  cartItems?: any[];
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
}
