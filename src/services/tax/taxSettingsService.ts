
import { supabase } from "@/integrations/supabase/client";

export interface TaxSettings {
  id?: string;
  merchantId: string;
  salesTaxRate: number;
  stateTaxRate: number;
  localTaxRate: number;
  applyTaxToAllProducts: boolean;
  jurisdictionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Database entity interface (snake_case fields)
interface TaxSettingsEntity {
  id?: string;
  merchant_id: string;
  sales_tax_rate: number;
  state_tax_rate: number;
  local_tax_rate: number;
  apply_tax_to_all_products: boolean;
  jurisdiction_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Convert from database entity to UI model
 */
const toTaxSettingsModel = (entity: TaxSettingsEntity): TaxSettings => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    salesTaxRate: entity.sales_tax_rate,
    stateTaxRate: entity.state_tax_rate,
    localTaxRate: entity.local_tax_rate,
    applyTaxToAllProducts: entity.apply_tax_to_all_products,
    jurisdictionId: entity.jurisdiction_id,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  };
};

/**
 * Convert from UI model to database entity
 */
const toTaxSettingsEntity = (model: TaxSettings): TaxSettingsEntity => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    sales_tax_rate: model.salesTaxRate,
    state_tax_rate: model.stateTaxRate,
    local_tax_rate: model.localTaxRate,
    apply_tax_to_all_products: model.applyTaxToAllProducts,
    jurisdiction_id: model.jurisdictionId,
    created_at: model.createdAt,
    updated_at: model.updatedAt
  };
};

/**
 * Get tax settings for a merchant
 */
export const getTaxSettings = async (merchantId: string): Promise<TaxSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('tax_settings')
      .select('*')
      .eq('merchant_id', merchantId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching tax settings:", error);
      return null;
    }
    
    if (!data) return null;
    
    return toTaxSettingsModel(data as TaxSettingsEntity);
  } catch (error) {
    console.error("Error in getTaxSettings:", error);
    return null;
  }
};

/**
 * Save tax settings for a merchant
 */
export const saveTaxSettings = async (settings: TaxSettings): Promise<boolean> => {
  try {
    const settingsEntity = toTaxSettingsEntity(settings);
    
    const { data: existingSettings, error: checkError } = await supabase
      .from('tax_settings')
      .select('id')
      .eq('merchant_id', settingsEntity.merchant_id)
      .maybeSingle();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing tax settings:", checkError);
      return false;
    }
    
    let result;
    
    if (existingSettings?.id) {
      // Update existing record
      result = await supabase
        .from('tax_settings')
        .update({
          sales_tax_rate: settingsEntity.sales_tax_rate,
          state_tax_rate: settingsEntity.state_tax_rate,
          local_tax_rate: settingsEntity.local_tax_rate,
          apply_tax_to_all_products: settingsEntity.apply_tax_to_all_products,
          jurisdiction_id: settingsEntity.jurisdiction_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id);
    } else {
      // Insert new record
      result = await supabase
        .from('tax_settings')
        .insert({
          merchant_id: settingsEntity.merchant_id,
          sales_tax_rate: settingsEntity.sales_tax_rate,
          state_tax_rate: settingsEntity.state_tax_rate,
          local_tax_rate: settingsEntity.local_tax_rate,
          apply_tax_to_all_products: settingsEntity.apply_tax_to_all_products,
          jurisdiction_id: settingsEntity.jurisdiction_id,
        });
    }
    
    if (result.error) {
      console.error("Error saving tax settings:", result.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveTaxSettings:", error);
    return false;
  }
};

/**
 * Get default tax settings
 */
export const getDefaultTaxSettings = (merchantId: string): TaxSettings => {
  return {
    merchantId,
    salesTaxRate: 7.5,
    stateTaxRate: 4.0,
    localTaxRate: 2.0,
    applyTaxToAllProducts: true,
    jurisdictionId: 'custom'
  };
};
