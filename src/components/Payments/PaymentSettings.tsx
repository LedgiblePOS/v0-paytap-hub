
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PaymentSettingsProps {
  useBridge: boolean;
  useCBDC: boolean;
  isLoading: boolean;
  onToggleBridge: (checked: boolean) => void;
  onToggleCBDC: (checked: boolean) => void;
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  useBridge,
  useCBDC,
  isLoading,
  onToggleBridge,
  onToggleCBDC
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Configure which payment methods to accept</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Card Payments</Label>
                <p className="text-sm text-muted-foreground">Accept credit and debit cards</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Tap to Pay</Label>
                <p className="text-sm text-muted-foreground">Accept contactless NFC payments</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">CBDC Payments</Label>
                <p className="text-sm text-muted-foreground">Accept digital currency payments</p>
              </div>
              <Switch 
                checked={useCBDC} 
                onCheckedChange={onToggleCBDC}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Technical payment configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Native SDK Bridge</Label>
                <p className="text-sm text-muted-foreground">Use native payment processing bridge</p>
              </div>
              <Switch 
                checked={useBridge}
                onCheckedChange={onToggleBridge}
                disabled={useCBDC || isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Test Mode</Label>
                <p className="text-sm text-muted-foreground">Process test payments only</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Native SDK Bridge cannot be enabled when CBDC payments are active.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSettings;
