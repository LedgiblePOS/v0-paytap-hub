
import { 
  Expense, ExpenseModel,
  Income, IncomeModel,
  TaxCategory, TaxCategoryModel,
  Receipt, ReceiptModel 
} from '@/types/accounting';

// Entity to Model conversions
export function toExpenseModel(expense: Expense): ExpenseModel {
  return {
    id: expense.id,
    merchantId: expense.merchant_id,
    amount: expense.amount,
    description: expense.description,
    date: expense.date,
    category: expense.category,
    receiptImageUrl: expense.receipt_image_url,
    taxDeductible: expense.tax_deductible,
    createdAt: expense.created_at,
    updatedAt: expense.updated_at,
  };
}

export function toIncomeModel(income: Income): IncomeModel {
  return {
    id: income.id,
    merchantId: income.merchant_id,
    amount: income.amount,
    description: income.description,
    date: income.date,
    source: income.source,
    documentUrl: income.document_url,
    createdAt: income.created_at,
    updatedAt: income.updated_at,
  };
}

export function toTaxCategoryModel(taxCategory: TaxCategory): TaxCategoryModel {
  return {
    id: taxCategory.id,
    merchantId: taxCategory.merchant_id,
    name: taxCategory.name,
    description: taxCategory.description,
    deductionRate: taxCategory.deduction_rate,
    createdAt: taxCategory.created_at,
    updatedAt: taxCategory.updated_at,
  };
}

export function toReceiptModel(receipt: Receipt): ReceiptModel {
  return {
    id: receipt.id,
    expenseId: receipt.expense_id,
    fileUrl: receipt.file_url,
    extractedData: receipt.extracted_data,
    createdAt: receipt.created_at,
    updatedAt: receipt.updated_at,
  };
}

// Model to Entity conversions
export function toExpenseEntity(model: ExpenseModel): Expense {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    amount: model.amount,
    description: model.description,
    date: model.date,
    category: model.category,
    receipt_image_url: model.receiptImageUrl,
    tax_deductible: model.taxDeductible,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
  };
}

export function toIncomeEntity(model: IncomeModel): Income {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    amount: model.amount,
    description: model.description,
    date: model.date,
    source: model.source,
    document_url: model.documentUrl,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
  };
}

export function toTaxCategoryEntity(model: TaxCategoryModel): TaxCategory {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    name: model.name,
    description: model.description,
    deduction_rate: model.deductionRate,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
  };
}

export function toReceiptEntity(model: ReceiptModel): Receipt {
  return {
    id: model.id,
    expense_id: model.expenseId,
    file_url: model.fileUrl,
    extracted_data: model.extractedData,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
  };
}

// Batch conversions
export function toExpenseModels(expenses: Expense[]): ExpenseModel[] {
  return expenses.map(toExpenseModel);
}

export function toExpenseEntities(models: ExpenseModel[]): Expense[] {
  return models.map(toExpenseEntity);
}

export function toIncomeModels(incomes: Income[]): IncomeModel[] {
  return incomes.map(toIncomeModel);
}

export function toIncomeEntities(models: IncomeModel[]): Income[] {
  return models.map(toIncomeEntity);
}

export function toTaxCategoryModels(categories: TaxCategory[]): TaxCategoryModel[] {
  return categories.map(toTaxCategoryModel);
}

export function toTaxCategoryEntities(models: TaxCategoryModel[]): TaxCategory[] {
  return models.map(toTaxCategoryEntity);
}

export function toReceiptModels(receipts: Receipt[]): ReceiptModel[] {
  return receipts.map(toReceiptModel);
}

export function toReceiptEntities(models: ReceiptModel[]): Receipt[] {
  return models.map(toReceiptEntity);
}
