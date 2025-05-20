
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  subMessage?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Loading...", 
  subMessage 
}) => {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium">{message}</p>
        {subMessage && (
          <p className="text-sm text-muted-foreground mt-2">{subMessage}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator;
