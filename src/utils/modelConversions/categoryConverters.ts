
import { CategoryEntity, CategoryModel } from '@/types';

/**
 * Converts a CategoryEntity (snake_case) to a CategoryModel (camelCase)
 */
export const toCategoryModel = (entity: CategoryEntity): CategoryModel => {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    merchantId: entity.merchant_id,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    isActive: entity.is_active
  };
};

/**
 * Converts a CategoryModel (camelCase) to a CategoryEntity (snake_case)
 */
export const toCategoryEntity = (model: CategoryModel): CategoryEntity => {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    merchant_id: model.merchantId,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    is_active: model.isActive
  };
};

/**
 * Converts an array of CategoryEntity to an array of CategoryModel
 */
export const toCategoryModels = (entities: CategoryEntity[]): CategoryModel[] => {
  return entities.map(toCategoryModel);
};

/**
 * Converts an array of CategoryModel to an array of CategoryEntity
 */
export const toCategoryEntities = (models: CategoryModel[]): CategoryEntity[] => {
  return models.map(toCategoryEntity);
};
