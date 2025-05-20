
import React from 'react';
import { PaymentMethod } from '@/types/enums';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
  availableMethods?: PaymentMethod[];
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  disabled = false,
  availableMethods
}) => {
  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value as PaymentMethod);
  };

  // Use the provided availableMethods or fallback to all methods
  const methods = availableMethods || [
    PaymentMethod.CASH,
    PaymentMethod.CARD,
    PaymentMethod.MOBILE,
    PaymentMethod.TAP_TO_PAY,
    PaymentMethod.CBDC,
    PaymentMethod.LYNK,
    PaymentMethod.APPLE_PAY,
    PaymentMethod.GOOGLE_PAY,
    PaymentMethod.WIPAY,
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.DEBIT_CARD,
    PaymentMethod.MOBILE_PAYMENT,
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.CHECK,
    PaymentMethod.OTHER
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Payment Method
      </label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md"
        value={selectedMethod}
        onChange={handleMethodChange}
        disabled={disabled}
      >
        {methods.map((method) => (
          <option key={method} value={method}>
            {method.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PaymentMethodSelector;
