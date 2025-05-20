
import { Customer, CustomerModel, Transaction, TransactionModel } from '@/types';

/**
 * Ensure an object or array is converted to CustomerModel format
 */
export function ensureCustomerModel(data: any): CustomerModel | null {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => ensureCustomerModel(item)) as unknown as CustomerModel;
  }
  
  // If it's already in the right format, return it
  if (data.firstName && data.lastName) {
    return data as CustomerModel;
  }
  
  // Convert from snake_case to camelCase
  if (data.first_name && data.last_name) {
    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postal_code || '',
      country: data.country || '',
      customerGroupId: data.customer_group_id,
      totalPurchases: data.total_purchases || 0,
      lastPurchaseDate: data.last_purchase_date,
      merchantId: data.merchant_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      type: data.type,
      discountEligible: data.discount_eligible
    } as CustomerModel;
  }
  
  return data;
}

/**
 * Ensure an object or array is converted to TransactionModel format
 */
export function ensureTransactionModels(data: any): TransactionModel | TransactionModel[] | null {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => ensureTransactionModel(item));
  }
  
  return ensureTransactionModel(data);
}

function ensureTransactionModel(data: any): TransactionModel {
  if (!data) return null as any;
  
  // If it's already in the right format, return it
  if (data.merchantId && typeof data.paymentMethod === 'string') {
    return data as TransactionModel;
  }
  
  // Convert from snake_case to camelCase
  if (data.merchant_id && data.payment_method) {
    return {
      id: data.id,
      merchantId: data.merchant_id,
      amount: data.amount,
      paymentMethod: data.payment_method,
      status: data.status,
      reference: data.reference || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      customerId: data.customer_id,
      type: data.type || 'SALE',
      customerName: data.customer_name,
      feePercentage: data.fee_percentage,
      transactionFee: data.transaction_fee,
      notes: data.notes
    } as TransactionModel;
  }
  
  return data;
}

