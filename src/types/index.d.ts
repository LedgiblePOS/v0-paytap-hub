
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  description: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  MERCHANT = "MERCHANT",
}

export interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_verified: boolean;
  verification_data: any;
  subscription_tier: string;
}

export interface MerchantVerificationModel {
  id: string;
  merchantId: string;
  merchantName: string;
  verificationType: string;
  isVerified: boolean;
  createdAt: string;
  verifiedAt: string | null;
  verificationData: any;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  is_available: boolean;
  barcode: string | null;
}

export interface Order {
  id: string;
  merchant_id: string;
  customer_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface Customer {
  id: string;
  merchant_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthly_price: number;
  annual_price: number;
  features: string[] | string | null;
  is_active: boolean;
  created_at: string;
  product_limit: number;
  description: string;
  price: number;
}

export interface SubscriptionPlanModel {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  annualPrice: number;
  productLimit: number;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  price?: number; // For backward compatibility
}

// First Atlantic Commerce payment types
export interface SubscriptionPaymentDetails {
  plan: SubscriptionPlanModel;
  cardDetails: {
    cardNumber: string;
    cardExpiryMonth: string;
    cardExpiryYear: string;
    cardCVV: string;
    cardHolderName: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
    phone?: string;
    email: string;
  };
}

export interface FirstAtlanticCommerceConfig {
  merchantId: string;
  apiKey: string;
  apiUrl: string;
  testMode: boolean;
}

