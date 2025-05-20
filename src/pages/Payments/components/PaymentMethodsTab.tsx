
import React, { useState } from 'react';
import { 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Banknote, // Changed from Cash to Banknote
  Smartphone, 
  Wallet, 
  DollarSign,
  SquarePlus,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentMethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
  available: boolean;
  comingSoon?: boolean;
  fee?: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  title,
  description,
  icon,
  enabled,
  onToggle,
  available,
  comingSoon = false,
  fee,
}) => {
  return (
    <div className={`border rounded-lg p-4 flex flex-col ${!available ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{title}</h3>
              {comingSoon && (
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {fee && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    {fee}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fee charged per transaction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Switch 
            checked={enabled} 
            onCheckedChange={onToggle}
            disabled={!available || comingSoon}
          />
        </div>
      </div>
      {enabled && available && (
        <div className="mt-3 p-2 bg-green-50 text-green-600 rounded-md text-sm flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          This payment method is enabled
        </div>
      )}
    </div>
  );
};

const PaymentMethodsTab: React.FC = () => {
  // In a real implementation, these states would come from API calls
  const [paymentMethods, setPaymentMethods] = useState({
    card: true,
    cash: true,
    tapToPay: false,
    cbdc: false,
    wipay: false,
    applePay: false,
    googlePay: false,
    lynk: false,
  });

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };
  
  return (
    <>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Configure which payment methods to accept from your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PaymentMethodCard
            title="Credit/Debit Card"
            description="Accept credit and debit card payments"
            icon={<CreditCard className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.card}
            onToggle={() => togglePaymentMethod('card')}
            available={true}
            fee="2.9% + $0.30"
          />
          
          <PaymentMethodCard
            title="Cash"
            description="Track cash payments in your system"
            icon={<Banknote className="h-5 w-5 text-primary" />} // Changed from Cash to Banknote
            enabled={paymentMethods.cash}
            onToggle={() => togglePaymentMethod('cash')}
            available={true}
            fee="No Fee"
          />
          
          <PaymentMethodCard
            title="Tap to Pay"
            description="Accept NFC payments directly on device"
            icon={<Smartphone className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.tapToPay}
            onToggle={() => togglePaymentMethod('tapToPay')}
            available={true}
            fee="2.5% + $0.25"
          />
          
          <PaymentMethodCard
            title="CBDC"
            description="Accept Central Bank Digital Currency"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.cbdc}
            onToggle={() => togglePaymentMethod('cbdc')}
            available={true}
            fee="1.0%"
          />
          
          <PaymentMethodCard
            title="WiPay"
            description="Accept payments via WiPay"
            icon={<Wallet className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.wipay}
            onToggle={() => togglePaymentMethod('wipay')}
            available={true}
            fee="2.0% + $0.20"
          />
          
          <PaymentMethodCard
            title="Apple Pay"
            description="Accept Apple Pay digital wallet payments"
            icon={<SquarePlus className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.applePay}
            onToggle={() => togglePaymentMethod('applePay')}
            available={false}
            comingSoon={true}
            fee="2.5%"
          />
          
          <PaymentMethodCard
            title="Google Pay"
            description="Accept Google Pay digital wallet payments"
            icon={<Wallet className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.googlePay}
            onToggle={() => togglePaymentMethod('googlePay')}
            available={false}
            comingSoon={true}
            fee="2.5%"
          />
          
          <PaymentMethodCard
            title="Lynk"
            description="Accept payments via Lynk mobile wallet"
            icon={<Smartphone className="h-5 w-5 text-primary" />}
            enabled={paymentMethods.lynk}
            onToggle={() => togglePaymentMethod('lynk')}
            available={false}
            comingSoon={true}
            fee="1.5%"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-6">
        <Button variant="outline" className="mr-2">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </>
  );
};

export default PaymentMethodsTab;
