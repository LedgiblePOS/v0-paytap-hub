
import { CustomerEntity, CustomerModel } from '@/types/customer';

export const toCustomerModel = (entity: CustomerEntity): CustomerModel => {
  return {
    id: entity.id,
    firstName: entity.first_name,
    lastName: entity.last_name,
    email: entity.email,
    phone: entity.phone,
    address: entity.address_line1,
    city: entity.city,
    state: entity.state,
    postalCode: entity.postal_code,
    country: entity.country,
    customerGroupId: entity.customer_group_id,
    totalPurchases: entity.total_purchases,
    lastPurchaseDate: entity.last_purchase_date,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    merchantId: entity.merchant_id,
    // Computed fields
    name: `${entity.first_name} ${entity.last_name}`,
    type: entity.total_purchases > 1000 ? 'wholesale' : 'regular',
    discountEligible: entity.customer_group_id !== null
  };
};

export const toCustomerModels = (entities: CustomerEntity[]): CustomerModel[] => {
  return entities.map(toCustomerModel);
};

export const toCustomerEntity = (model: CustomerModel): CustomerEntity => {
  return {
    id: model.id,
    first_name: model.firstName,
    last_name: model.lastName,
    email: model.email,
    phone: model.phone,
    address_line1: model.address,
    city: model.city,
    state: model.state,
    postal_code: model.postalCode,
    country: model.country,
    customer_group_id: model.customerGroupId,
    total_purchases: model.totalPurchases,
    last_purchase_date: model.lastPurchaseDate,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    merchant_id: model.merchantId
  };
};

export const toCustomerEntities = (models: CustomerModel[]): CustomerEntity[] => {
  return models.map(toCustomerEntity);
};
