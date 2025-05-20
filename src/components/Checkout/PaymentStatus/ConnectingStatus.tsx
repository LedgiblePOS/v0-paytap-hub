
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConnectingStatusProps {
  onCancel: () => void;
}

const ConnectingStatus: React.FC<ConnectingStatusProps> = ({ onCancel }) => {
  return (
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-lg font-medium">Connecting to terminal...</p>
      <Button variant="outline" onClick={onCancel} className="mt-6">
        Cancel
      </Button>
    </div>
  );
};

export default ConnectingStatus;
