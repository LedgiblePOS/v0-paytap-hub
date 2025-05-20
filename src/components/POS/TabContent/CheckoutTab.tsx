
import React from 'react';
import Checkout from '../Checkout';
import { CartItemType } from '../Cart';
import { Customer } from '../POS';
import { DiscountConfig } from '@/utils/discountUtils';

interface CheckoutTabProps {
  cartItems: CartItemType[];
  total: number;
  onPaymentComplete: (paymentMethod: string, transactionId: string) => void;
  onCancel: () => void;
  merchantId: string;
  discountConfig: DiscountConfig;
  customer: Customer | null;
}

const CheckoutTab: React.FC<CheckoutTabProps> = ({
  cartItems,
  total,
  onPaymentComplete,
  onCancel,
  merchantId,
  discountConfig,
  customer
}) => {
  return (
    <Checkout 
      cartItems={cartItems}
      total={total}
      onPaymentComplete={onPaymentComplete}
      onCancel={onCancel}
      merchantId={merchantId}
      discountConfig={discountConfig}
      customer={customer}
    />
  );
};

export default CheckoutTab;
