
import { TransactionEntity, TransactionModel } from '@/types/models';

/**
 * Convert a transaction entity from the database (snake_case) to a UI model (camelCase)
 */
export const toTransactionModel = (entity: TransactionEntity): TransactionModel => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    customerId: entity.customer_id,
    amount: entity.amount,
    transactionFee: entity.transaction_fee,
    feePercentage: entity.fee_percentage,
    status: entity.status,
    paymentMethod: entity.payment_method,
    reference: entity.reference,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    type: entity.type,
    customerName: entity.customer_name,
    notes: entity.notes
  };
};

/**
 * Convert a transaction model from the UI (camelCase) to a database entity (snake_case)
 */
export const toTransactionEntity = (model: TransactionModel): TransactionEntity => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    customer_id: model.customerId,
    amount: model.amount,
    transaction_fee: model.transactionFee,
    fee_percentage: model.feePercentage,
    status: model.status,
    payment_method: model.paymentMethod,
    reference: model.reference,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    type: model.type,
    customer_name: model.customerName,
    notes: model.notes
  };
};

/**
 * Convert array of transactions from entities to models
 */
export const toTransactionModels = (entities: TransactionEntity[]): TransactionModel[] => {
  return entities.map(toTransactionModel);
};

/**
 * Convert array of transactions from models to entities
 */
export const toTransactionEntities = (models: TransactionModel[]): TransactionEntity[] => {
  return models.map(toTransactionEntity);
};
