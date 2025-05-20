
// Add accounting-related types

export interface ExpenseModel {
  id: string;
  merchantId: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  taxDeductible: boolean;
  receiptImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeModel {
  id: string;
  merchantId: string;
  description: string;
  amount: number;
  date: string;
  source: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  taxableIncome: number;
  expensesByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  incomeBySource: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    profit: number;
  }>;
}

export interface ReorderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  supplierId?: string;
  totalAmount: number;
  notes?: string;
  paymentMethod?: string; // Added to fix the TypeScript error
  paymentType?: string; // Added as another potential payment field
  expectedDeliveryDate?: string;
}
