
import React from "react";
import { CreditCard, Coins, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentButtonProps {
  paymentStage: "idle" | "connecting" | "processing" | "completed" | "failed";
  isProcessing: boolean;
  useCBDC: boolean;
  onTapToPay: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  paymentStage,
  isProcessing,
  useCBDC,
  onTapToPay
}) => {
  return (
    <Button
      className={cn(
        "w-full tap-to-pay-button transition-all duration-200",
        useCBDC ? "bg-yellow-500 hover:bg-yellow-600" : "",
        (paymentStage === "connecting" || paymentStage === "processing") && "animate-pulse"
      )}
      onClick={onTapToPay}
      disabled={isProcessing || paymentStage === "completed"}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {paymentStage === "connecting" ? "Connecting..." : "Processing..."}
        </>
      ) : paymentStage === "completed" ? (
        <>
          <CheckCircle className="mr-2 h-5 w-5" />
          Completed
        </>
      ) : paymentStage === "failed" ? (
        <>
          <AlertCircle className="mr-2 h-5 w-5" />
          Try Again
        </>
      ) : useCBDC ? (
        <>
          <Coins className="mr-2 h-5 w-5" />
          Pay with CBDC
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Tap to Pay
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
