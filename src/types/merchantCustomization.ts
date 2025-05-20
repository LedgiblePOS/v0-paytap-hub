
export interface MerchantCustomizationEntity {
  id: string;
  merchant_id: string;
  theme_color: string;
  logo_url?: string;
  custom_domain?: string;
  email_template?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  receipt_header?: string;
  receipt_footer?: string;
  created_at: string;
  updated_at: string;
}

export interface MerchantCustomizationModel {
  id: string;
  merchantId: string;
  themeColor: string;
  logoUrl?: string;
  customDomain?: string;
  emailTemplate?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeCustomizationProps {
  merchantId: string;
}
