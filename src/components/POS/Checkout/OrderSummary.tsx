
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define proper types for cart items
interface CartItem {
  id: string;
  name: string;  // Use 'name' consistently instead of 'productName'
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  items: CartItem[];  // Renamed from cartItems to match component usage
  total: number;
  discountConfig?: {
    percentage: number;
    applied: boolean;
  };
  onCheckout?: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  discountConfig = { percentage: 0, applied: false },
  onCheckout
}) => {
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "No items in cart",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    if (onCheckout) {
      onCheckout();
    }
  };

  const discount = discountConfig.applied ? total * (discountConfig.percentage / 100) : 0;
  const finalTotal = total - discount;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {discountConfig.applied && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountConfig.percentage}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No items in cart</div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Complete Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
