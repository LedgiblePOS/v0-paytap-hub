
import { ProductEntity, ProductModel } from '@/types/models';

/**
 * Converts database product entity (snake_case) to frontend product model (camelCase)
 */
export const toProductModel = (productEntity: ProductEntity): ProductModel => {
  return {
    id: productEntity.id,
    name: productEntity.name,
    description: productEntity.description,
    price: productEntity.price,
    salePrice: productEntity.sale_price,
    sku: productEntity.sku,
    barcode: productEntity.barcode,
    categoryId: productEntity.category_id,
    categoryName: productEntity.category_name,
    inStock: productEntity.in_stock,
    quantity: productEntity.quantity || productEntity.in_stock,
    imageUrl: productEntity.image_url,
    active: productEntity.active || productEntity.is_active || false,
    isActive: productEntity.active || productEntity.is_active || false,
    isAvailable: (productEntity.active || productEntity.is_active) && (productEntity.in_stock > 0),
    merchantId: productEntity.merchant_id,
    createdAt: productEntity.created_at,
    updatedAt: productEntity.updated_at,
    cost: productEntity.cost,
    wholesalePrice: productEntity.wholesale_price,
    taxRate: productEntity.tax_rate,
    discountable: productEntity.discountable,
    featured: productEntity.featured
  };
};

/**
 * Converts frontend product model (camelCase) to database product entity (snake_case)
 */
export const toProductEntity = (productModel: ProductModel): ProductEntity => {
  return {
    id: productModel.id,
    name: productModel.name,
    description: productModel.description,
    price: productModel.price,
    sale_price: productModel.salePrice,
    sku: productModel.sku,
    barcode: productModel.barcode,
    category_id: productModel.categoryId,
    category_name: productModel.categoryName,
    in_stock: productModel.inStock,
    quantity: productModel.quantity || productModel.inStock,
    image_url: productModel.imageUrl,
    active: productModel.active || productModel.isActive || false,
    is_active: productModel.isActive || productModel.active || false,
    merchant_id: productModel.merchantId,
    created_at: productModel.createdAt,
    updated_at: productModel.updatedAt,
    cost: productModel.cost,
    wholesale_price: productModel.wholesalePrice,
    tax_rate: productModel.taxRate,
    discountable: productModel.discountable,
    featured: productModel.featured
  };
};

export const toProductModels = (productEntities: ProductEntity[]): ProductModel[] => {
  return productEntities.map(toProductModel);
};

export const toProductEntities = (productModels: ProductModel[]): ProductEntity[] => {
  return productModels.map(toProductEntity);
};
