
import { MerchantEntity, MerchantModel } from '@/types/merchant';

/**
 * Converts database merchant entity (snake_case) to frontend merchant model (camelCase)
 */
export const toMerchantModel = (entity: MerchantEntity): MerchantModel => {
  return {
    id: entity.id,
    userId: entity.user_id,
    businessName: entity.business_name || '',
    businessEmail: entity.business_email || '',
    businessPhone: entity.business_phone || '',
    businessAddress: entity.business_address || '',
    name: entity.name || entity.business_name || '',
    email: entity.business_email || '',
    phone: entity.business_phone || '',
    address: entity.business_address || '',
    city: entity.city || '',
    state: entity.state || '',
    zipCode: entity.zip_code || entity.postal_code || '',
    postalCode: entity.postal_code || entity.zip_code || '',
    country: entity.country || '',
    subscriptionTier: entity.subscription_tier || 'STARTER',
    businessLogo: entity.business_logo || '',
    logoUrl: entity.logo_url || entity.business_logo || '',
    logo: entity.logo || entity.business_logo || '',
    isVerified: entity.is_verified || false,
    isActive: entity.is_active !== false, // Default to true if undefined
    verificationData: entity.verification_data || null,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    productCount: entity.product_count || 0,
    productLimit: entity.product_limit || 10,
    defaultCurrency: entity.default_currency || 'USD'
  };
};

/**
 * Converts frontend merchant model (camelCase) to database merchant entity (snake_case)
 */
export const toMerchantEntity = (model: MerchantModel): MerchantEntity => {
  return {
    id: model.id,
    user_id: model.userId || '',
    business_name: model.businessName || model.name || '',
    business_email: model.businessEmail || model.email || '',
    business_phone: model.businessPhone || model.phone || '',
    business_address: model.businessAddress || model.address || '',
    name: model.name || model.businessName || '',
    email: model.email || model.businessEmail || '',
    phone: model.phone || model.businessPhone || '',
    address: model.address || model.businessAddress || '',
    city: model.city || '',
    state: model.state || '',
    postal_code: model.postalCode || model.zipCode || '',
    zip_code: model.zipCode || model.postalCode || '',
    country: model.country || '',
    subscription_tier: model.subscriptionTier || 'STARTER',
    business_logo: model.businessLogo || model.logo || '',
    logo_url: model.logoUrl || model.businessLogo || model.logo || '',
    logo: model.logo || model.businessLogo || '',
    is_verified: model.isVerified || false,
    is_active: model.isActive !== false, // Default to true if undefined
    verification_data: model.verificationData || null,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    product_count: model.productCount || 0,
    product_limit: model.productLimit || 10,
    default_currency: model.defaultCurrency || 'USD'
  };
};

export const toMerchantModels = (entities: MerchantEntity[]): MerchantModel[] => {
  return entities.map(toMerchantModel);
};

export const toMerchantEntities = (models: MerchantModel[]): MerchantEntity[] => {
  return models.map(toMerchantEntity);
};
