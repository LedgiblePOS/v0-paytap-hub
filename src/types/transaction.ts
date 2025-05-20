export interface TransactionModel {
  id: string;
  merchantId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  customerName?: string;
  reference?: string;
  customerId?: string;
  note?: string;
  createdBy?: string;
  currency?: string;
  // Add any other properties used in components
}

// If not exists, add the Transaction entity type
export interface Transaction {
  id: string;
  merchant_id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_method: string;
  customer_name?: string;
  reference?: string;
  customer_id?: string;
  note?: string;
  created_by?: string;
  currency?: string;
  // Other fields from database
}

// Adding this missing export that was referenced in TransactionReview.tsx
export interface TransactionEntity extends Transaction {
  // Any additional properties specific to the entity
}
