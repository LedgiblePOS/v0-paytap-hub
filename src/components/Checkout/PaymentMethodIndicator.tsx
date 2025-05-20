
import React from "react";
import { CreditCard, PhoneCall, Coins } from "lucide-react";

interface PaymentMethodIndicatorProps {
  useCBDC: boolean;
  useBridge: boolean;
}

const PaymentMethodIndicator: React.FC<PaymentMethodIndicatorProps> = ({ 
  useCBDC, 
  useBridge 
}) => {
  return (
    <div className={`px-4 py-3 rounded-lg ${
      useCBDC 
        ? "bg-yellow-100 text-yellow-800" 
        : useBridge 
          ? "bg-green-100 text-green-800" 
          : "bg-blue-100 text-blue-800"
    } flex items-center space-x-2`}>
      {useCBDC ? (
        <>
          <Coins className="h-4 w-4" />
          <span className="text-sm">Using CBDC Payment</span>
        </>
      ) : useBridge ? (
        <>
          <PhoneCall className="h-4 w-4" />
          <span className="text-sm">Using Native SDK Bridge</span>
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          <span className="text-sm">Using Web Implementation</span>
        </>
      )}
    </div>
  );
};

export default PaymentMethodIndicator;
