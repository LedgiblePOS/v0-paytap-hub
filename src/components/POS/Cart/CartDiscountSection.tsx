
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DiscountConfig } from '@/utils/discountUtils';

export interface CartDiscountSectionProps {
  currentDiscount: DiscountConfig;
  onDiscountSelect: (type: "fixed" | "percentage" | "none", value: number) => void;
}

const CartDiscountSection: React.FC<CartDiscountSectionProps> = ({
  currentDiscount,
  onDiscountSelect,
}) => {
  // Use either the type property or derive from isPercentage
  const getInitialType = (): "fixed" | "percentage" | "none" => {
    if (currentDiscount.type) return currentDiscount.type;
    if (!currentDiscount.isActive) return "none";
    return currentDiscount.isPercentage ? "percentage" : "fixed";
  };

  // Use either the value property or derive from percentageDiscount/fixedDiscount
  const getInitialValue = (): number => {
    if (currentDiscount.value !== undefined) return currentDiscount.value;
    if (currentDiscount.isPercentage && currentDiscount.percentageDiscount) {
      return currentDiscount.percentageDiscount;
    }
    if (!currentDiscount.isPercentage && currentDiscount.fixedDiscount) {
      return currentDiscount.fixedDiscount;
    }
    return 0;
  };

  const [discountType, setDiscountType] = useState<"fixed" | "percentage" | "none">(getInitialType());
  const [discountValue, setDiscountValue] = useState<number>(getInitialValue());

  const handleApplyDiscount = () => {
    onDiscountSelect(discountType, discountValue);
  };

  const handleRemoveDiscount = () => {
    setDiscountType("none");
    setDiscountValue(0);
    onDiscountSelect("none", 0);
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-3">Apply Discount</h3>
      
      <RadioGroup 
        value={discountType} 
        onValueChange={(value) => setDiscountType(value as "fixed" | "percentage" | "none")}
        className="mb-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fixed" id="discount-fixed" />
          <Label htmlFor="discount-fixed">Fixed Amount ($)</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="percentage" id="discount-percentage" />
          <Label htmlFor="discount-percentage">Percentage (%)</Label>
        </div>
      </RadioGroup>
      
      {discountType !== "none" && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="discount-value">
              {discountType === "fixed" ? "Amount ($)" : "Percentage (%)"}
            </Label>
            <Input
              id="discount-value"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              min={0}
              max={discountType === "percentage" ? 100 : undefined}
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleApplyDiscount}
              className="flex-1"
            >
              Apply
            </Button>
            
            {(currentDiscount.isActive || 
              (currentDiscount.type && currentDiscount.type !== "none") || 
              (currentDiscount.value && currentDiscount.value > 0)) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveDiscount}
              >
                Remove Discount
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDiscountSection;
