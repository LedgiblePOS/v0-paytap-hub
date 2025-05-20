
export interface MerchantModel {
  id: string;
  name?: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
  userId?: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  logo?: string;
  businessLogo?: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  currency?: string;
  timeZone?: string;
  defaultCurrency?: string;
  productCount?: number;
  productLimit?: number;
  isVerified?: boolean;
  verificationData?: any;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface MerchantEntity {
  id: string;
  name?: string;
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_id: string;
  subscription_tier?: string;
  subscription_status?: string;
  logo?: string;
  business_logo?: string;
  logo_url?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  zip_code?: string;
  country?: string;
  tax_id?: string;
  currency?: string;
  time_zone?: string;
  default_currency: string;
  product_count: number;
  product_limit: number;
  is_verified?: boolean;
  verification_data?: any;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface SimplifiedMerchantEntity {
  id: string;
  name?: string;
  business_name?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  business_logo?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_email?: string;
  subscription_tier?: string;
  default_currency?: string;
  product_count?: number;
  product_limit?: number;
  is_verified?: boolean;
  verification_data?: any;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}
