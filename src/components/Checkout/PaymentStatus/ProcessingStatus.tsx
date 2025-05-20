
import React from "react";
import { Loader2 } from "lucide-react";

const ProcessingStatus: React.FC = () => {
  return (
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-lg font-medium">Processing payment...</p>
      <p className="text-sm text-gray-500">Please do not remove your card</p>
    </div>
  );
};

export default ProcessingStatus;
