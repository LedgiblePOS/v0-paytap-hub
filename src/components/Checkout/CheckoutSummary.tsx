
import React from "react";
import { CartItemType } from "@/components/POS/Cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";

interface CheckoutSummaryProps {
  cartItems: CartItemType[];
  amount: number;
  className?: string;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ 
  cartItems, 
  amount,
  className
}) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = amount - subtotal;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span className="text-sm">
                {item.name} x {item.quantity}
              </span>
              <span className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <Separator className="my-3" />
          
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
