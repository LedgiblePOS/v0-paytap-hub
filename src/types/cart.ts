
export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountedPrice?: number;
}

// Add missing CartItem interface needed by CartTab
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}
