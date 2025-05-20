
import { EntityType, PaymentMethod, SubscriptionTier, UserRole } from './enums';

export interface Expense {
  id: string;
  merchantId: string;
  amount: number;
  date: string;
  taxDeductible: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  category: string;
  receiptImageUrl?: string;
}

export interface MerchantEntity {
  id: string;
  user_id: string;
  business_name: string;
  business_logo?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  postal_code?: string;
  country?: string;
  subscription_tier: SubscriptionTier;
  product_limit: number;
  product_count: number;
  created_at: string;
  updated_at: string;
  default_currency: string;
  is_active: boolean;
  is_verified?: boolean;
  verification_data?: any;
  logo_url?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface MerchantModel {
  id: string;
  userId: string;
  businessName: string;
  businessLogo?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  postalCode?: string;
  country?: string;
  subscriptionTier: SubscriptionTier;
  productLimit: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  defaultCurrency: string;
  isActive: boolean;
  isVerified?: boolean;
  verificationData?: any;
  logoUrl?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface EntityTypeRef {
  type: EntityType;
  id: string;
}

export interface ModelTypeRef {
  type: EntityType;
  id: string;
}

export type ModelType = Record<string, any>;
export type EntityType = Record<string, any>;

// Add SubscriptionPlanModel interface
export interface SubscriptionPlanModel {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  isActive: boolean;
  productLimit: number;
  transactionFeePercentage: number;
  createdAt?: string;
  updatedAt?: string;
}

// Add missing models and entities
export interface Customer {
  id?: string;
  merchant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  customer_group_id?: string;
  total_purchases?: number;
  last_purchase_date?: string;
  // Add camelCase aliases
  merchantId?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
  customerGroupId?: string;
}

export interface CustomerModel {
  id: string;
  merchantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  customerGroupId?: string;
  totalPurchases?: number;
  lastPurchaseDate?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  type?: string;
  discountEligible?: boolean;
}

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountedPrice?: number;
}

export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  sku: string;
  barcode?: string;
  category_id?: string;
  category_name?: string;
  in_stock: number;
  quantity?: number;
  merchant_id: string;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  cost?: number;
  wholesale_price?: number;
  tax_rate?: number;
  discountable?: boolean;
  featured?: boolean;
  is_active?: boolean;
}

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sku: string;
  barcode?: string;
  categoryId?: string;
  categoryName?: string;
  inStock: number;
  quantity?: number;
  merchantId: string;
  imageUrl?: string;
  active?: boolean;
  isActive?: boolean;
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
  cost?: number;
  wholesalePrice?: number;
  taxRate?: number;
  discountable?: boolean;
  featured?: boolean;
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
  type?: string;
  customer_name?: string;
  notes?: string;
}

export interface TransactionModel {
  id: string;
  merchantId: string;
  customerId?: string;
  amount: number;
  transactionFee?: number;
  feePercentage?: number;
  status: string;
  paymentMethod: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
  customerName?: string;
  notes?: string;
}
