
// Discount configuration
export interface DiscountConfig {
  discountPercentage: number;
  discountCode?: string;
  discountName?: string;
  discountId?: string;
  isActive: boolean;
  minimumAmount?: number;
  maximumDiscount?: number;
  startDate?: string;
  endDate?: string;
  // Add these properties for backward compatibility
  type?: 'percentage' | 'fixed' | 'none';
  value?: number;
}

// Customer entity from database (snake_case)
export interface CustomerEntity {
  id: string;
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
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

// Customer model for UI (camelCase)
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
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}

// Checkout form data
export interface CheckoutFormData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: string;
  notes?: string;
}

// Export interfaces for external use
export type { 
  CustomerEntity, 
  CustomerModel, 
  CartItem, 
  CheckoutFormData, 
  DiscountConfig 
};
