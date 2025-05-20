
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PaymentControlsProps {
  useBridge: boolean;
  useCBDC: boolean;
  onToggleBridge: (checked: boolean) => void;
  onToggleCBDC: (checked: boolean) => void;
  isProcessing: boolean;
}

const PaymentControls: React.FC<PaymentControlsProps> = ({
  useBridge,
  useCBDC,
  onToggleBridge,
  onToggleCBDC,
  isProcessing
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 justify-end">
        <Label htmlFor="use-bridge" className="text-sm text-gray-500">
          Use Native SDK Bridge
        </Label>
        <Switch
          id="use-bridge"
          checked={useBridge}
          onCheckedChange={onToggleBridge}
          disabled={useCBDC || isProcessing}
        />
      </div>
      <div className="flex items-center space-x-2 justify-end">
        <Label htmlFor="use-cbdc" className="text-sm text-gray-500">
          Use CBDC Payment
        </Label>
        <Switch
          id="use-cbdc"
          checked={useCBDC}
          onCheckedChange={onToggleCBDC}
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default PaymentControls;
