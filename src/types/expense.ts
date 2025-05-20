
export interface ExpenseEntity {
  id: string;
  merchant_id: string;
  amount: number;
  date: string;
  tax_deductible: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  category: string;
  receipt_image_url?: string;
}

export interface Expense {
  id: string;
  merchantId: string;
  amount: number;
  date: string;
  taxDeductible: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  category: string;
  receiptImageUrl?: string;
}

export function toExpenseModel(entity: ExpenseEntity): Expense {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    amount: entity.amount,
    date: entity.date,
    taxDeductible: entity.tax_deductible,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    description: entity.description,
    category: entity.category,
    receiptImageUrl: entity.receipt_image_url
  };
}

export function toExpenseModels(entities: ExpenseEntity[]): Expense[] {
  return entities.map(toExpenseModel);
}

export function toExpenseEntity(model: Expense): ExpenseEntity {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    amount: model.amount,
    date: model.date,
    tax_deductible: model.taxDeductible,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    description: model.description,
    category: model.category,
    receipt_image_url: model.receiptImageUrl
  };
}
