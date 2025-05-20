
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleSectionProps {
  useBridge: boolean;
  useCBDC: boolean;
  onToggleBridge: (checked: boolean) => void;
  onToggleCBDC: (checked: boolean) => void;
}

export const ToggleSection: React.FC<ToggleSectionProps> = ({
  useBridge,
  useCBDC,
  onToggleBridge,
  onToggleCBDC
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="use-bridge">Use Fasstap Native SDK Bridge</Label>
        <Switch id="use-bridge" checked={useBridge} onCheckedChange={onToggleBridge} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="use-cbdc">Use CBDC Payment</Label>
        <Switch id="use-cbdc" checked={useCBDC} onCheckedChange={onToggleCBDC} />
      </div>
    </div>
  );
};
