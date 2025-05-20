
// Re-export all accounting services for backward compatibility

// Expense-related services
export {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  uploadReceiptImage,
  processReceiptImage
} from './expenseService';

// Income-related services
export {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome
} from './incomeService';

// Reporting-related services
export {
  getFinancialSummary,
  generateTaxReport
} from './reportingService';

// Supplier-related services
export {
  createReorderExpense,
  type ReorderItem,
  type ReorderRequest
} from './supplierService';
