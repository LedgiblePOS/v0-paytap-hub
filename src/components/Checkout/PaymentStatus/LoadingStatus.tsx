
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingStatus: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p>Initializing payment terminal...</p>
    </div>
  );
};

export default LoadingStatus;
