
import React from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItemType } from '../Cart';

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isWholesaleMode?: boolean;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  isWholesaleMode 
}) => {
  const handleDecreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  // Calculate the effective price (either regular or wholesale discounted price)
  const effectiveUnitPrice = item.discountedPrice || item.price;
  const effectiveTotal = effectiveUnitPrice * item.quantity;

  // Determine if an item has a discount applied
  const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <div className="flex items-center text-sm">
          <span className={hasDiscount ? "text-gray-400 line-through mr-2" : "text-gray-600"}>
            ${item.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-green-600">
              ${item.discountedPrice?.toFixed(2)}
            </span>
          )}
          {isWholesaleMode && hasDiscount && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
              Wholesale
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none"
            onClick={handleDecreaseQuantity}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none"
            onClick={handleIncreaseQuantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="w-20 text-right font-medium">
          ${effectiveTotal.toFixed(2)}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-400 hover:text-red-500"
          onClick={handleRemove}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemRow;
