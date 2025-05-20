
import { Supplier, SupplierModel } from '@/types';

export const toSupplierModel = (entity: Supplier): SupplierModel => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    name: entity.name,
    contactName: entity.contact_name,
    email: entity.email,
    phone: entity.phone,
    createdAt: entity.created_at || '',
    updatedAt: entity.updated_at || ''
  };
};

export const toSupplierEntity = (model: SupplierModel): Supplier => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    name: model.name,
    contact_name: model.contactName,
    email: model.email,
    phone: model.phone,
    created_at: model.createdAt,
    updated_at: model.updatedAt
  };
};

export const toSupplierModels = (entities: Supplier[]): SupplierModel[] => {
  return entities.map(entity => toSupplierModel(entity));
};

export const toSupplierEntities = (models: SupplierModel[]): Supplier[] => {
  return models.map(model => toSupplierEntity(model));
};
