
import { ProductEntity, ProductModel } from '@/types/product';

/**
 * Converts a ProductEntity (snake_case) to a ProductModel (camelCase)
 */
export const toProductModel = (entity: ProductEntity): ProductModel => {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description || '',
    price: entity.price,
    sku: entity.sku,
    barcode: entity.barcode,
    categoryId: entity.category_id,
    merchantId: entity.merchant_id,
    imageUrl: entity.image_url,
    inStock: entity.in_stock,
    quantity: entity.quantity || 0,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    isActive: entity.is_active,
    cost: entity.cost,
    wholesalePrice: entity.wholesale_price,
    taxRate: entity.tax_rate,
    discountable: entity.discountable,
    featured: entity.featured
  };
};

/**
 * Converts a ProductModel (camelCase) to a ProductEntity (snake_case)
 */
export const toProductEntity = (model: ProductModel): ProductEntity => {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    price: model.price,
    sku: model.sku,
    barcode: model.barcode,
    category_id: model.categoryId,
    merchant_id: model.merchantId,
    image_url: model.imageUrl,
    in_stock: model.inStock,
    quantity: model.quantity,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    is_active: model.isActive,
    cost: model.cost,
    wholesale_price: model.wholesalePrice,
    tax_rate: model.taxRate,
    discountable: model.discountable,
    featured: model.featured
  };
};

/**
 * Converts an array of ProductEntity to an array of ProductModel
 */
export const toProductModels = (entities: ProductEntity[]): ProductModel[] => {
  return entities.map(toProductModel);
};

/**
 * Converts an array of ProductModel to an array of ProductEntity
 */
export const toProductEntities = (models: ProductModel[]): ProductEntity[] => {
  return models.map(toProductEntity);
};
