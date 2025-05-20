
import { MerchantEntity, MerchantModel, SimplifiedMerchantEntity } from '../types/merchant';
import { SubscriptionTier } from '@/types/enums';

export const toMerchantModel = (entity: MerchantEntity | SimplifiedMerchantEntity): MerchantModel => {
  return {
    id: entity.id,
    userId: entity.user_id,
    name: entity.name || entity.business_name || '', // Use name or fallback to business_name
    businessName: entity.business_name || '',
    businessEmail: entity.business_email || '',
    businessPhone: entity.business_phone || '',
    businessAddress: entity.business_address || '',
    city: entity.city || '',
    state: entity.state || '',
    zipCode: entity.zip_code || '',
    country: entity.country || '',
    subscriptionTier: entity.subscription_tier || 'STARTER',
    isVerified: entity.is_verified || false,
    isActive: entity.is_active !== false, // Default to true
    verificationData: entity.verification_data || null,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    productCount: entity.product_count || 0,
    productLimit: entity.product_limit || 10,
    businessLogo: entity.business_logo || '',
    defaultCurrency: entity.default_currency || 'USD'
  };
};

export const toMerchantEntity = (model: MerchantModel): MerchantEntity => {
  return {
    id: model.id,
    name: model.name || model.businessName, // Use name or fallback to businessName
    user_id: model.userId,
    business_name: model.businessName,
    business_email: model.businessEmail,
    business_phone: model.businessPhone,
    business_address: model.businessAddress,
    city: model.city,
    state: model.state,
    zip_code: model.zipCode,
    country: model.country,
    subscription_tier: model.subscriptionTier,
    is_verified: model.isVerified,
    is_active: model.isActive,
    verification_data: model.verificationData,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    product_count: model.productCount,
    product_limit: model.productLimit,
    business_logo: model.businessLogo,
    default_currency: model.defaultCurrency
  };
};

// Create converters for arrays
export const toMerchantModels = (entities: (MerchantEntity | SimplifiedMerchantEntity)[]): MerchantModel[] => {
  return entities.map(entity => toMerchantModel(entity));
};

export const toMerchantEntities = (models: MerchantModel[]): MerchantEntity[] => {
  return models.map(model => toMerchantEntity(model));
};
