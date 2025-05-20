
export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export interface CustomerData {
  id: string;
  merchant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  customer_group_id?: string;
  total_purchases?: number;
  last_purchase_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerModel {
  id: string;
  merchantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  customerGroupId?: string;
  totalPurchases?: number;
  lastPurchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Update CustomerEntity to include properties used in CustomerBanner
export interface CustomerEntity {
  id: string;
  merchant_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  customer_group_id?: string;
  total_purchases?: number;
  last_purchase_date?: string;
  created_at: string;
  updated_at: string;
  // Add these properties for backward compatibility with CustomerBanner.tsx
  name?: string; 
  type?: string;
  discountEligible?: boolean;
}
