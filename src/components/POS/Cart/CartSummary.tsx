
import React from 'react';
import { DiscountConfig } from '@/utils/discountUtils';

export interface CartSummaryProps {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  discountConfig: DiscountConfig;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discountAmount,
  taxAmount,
  total,
  discountConfig
}) => {
  // Helper function to determine if discount is active
  const isDiscountActive = (): boolean => {
    return discountConfig.isActive || 
           (discountConfig.type !== undefined && discountConfig.type !== 'none') || 
           discountAmount > 0;
  };

  // Helper function to get discount text
  const getDiscountText = (): string => {
    if (discountConfig.type === 'percentage' && discountConfig.value !== undefined) {
      return `(${discountConfig.value}%)`;
    }
    if (discountConfig.isPercentage && discountConfig.percentageDiscount) {
      return `(${discountConfig.percentageDiscount}%)`;
    }
    return '';
  };

  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      
      {isDiscountActive() && (
        <div className="flex justify-between text-green-600">
          <span>
            Discount {getDiscountText()}
          </span>
          <span>-${discountAmount.toFixed(2)}</span>
        </div>
      )}
      
      {taxAmount > 0 && (
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
      )}
      
      <div className="flex justify-between font-bold text-lg border-t pt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
