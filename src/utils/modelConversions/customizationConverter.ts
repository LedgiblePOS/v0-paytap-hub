
import { MerchantCustomization } from '@/types/merchant';

export interface MerchantCustomizationModel {
  id: string;
  merchantId: string;
  logoUrl: string | null;
  themeColor: string;
  customDomain: string | null;
  emailTemplate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantCustomizationEntity {
  id: string;
  merchant_id: string;
  logo_url: string | null;
  theme_color: string;
  custom_domain: string | null;
  email_template: string | null;
  created_at: string;
  updated_at: string;
}

export const toMerchantCustomizationModel = (entity: MerchantCustomizationEntity): MerchantCustomizationModel => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    logoUrl: entity.logo_url,
    themeColor: entity.theme_color,
    customDomain: entity.custom_domain,
    emailTemplate: entity.email_template,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  };
};

export const toMerchantCustomizationEntity = (model: MerchantCustomizationModel): MerchantCustomizationEntity => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    logo_url: model.logoUrl,
    theme_color: model.themeColor,
    custom_domain: model.customDomain,
    email_template: model.emailTemplate,
    created_at: model.createdAt,
    updated_at: model.updatedAt
  };
};
