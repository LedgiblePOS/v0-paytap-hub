
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, ShoppingCart, CircleDollarSign, SplitSquareVertical, Banknote } from 'lucide-react';

type PaymentMethod = 'CARD' | 'CASH' | 'TAP_TO_PAY' | 'CBDC' | 'WIPAY';

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: PaymentMethod | null;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  merchantTransactionFee?: number;
  enabledMethods?: PaymentMethod[]; // Allow passing enabled methods
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  merchantTransactionFee = 2.5,
  enabledMethods = ['CARD', 'CASH', 'TAP_TO_PAY', 'CBDC', 'WIPAY'],
}) => {
  const cbdcFee = Math.max(0, merchantTransactionFee - 0.5);

  // Only show enabled payment methods (default = all)
  const availableMethods = [
    {
      key: 'CARD',
      label: 'Card',
      icon: <CreditCard className="h-8 w-8 mb-2" />,
      fee: `Fee: ${merchantTransactionFee}%`,
    },
    {
      key: 'CASH',
      label: 'Cash',
      icon: <Banknote className="h-8 w-8 mb-2" />,
      fee: `No fee`,
    },
    {
      key: 'TAP_TO_PAY',
      label: 'Tap to Pay',
      icon: <CircleDollarSign className="h-8 w-8 mb-2" />,
      fee: `Fee: ${merchantTransactionFee}%`,
    },
    {
      key: 'CBDC',
      label: 'CBDC',
      icon: <SplitSquareVertical className="h-8 w-8 mb-2" />,
      fee: `Fee: ${cbdcFee}%`,
    },
    {
      key: 'WIPAY',
      label: 'WiPay',
      icon: <ShoppingCart className="h-8 w-8 mb-2" />,
      fee: `Fee: ${merchantTransactionFee}%`,
    },
  ].filter((m) => enabledMethods.includes(m.key as PaymentMethod));

  return (
    <div className="grid grid-cols-2 gap-3">
      {availableMethods.map((method) => (
        <Button
          key={method.key}
          variant={selectedPaymentMethod === method.key ? 'default' : 'outline'}
          className="flex flex-col items-center justify-center h-24 p-2"
          onClick={() => onSelectPaymentMethod(method.key as PaymentMethod)}
        >
          {method.icon}
          <span>{method.label}</span>
          <span className="text-xs text-muted-foreground mt-1">{method.fee}</span>
        </Button>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;
