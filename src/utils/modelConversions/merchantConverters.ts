
import { MerchantEntity, MerchantModel } from '@/types/merchant';

export const toMerchantModel = (entity: MerchantEntity): MerchantModel => {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phone: entity.phone,
    address: entity.address,
    logoUrl: entity.logo_url,
    subscriptionTier: entity.subscription_tier,
    isVerified: entity.is_verified,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    userId: entity.user_id,
    businessName: entity.business_name,
    businessEmail: entity.business_email,
    businessPhone: entity.business_phone,
    businessAddress: entity.business_address,
    city: entity.city,
    state: entity.state,
    zipCode: entity.zip_code,
    country: entity.country,
    defaultCurrency: entity.default_currency,
    productCount: entity.product_count,
    productLimit: entity.product_limit,
    isActive: entity.is_active,
    verificationData: entity.verification_data
  };
};

export const toMerchantEntity = (model: MerchantModel): MerchantEntity => {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    phone: model.phone,
    address: model.address,
    logo_url: model.logoUrl,
    subscription_tier: model.subscriptionTier,
    is_verified: model.isVerified,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    user_id: model.userId,
    business_name: model.businessName,
    business_email: model.businessEmail,
    business_phone: model.businessPhone,
    business_address: model.businessAddress,
    city: model.city,
    state: model.state,
    zip_code: model.zipCode,
    country: model.country,
    default_currency: model.defaultCurrency,
    product_count: model.productCount,
    product_limit: model.productLimit,
    is_active: model.isActive,
    verification_data: model.verificationData
  };
};

export const toMerchantModels = (entities: MerchantEntity[]): MerchantModel[] => {
  return entities.map(toMerchantModel);
};

export const toMerchantEntities = (models: MerchantModel[]): MerchantEntity[] => {
  return models.map(toMerchantEntity);
};
