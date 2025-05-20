
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { CartItemType } from "@/components/POS/Cart";

export interface PaymentStatusDisplayProps {
  status: "completed" | "failed" | "cancelled";
  amount?: number;
  cartItems?: CartItemType[];
  transactionId?: string;
  errorMessage?: string;
}

const PaymentStatusDisplay: React.FC<PaymentStatusDisplayProps> = ({
  status,
  amount,
  cartItems,
  transactionId,
  errorMessage
}) => {
  const isSuccess = status === "completed";
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-4">
          {isSuccess ? (
            <CheckCircle size={64} className="text-green-500" />
          ) : (
            <XCircle size={64} className="text-red-500" />
          )}
        </div>
        <CardTitle className="text-center text-2xl font-bold">
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </CardTitle>
        <CardDescription className="text-center">
          {isSuccess
            ? "Your transaction has been completed"
            : errorMessage || "There was an issue processing your payment"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSuccess && amount && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold">${amount.toFixed(2)}</span>
              </div>
              {transactionId && (
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-xs text-muted-foreground">{transactionId}</span>
                </div>
              )}
            </div>
            
            {cartItems && cartItems.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Purchased Items:</h3>
                <ul className="space-y-2">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex justify-between border-b pb-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button asChild className="w-full">
          <Link to="/pos">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isSuccess ? "Continue Shopping" : "Try Again"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStatusDisplay;
