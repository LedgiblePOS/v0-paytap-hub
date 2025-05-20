
import { CartItemType } from "@/components/POS/Cart";

export interface FasstapBridgeConfig {
  merchantId: string;
  terminalId?: string;
  environmentMode?: "production" | "sandbox";
}

export interface FasstapTransactionResult {
  transactionId: string;
  status: "completed" | "failed" | "cancelled";
  amount: number;
  currency: string;
  timestamp: string;
  paymentMethod: string;
  errorCode?: string;
  errorMessage?: string;
}
