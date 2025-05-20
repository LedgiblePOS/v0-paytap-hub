
import { PaymentMethod, PaymentStatus } from './enums';

export interface Payment {
  id: string;
  merchantId: string;
  customerId?: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionFee?: number;
  feePercentage?: number;
  reference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  merchantId: string;
  customerId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  transactionFee: number;
  reference?: string;
  redirectUrl?: string;
}

export interface TransactionModel {
  id: string;
  merchantId: string;
  customerId?: string;
  amount: number;
  transactionFee: number;
  feePercentage: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  reference?: string;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
}
