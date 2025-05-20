
import React from 'react';
import { formatCurrency } from '@/utils/currency';
import { DiscountConfig } from '@/utils/discountUtils';

interface CartSummaryProps {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  discountConfig: DiscountConfig;
  originalTotal?: number; // Added to match usage in Cart.tsx
}

const formatDiscountConfig = (config: DiscountConfig): string => {
  if (!config.isActive && 
      (!config.type || config.type === 'none') && 
      (!config.value || config.value === 0) && 
      (!config.percentageDiscount || config.percentageDiscount === 0) && 
      (!config.fixedDiscount || config.fixedDiscount === 0)) {
    return 'No discount';
  }
  
  // Handle type-based format
  if (config.type === 'percentage' && config.value !== undefined) {
    return `${config.value}% off`;
  }
  
  if (config.type === 'fixed' && config.value !== undefined) {
    return `$${config.value.toFixed(2)} off`;
  }

  // Handle legacy-based format
  if (config.isPercentage && config.percentageDiscount) {
    return `${config.percentageDiscount}% off`;
  }
  
  if (!config.isPercentage && config.fixedDiscount) {
    return `$${config.fixedDiscount.toFixed(2)} off`;
  }
  
  return 'Invalid discount';
};

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discountAmount,
  taxAmount,
  total,
  discountConfig,
  originalTotal
}) => {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      
      {discountAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount ({formatDiscountConfig(discountConfig)}):</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      )}
      
      <div className="flex justify-between">
        <span className="text-gray-600">Tax:</span>
        <span>{formatCurrency(taxAmount)}</span>
      </div>
      
      <div className="flex justify-between border-t pt-2 font-medium">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default CartSummary;
