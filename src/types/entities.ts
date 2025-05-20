
// Define database entity types (snake_case property names to match DB columns)
export interface MerchantEntity {
  id: string;
  user_id: string;
  business_name: string;
  business_logo: string | null;
  subscription_tier: string;
  product_limit: number;
  product_count: number;
  country?: string | null;
  default_currency: string;
  created_at: string;
  updated_at: string;
}

export interface ProductEntity {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  in_stock: number;
  image_url?: string;
  category_id?: string;
  merchant_id: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  merchant_id: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationLogEntity {
  id: string;
  integration_type: string;
  event_type: string;
  status: string;
  merchant_id?: string;
  request_data?: any;
  response_data?: any;
  error_message?: string;
  external_reference?: string;
  duration_ms?: number;
  created_at: string;
  integration_name?: string;
  message?: string;
  timestamp?: string;
}

export interface AuditLogEntity {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  description?: string;
  created_at: string;
  metadata?: Record<string, any>;
  severity?: string;
  user_email?: string;
  user_name?: string;
  created_by?: string;
}

export interface SecurityLogEntity {
  id: string;
  user_id?: string;
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity: string;
  created_at: string;
}

export interface SubscriptionPlanEntity {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  features: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_limit: number;
  transaction_fee_percentage: number;
}

export interface TransactionEntity {
  id: string;
  merchant_id: string;
  customer_id?: string;
  amount: number;
  transaction_fee?: number;
  fee_percentage?: number;
  status: string;
  payment_method: string;
  reference?: string;
  created_at: string;
  updated_at: string;
}

export interface UserEntity {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  merchant_id?: string | null;
  merchant_name?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface MetricsEntity {
  id: string;
  metric_name: string;
  metric_type: string;
  metric_value: number;
  percentage_change: number | null;
  trend: string;
  category?: string;
  metric_date: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}
