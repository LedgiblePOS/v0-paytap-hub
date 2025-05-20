
import { MerchantCustomizationModel } from '@/types';

export const toMerchantCustomizationModel = (customization: any) => {
  return {
    id: customization.id || '',
    merchantId: customization.merchant_id || '',
    primaryColor: customization.primary_color || '#3B82F6',
    secondaryColor: customization.secondary_color || '#10B981',
    accentColor: customization.accent_color || '#8B5CF6',
    logo: customization.logo || null,
    companyName: customization.company_name || '',
    useDarkMode: customization.use_dark_mode || false,
    receiptFooter: customization.receipt_footer || '',
    enableBranding: customization.enable_branding !== false,
    createdAt: customization.created_at || new Date().toISOString(),
    updatedAt: customization.updated_at || new Date().toISOString(),
    // Additional fields used in ThemeCustomization
    themeColor: customization.theme_color || '#3B82F6',
    logoUrl: customization.logo_url || '',
  };
};

export const toMerchantCustomizationEntity = (model: any) => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    primary_color: model.primaryColor,
    secondary_color: model.secondaryColor,
    accent_color: model.accentColor,
    logo: model.logo,
    company_name: model.companyName,
    use_dark_mode: model.useDarkMode,
    receipt_footer: model.receiptFooter,
    enable_branding: model.enableBranding,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    theme_color: model.themeColor,
    logo_url: model.logoUrl,
  };
};
