import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Product 1", price: 20, quantity: 1 },
    { id: "2", name: "Product 2", price: 30, quantity: 2 },
  ]);
  const [total, setTotal] = useState(0);
  const [discountConfig, setDiscountConfig] = useState({
    percentage: 10,
    applied: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const newTotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  const handleProcessPayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment processed",
      description: `Payment of $${total.toFixed(
        2
      )} processed via ${paymentMethod}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left section - Customer Information */}
      <div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Name
              </label>
              <Input
                type="text"
                placeholder="Customer Name"
                value={customerInfo.name}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Email
              </label>
              <Input
                type="email"
                placeholder="Customer Email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Phone
              </label>
              <Input
                type="tel"
                placeholder="Customer Phone"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center section - Payment Method */}
      <div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Select Payment Method
              </label>
              <select
                className="w-full p-2 border rounded"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="cash">Cash</option>
                <option value="mobile_payment">Mobile Payment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Card Number
              </label>
              <Input type="text" placeholder="Card Number" />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Expiry Date
              </label>
              <Input type="text" placeholder="MM/YY" />
            </div>
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                CVV
              </label>
              <Input type="text" placeholder="CVV" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right section - Order summary */}
      <div>
        <OrderSummary
          items={cartItems} // Changed from cartItems to items to match the component props
          total={total}
          discountConfig={discountConfig}
          onCheckout={handleProcessPayment}
        />
      </div>
    </div>
  );
};

export default Checkout;
