
export interface ProductEntity {
  id: string;
  merchant_id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  in_stock: number;
  image_url?: string;
  barcode?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductModel {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  inStock: number;
  imageUrl?: string;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

// Aliasing type for POS component
export type Product = ProductEntity;
