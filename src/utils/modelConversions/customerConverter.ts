
import { CustomerEntity, CustomerModel } from '@/types/checkout';
import { createConverters } from '../modelConverter';

/**
 * Convert a customer entity from the database (snake_case) to a UI model (camelCase)
 */
export const toCustomerModel = (entity: CustomerEntity): CustomerModel => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    firstName: entity.first_name,
    lastName: entity.last_name,
    email: entity.email,
    phone: entity.phone,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    customerGroupId: entity.customer_group_id,
    totalPurchases: entity.total_purchases,
    lastPurchaseDate: entity.last_purchase_date,
    addressLine1: entity.address_line1,
    addressLine2: entity.address_line2,
    city: entity.city,
    state: entity.state,
    postalCode: entity.postal_code,
    country: entity.country
  };
};

/**
 * Convert a customer model from the UI (camelCase) to a database entity (snake_case)
 */
export const toCustomerEntity = (model: CustomerModel): CustomerEntity => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    first_name: model.firstName,
    last_name: model.lastName,
    email: model.email,
    phone: model.phone,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    customer_group_id: model.customerGroupId,
    total_purchases: model.totalPurchases,
    last_purchase_date: model.lastPurchaseDate,
    address_line1: model.addressLine1,
    address_line2: model.addressLine2,
    city: model.city,
    state: model.state,
    postal_code: model.postalCode,
    country: model.country
  };
};

// Create a complete set of conversion utilities
const customerConverters = createConverters<CustomerEntity, CustomerModel>(
  toCustomerModel,
  toCustomerEntity
);

// Export individual functions
export const toCustomerModels = customerConverters.toModels;
export const toCustomerEntities = customerConverters.toEntities;

// Export default converters object
export default customerConverters;
