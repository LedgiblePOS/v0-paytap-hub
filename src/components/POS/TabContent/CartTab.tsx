
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatters';
import { CartItem } from '@/types/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartTabProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
  currencyCode?: string;
}

const CartTab: React.FC<CartTabProps> = ({
  cartItems,
  onRemoveItem,
  onIncreaseQuantity,
  onDecreaseQuantity,
  subtotal,
  tax,
  total,
  onCheckout,
  isCheckingOut,
  currencyCode = 'USD'
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No items in cart
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 border rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price, currencyCode)} × {item.quantity}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-8 text-center">{item.quantity}</span>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onIncreaseQuantity(item.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col pt-4 border-t">
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal, currencyCode)}</span>
          </div>
          
          <div className="flex justify-between text-muted-foreground">
            <span>Tax</span>
            <span>{formatCurrency(tax, currencyCode)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCurrency(total, currencyCode)}</span>
          </div>
          
          <Button 
            className="w-full mt-4" 
            size="lg"
            onClick={onCheckout}
            disabled={cartItems.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Checkout'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartTab;
