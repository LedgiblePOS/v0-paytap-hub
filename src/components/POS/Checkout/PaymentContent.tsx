
import React from 'react';
import { PaymentMethod } from '@/types/enums';

export interface PaymentContentProps {
  paymentMethod: PaymentMethod;
  total: number;
}

const PaymentContent: React.FC<PaymentContentProps> = ({ paymentMethod, total }) => {
  const renderContent = () => {
    switch (paymentMethod) {
      case PaymentMethod.CARD:
        return (
          <div className="p-4 border rounded-md bg-gray-50">
            <p className="mb-2 text-sm">Please swipe your card or enter card details:</p>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        );
      case PaymentMethod.CASH:
        return (
          <div className="p-4 border rounded-md bg-gray-50">
            <p className="mb-2 text-sm">Cash payment:</p>
            <div className="flex justify-between font-semibold">
              <p>Amount due:</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
        );
      case PaymentMethod.MOBILE:
        return (
          <div className="p-4 border rounded-md bg-gray-50">
            <p className="mb-2 text-sm">Mobile payment:</p>
            <div className="space-y-2">
              <p className="text-center">Scan QR code to pay</p>
              <div className="h-40 w-40 bg-gray-200 mx-auto rounded-md animate-pulse" />
            </div>
          </div>
        );
      case PaymentMethod.TAP_TO_PAY:
      case PaymentMethod.CBDC:
      case PaymentMethod.LYNK:
      case PaymentMethod.APPLE_PAY:
      case PaymentMethod.GOOGLE_PAY:
      case PaymentMethod.WIPAY:
        return (
          <div className="p-4 border rounded-md bg-gray-50">
            <p className="mb-2 text-sm">{paymentMethod.replace(/_/g, ' ')} payment:</p>
            <div className="space-y-2">
              <p className="text-center">Follow instructions on device</p>
              <div className="h-12 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        );
      default:
        return <p>Select a payment method</p>;
    }
  };
  
  return (
    <div className="my-4">
      {renderContent()}
    </div>
  );
};

export default PaymentContent;
