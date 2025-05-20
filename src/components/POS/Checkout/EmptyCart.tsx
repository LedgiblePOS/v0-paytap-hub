
import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCartProps {
  onBrowseProducts?: () => void;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onBrowseProducts }) => {
  return (
    <div className="text-center py-16 flex flex-col items-center" data-testid="empty-cart">
      <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" strokeWidth={1.5} />
      <h3 className="text-2xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        Add products to start a new sale or browse available inventory
      </p>
      
      {onBrowseProducts && (
        <Button 
          onClick={onBrowseProducts}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Browse Products
        </Button>
      )}
    </div>
  );
};

export default EmptyCart;
