
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CancelledStatusProps {
  onRetry: () => void;
  onCancel: () => void;
}

const CancelledStatus: React.FC<CancelledStatusProps> = ({ onRetry, onCancel }) => {
  return (
    <div className="text-center">
      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
      <p className="text-lg font-medium text-amber-600">Payment cancelled</p>
      <Button onClick={onRetry} className="mt-6">
        Try Again
      </Button>
      <Button variant="outline" onClick={onCancel} className="mt-2 w-full">
        Back to Checkout
      </Button>
    </div>
  );
};

export default CancelledStatus;
