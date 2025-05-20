
import { MerchantCustomizationEntity, MerchantCustomizationModel } from '@/types/merchant';

export const toMerchantCustomizationModel = (entity: MerchantCustomizationEntity): MerchantCustomizationModel => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    logoUrl: entity.logo_url || undefined,
    themeColor: entity.theme_color || undefined,
    customDomain: entity.custom_domain || undefined,
    emailTemplate: entity.email_template || undefined,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  };
};

export const toMerchantCustomizationModels = (entities: MerchantCustomizationEntity[]): MerchantCustomizationModel[] => {
  return entities.map(toMerchantCustomizationModel);
};

export const toMerchantCustomizationEntity = (model: MerchantCustomizationModel): MerchantCustomizationEntity => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    logo_url: model.logoUrl || null,
    theme_color: model.themeColor || null,
    custom_domain: model.customDomain || null,
    email_template: model.emailTemplate || null,
    created_at: model.createdAt,
    updated_at: model.updatedAt
  };
};
