
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/types/enums';

export interface PaymentActionsProps {
  onProcessPayment: () => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
  total: number;
  paymentMethod: PaymentMethod;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({ 
  onProcessPayment, 
  onCancel, 
  isProcessing,
  total,
  paymentMethod
}) => {
  return (
    <div className="mt-6 space-y-2">
      <Button 
        className="w-full" 
        disabled={isProcessing} 
        onClick={onProcessPayment}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay ${total.toFixed(2)} with {paymentMethod.replace(/_/g, ' ')}</>
        )}
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onCancel}
        disabled={isProcessing}
      >
        Cancel
      </Button>
    </div>
  );
};

export default PaymentActions;
