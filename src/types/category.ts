
export interface CategoryEntity {
  id: string;
  name: string;
  description?: string;
  merchant_id: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface CategoryModel {
  id: string;
  name: string;
  description?: string;
  merchantId: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
