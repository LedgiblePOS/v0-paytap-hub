
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CartItemType } from "@/components/POS/Cart";
import { useTapToPay } from "@/hooks/useTapToPay";
import StatusDisplay from "./PaymentStatus/StatusDisplay";
import LoadingStatus from "./PaymentStatus/LoadingStatus";

interface TapToPayProps {
  amount: number;
  merchantId: string;
  cartItems: CartItemType[];
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const TapToPay: React.FC<TapToPayProps> = ({ 
  amount, 
  merchantId, 
  cartItems, 
  onSuccess, 
  onCancel 
}) => {
  const {
    status,
    errorMessage,
    isInitialized,
    startPayment,
    handleCancel
  } = useTapToPay({
    amount,
    merchantId,
    cartItems,
    onSuccess,
    onCancel
  });

  if (!isInitialized) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <LoadingStatus />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="text-2xl font-bold mb-2">
            ${amount.toFixed(2)}
          </div>
          <div className="mb-6 text-sm text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
          
          <StatusDisplay
            status={status}
            errorMessage={errorMessage}
            onStartPayment={startPayment}
            onCancel={handleCancel}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TapToPay;
