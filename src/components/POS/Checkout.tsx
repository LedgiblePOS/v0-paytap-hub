
import React from 'react';
import { CartItemType } from '@/types/cart';
import { Customer } from '@/types/customer';
import { DiscountConfig } from '@/utils/discountUtils';

interface CheckoutProps {
  cartItems: CartItemType[];
  total: number;
  onPaymentComplete: (paymentMethod: string, transactionId: string) => void;
  onCancel: () => void;
  merchantId: string;
  discountConfig: DiscountConfig;
  customer: Customer | null;
}

const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  total,
  onPaymentComplete,
  onCancel,
  merchantId,
  discountConfig,
  customer
}) => {
  // Simplified implementation - this will be expanded as needed
  return (
    <div className="checkout-container p-4">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      
      <div className="customer-info mb-4">
        {customer ? (
          <div>
            <h3 className="font-medium">Customer</h3>
            <p>{customer.firstName} {customer.lastName}</p>
            {customer.email && <p>{customer.email}</p>}
            {customer.phone && <p>{customer.phone}</p>}
          </div>
        ) : (
          <p>No customer selected</p>
        )}
      </div>
      
      <div className="items-list mb-4">
        <h3 className="font-medium">Items</h3>
        <ul>
          {cartItems.map(item => (
            <li key={item.id} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.discountedPrice || item.price) * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="total-section mb-6 text-lg font-bold">
        <div className="flex justify-between">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="actions flex justify-between">
        <button 
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => onPaymentComplete('CASH', 'manual-' + Date.now())}
        >
          Complete Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
