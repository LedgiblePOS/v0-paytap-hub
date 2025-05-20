
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EmptyCart from './Checkout/EmptyCart';
import CartItemRow from './Checkout/CartItemRow';
import CartDiscountSection from './Checkout/CartDiscountSection';
import CartSummary from './Checkout/CartSummary';
import CartActions from './Checkout/CartActions';
import WholesaleNotice from './Checkout/WholesaleNotice';
import { DiscountConfig } from '@/utils/discountUtils';

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountedPrice?: number;
}

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  total: number;
  discountConfig?: DiscountConfig;
  onApplyDiscount?: (type: 'percentage' | 'fixed', value: number) => void;
  wholesaleMode?: boolean;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout,
  total,
  discountConfig = { type: 'none', value: 0 },
  onApplyDiscount,
  wholesaleMode = false
}) => {
  // Calculate original total (before discounts)
  const originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount amount
  const discountAmount = originalTotal - total;
  
  // Assume tax is included in total for simplicity
  const taxAmount = 0;
  const subtotal = originalTotal;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div data-testid="cart-content">
      <WholesaleNotice isWholesaleMode={wholesaleMode} />
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <CartItemRow 
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 px-4">
        {onApplyDiscount && (
          <CartDiscountSection onApplyDiscount={onApplyDiscount} />
        )}
        
        <CartSummary 
          subtotal={subtotal}
          originalTotal={originalTotal}
          discountAmount={discountAmount}
          taxAmount={taxAmount}
          total={total}
          discountConfig={discountConfig}
        />
        
        <CartActions onClear={onClear} onCheckout={onCheckout} />
      </div>
    </div>
  );
};

export default Cart;
