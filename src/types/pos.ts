
import { CustomerModel } from './models';
import { DiscountConfig } from './checkout';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  inStock: number;
  barcode?: string;
  merchantId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemType {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}

export interface CheckoutProps {
  total: number;
  onPaymentComplete: (paymentMethod: string, transactionId: string) => void;
  onCancel: () => void;
  merchantId: string;
  discountConfig: DiscountConfig;
  customer: CustomerModel | null;
  cartItems: CartItemType[];
}

export interface Customer {
  id: string;
  merchantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
