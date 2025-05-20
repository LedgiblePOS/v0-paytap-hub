
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DiscountConfig } from '@/utils/discountUtils';

interface CartDiscountSectionProps {
  onApplyDiscount: (type: 'percentage' | 'fixed', value: number) => void;
  currentDiscount?: DiscountConfig;
}

const CartDiscountSection: React.FC<CartDiscountSectionProps> = ({ 
  onApplyDiscount, 
  currentDiscount = { isActive: false, discountPercentage: 0 } 
}) => {
  // Determine the initial discount type
  const getInitialType = (): 'percentage' | 'fixed' => {
    if (currentDiscount.type) {
      return currentDiscount.type === 'percentage' ? 'percentage' : 'fixed';
    }
    return currentDiscount.isPercentage ? 'percentage' : 'fixed';
  };

  // Determine the initial discount value
  const getInitialValue = (): string => {
    if (currentDiscount.value !== undefined && currentDiscount.value > 0) {
      return currentDiscount.value.toString();
    } 
    if (currentDiscount.percentageDiscount) {
      return currentDiscount.percentageDiscount.toString();
    }
    if (currentDiscount.fixedDiscount) {
      return currentDiscount.fixedDiscount.toString();
    }
    return '';
  };

  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(getInitialType());
  const [discountValue, setDiscountValue] = useState<string>(getInitialValue());

  const handleApplyDiscount = () => {
    const numericValue = parseFloat(discountValue);
    if (!isNaN(numericValue) && numericValue > 0) {
      onApplyDiscount(discountType, numericValue);
    }
  };

  const handleClearDiscount = () => {
    onApplyDiscount('fixed', 0); // Use 0 value to clear discount
    setDiscountValue('');
  };

  // Determine if the discount is currently active
  const isDiscountActive = (): boolean => {
    return currentDiscount.isActive || 
           (currentDiscount.value !== undefined && currentDiscount.value > 0) ||
           (currentDiscount.percentageDiscount !== undefined && currentDiscount.percentageDiscount > 0) || 
           (currentDiscount.fixedDiscount !== undefined && currentDiscount.fixedDiscount > 0);
  };

  return (
    <div className="space-y-2 border rounded p-3 bg-gray-50">
      <h3 className="font-medium text-sm">Apply Discount</h3>
      <div className="flex items-center gap-2">
        <select 
          className="p-2 border rounded"
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
        >
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount ($)</option>
        </select>
        
        <Input
          type="number"
          placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter amount'}
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
          className="max-w-[120px]"
          min="0"
          step={discountType === 'percentage' ? '1' : '0.01'}
        />
        
        <Button 
          type="button" 
          size="sm"
          onClick={handleApplyDiscount}
        >
          Apply
        </Button>
        
        {isDiscountActive() && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClearDiscount}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default CartDiscountSection;
