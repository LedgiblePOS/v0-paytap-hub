
import React from "react";
import { Button } from "@/components/ui/button";

interface IdleStatusProps {
  onStartPayment: () => void;
}

const IdleStatus: React.FC<IdleStatusProps> = ({ onStartPayment }) => {
  return (
    <div className="text-center">
      <p className="text-lg font-medium mb-4">Ready to tap</p>
      <p className="text-sm text-gray-500 mb-6">
        Tap your card, phone, or watch on the payment terminal
      </p>
      <Button onClick={onStartPayment} className="w-full">
        Start Payment
      </Button>
    </div>
  );
};

export default IdleStatus;
