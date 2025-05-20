
import React from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface FailedStatusProps {
  errorMessage: string;
  onRetry: () => void;
  onCancel: () => void;
}

const FailedStatus: React.FC<FailedStatusProps> = ({ 
  errorMessage, 
  onRetry, 
  onCancel 
}) => {
  return (
    <div className="text-center">
      <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
      <p className="text-lg font-medium text-red-600">Payment failed</p>
      <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
      <Button onClick={onRetry} className="mt-6">
        Try Again
      </Button>
      <Button variant="outline" onClick={onCancel} className="mt-2 w-full">
        Cancel
      </Button>
    </div>
  );
};

export default FailedStatus;
