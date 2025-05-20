
import { DateRange as DayPickerDateRange } from 'react-day-picker';

export interface DateRange {
  from: Date; // Always required
  to?: Date;
  startDate?: Date;
  endDate?: Date;
}

// Convert between DateRange formats
export const convertToAccountingDateRange = (range?: DayPickerDateRange): DateRange | undefined => {
  if (!range || !range.from) return undefined;
  
  return {
    from: range.from,
    to: range.to,
    startDate: range.from,
    endDate: range.to || range.from
  };
};

export const convertToDayPickerDateRange = (range?: DateRange): DayPickerDateRange | undefined => {
  if (!range || !range.from) return undefined;
  
  return {
    from: range.from,
    to: range.to || range.endDate
  };
};

// Define accounting-specific types
export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalIncome: number;
  taxableIncome: number;
  expensesByCategory: CategoryBreakdown[];
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

export interface MonthlyFinancials {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

// Add the missing types
export enum ReportType {
  FINANCIAL_SUMMARY = 'financial_summary',
  TAX_REPORT = 'tax_report',
  SALES_REPORT = 'sales_report',
  EXPENSE_REPORT = 'expense_report',
  CUSTOM = 'custom'
}

export interface FinancialReportParams {
  reportType: ReportType;
  dateRange: DateRange;
  includeCategories?: boolean;
  includeTaxData?: boolean;
  compareWithPrevious?: boolean;
}

// Expense model
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

// Income model
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

// Transaction types
export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME'
}

// Predefined expense categories
export const ExpenseCategories = [
  'Office',
  'Travel',
  'Meals',
  'Utilities',
  'Inventory',
  'Advertising',
  'Subscription',
  'Other'
];

// Predefined income sources
export const IncomeSources = [
  'Sales',
  'Services',
  'Investment',
  'Rental',
  'Refund',
  'Other'
];
