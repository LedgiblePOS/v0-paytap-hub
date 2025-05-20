
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomerEntity } from '@/types/customer';

interface CustomerBannerProps {
  customer: CustomerEntity;
  onApplyWholesaleDiscount: () => void;
}

const CustomerBanner: React.FC<CustomerBannerProps> = ({ customer, onApplyWholesaleDiscount }) => {
  // Get name from first_name and last_name if name property doesn't exist
  const customerName = customer.name || `${customer.first_name} ${customer.last_name}`;
  
  // Determine customer type with fallback
  const customerType = customer.type || 'retail';
  
  // Check if customer is eligible for discount with fallback
  const isDiscountEligible = customer.discountEligible || false;
  
  return (
    <div className="bg-muted/50 p-3 rounded-md flex justify-between items-center">
      <div>
        <span className="text-sm text-muted-foreground">Customer:</span>
        <span className="ml-2 font-medium">{customerName}</span>
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
          {customerType}
        </span>
      </div>
      {isDiscountEligible && (
        <Button variant="outline" size="sm" onClick={onApplyWholesaleDiscount}>
          Apply Wholesale Pricing
        </Button>
      )}
    </div>
  );
};

export default CustomerBanner;
