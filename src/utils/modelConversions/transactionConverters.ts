
import { TransactionEntity, TransactionModel } from '@/types/transaction';

/**
 * Convert database TransactionEntity (snake_case) to frontend TransactionModel (camelCase)
 */
export const toTransactionModel = (entity: TransactionEntity | null): TransactionModel | null => {
  if (!entity) return null;
  
  return {
    id: entity.id,
    amount: entity.amount,
    customerId: entity.customer_id,
    feePercentage: entity.fee_percentage,
    merchantId: entity.merchant_id,
    paymentMethod: entity.payment_method,
    reference: entity.reference,
    status: entity.status,
    transactionFee: entity.transaction_fee,
    type: entity.type || 'payment',  // Default type if not provided
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  };
};

/**
 * Convert array of TransactionEntity to array of TransactionModel
 */
export const toTransactionModels = (entities: TransactionEntity[]): TransactionModel[] => {
  return entities
    .map(entity => toTransactionModel(entity))
    .filter((model): model is TransactionModel => model !== null);
};

/**
 * Convert frontend TransactionModel (camelCase) to database TransactionEntity (snake_case)
 */
export const toTransactionEntity = (model: TransactionModel | null): TransactionEntity | null => {
  if (!model) return null;
  
  return {
    id: model.id,
    amount: model.amount,
    customer_id: model.customerId,
    fee_percentage: model.feePercentage,
    merchant_id: model.merchantId,
    payment_method: model.paymentMethod,
    reference: model.reference,
    status: model.status,
    transaction_fee: model.transactionFee,
    type: model.type || 'payment',
    created_at: model.createdAt,
    updated_at: model.updatedAt,
  };
};

/**
 * Convert partial TransactionModel to partial TransactionEntity for updates
 */
export const toPartialTransactionEntity = (model: Partial<TransactionModel>): Partial<TransactionEntity> => {
  const entity: Partial<TransactionEntity> = {};
  
  if (model.amount !== undefined) entity.amount = model.amount;
  if (model.customerId !== undefined) entity.customer_id = model.customerId;
  if (model.feePercentage !== undefined) entity.fee_percentage = model.feePercentage;
  if (model.merchantId !== undefined) entity.merchant_id = model.merchantId;
  if (model.paymentMethod !== undefined) entity.payment_method = model.paymentMethod;
  if (model.reference !== undefined) entity.reference = model.reference;
  if (model.status !== undefined) entity.status = model.status;
  if (model.transactionFee !== undefined) entity.transaction_fee = model.transactionFee;
  if (model.type !== undefined) entity.type = model.type;
  
  return entity;
};
