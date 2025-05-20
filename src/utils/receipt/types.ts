
import { CartItemType } from "@/components/POS/Cart";
import { Customer } from "@/components/POS/POS";
import { DiscountConfig } from "@/utils/discountUtils";

/**
 * Interface for receipt data structure
 */
export interface ReceiptData {
  merchantName: string;
  merchantId: string;
  transactionId: string;
  date: string;
  items: CartItemType[];
  subtotal: number;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  customer?: Customer | null;
  discountConfig?: DiscountConfig;
  taxAmount?: number;
  taxRate?: number;
  cashGiven?: number;
  change?: number;
  notes?: string;
  transactionFee?: number;
  feePercentage?: number;
}
