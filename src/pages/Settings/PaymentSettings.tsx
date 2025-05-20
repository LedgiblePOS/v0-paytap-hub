
import React, { useState } from 'react';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentSettings from '@/components/Payments/PaymentSettings';
import { useToast } from '@/components/ui/use-toast';

const PaymentSettingsPage: React.FC = () => {
  const [useBridge, setUseBridge] = useState<boolean>(false);
  const [useCBDC, setUseCBDC] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleToggleBridge = (checked: boolean) => {
    setUseBridge(checked);
    toast({
      title: checked ? "Native SDK Bridge Enabled" : "Native SDK Bridge Disabled",
      description: checked 
        ? "Your application will now use the native payment processing bridge." 
        : "Your application will now use the standard payment processing service.",
    });
  };

  const handleToggleCBDC = (checked: boolean) => {
    setUseCBDC(checked);
    // If enabling CBDC, disable Bridge as they're incompatible
    if (checked && useBridge) {
      setUseBridge(false);
    }
    
    toast({
      title: checked ? "CBDC Payments Enabled" : "CBDC Payments Disabled",
      description: checked 
        ? "Your application will now accept Central Bank Digital Currency payments." 
        : "Your application will no longer accept Central Bank Digital Currency payments.",
    });
  };

  return (
    <MainLayoutContent>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Payment Settings</h2>
        <p className="text-muted-foreground">
          Configure your payment processing preferences.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentSettings
              useBridge={useBridge}
              useCBDC={useCBDC}
              isLoading={isLoading}
              onToggleBridge={handleToggleBridge}
              onToggleCBDC={handleToggleCBDC}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayoutContent>
  );
};

export default PaymentSettingsPage;
