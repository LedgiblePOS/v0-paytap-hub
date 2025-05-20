
import React from "react";
import { CheckCircle2 } from "lucide-react";

const SuccessStatus: React.FC = () => {
  return (
    <div className="text-center">
      <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
      <p className="text-lg font-medium text-green-600">Payment successful!</p>
      <p className="text-sm text-gray-500 mt-2">
        Your payment has been processed successfully
      </p>
    </div>
  );
};

export default SuccessStatus;
