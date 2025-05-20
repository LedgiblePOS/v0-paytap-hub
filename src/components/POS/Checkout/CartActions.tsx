
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowRight } from 'lucide-react';

interface CartActionsProps {
  onClear: () => void;
  onCheckout: () => void;
}

const CartActions: React.FC<CartActionsProps> = ({ onClear, onCheckout }) => {
  return (
    <div className="flex mt-6 gap-2">
      <Button 
        variant="outline"
        onClick={onClear}
        className="flex-1"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear Cart
      </Button>
      <Button 
        onClick={onCheckout}
        className="flex-1"
      >
        <ArrowRight className="mr-2 h-4 w-4" />
        Checkout
      </Button>
    </div>
  );
};

export default CartActions;
