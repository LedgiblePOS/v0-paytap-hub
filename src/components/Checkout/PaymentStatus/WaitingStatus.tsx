
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface WaitingStatusProps {
  onCancel: () => void;
}

const WaitingStatus: React.FC<WaitingStatusProps> = ({ onCancel }) => {
  return (
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-lg font-medium mb-2">Waiting for tap...</p>
      <p className="text-sm text-gray-500">
        Please tap your card, phone, or watch on the terminal
      </p>
      <Button variant="outline" onClick={onCancel} className="mt-6">
        Cancel
      </Button>
    </div>
  );
};

export default WaitingStatus;
