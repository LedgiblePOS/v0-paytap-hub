
import { SubscriptionPlan, SubscriptionPlanModel } from '@/types/subscription';

export const toSubscriptionPlanModel = (entity: SubscriptionPlan): SubscriptionPlanModel => {
  let features: string[];

  // Handle different formats of features
  if (typeof entity.features === 'string') {
    try {
      // Try to parse the string as JSON
      const parsed = JSON.parse(entity.features);
      features = Array.isArray(parsed) ? parsed : [entity.features];
    } catch (e) {
      // If parsing fails, treat it as a single feature
      features = [entity.features];
    }
  } else if (Array.isArray(entity.features)) {
    features = entity.features;
  } else if (entity.features && typeof entity.features === 'object') {
    // Handle Supabase JSONB objects
    features = Object.values(entity.features);
  } else {
    features = [];
  }
  
  return {
    id: entity.id,
    name: entity.name,
    monthlyPrice: entity.monthly_price || entity.monthlyPrice || 0,
    annualPrice: entity.annual_price || entity.annualPrice || 0,
    productLimit: entity.product_limit || entity.productLimit || 0,
    features: features,
    isActive: entity.is_active !== undefined ? entity.is_active : (entity.isActive || false),
    createdAt: entity.created_at || new Date().toISOString(),
    updatedAt: entity.updated_at || new Date().toISOString(),
    description: entity.description || '',
    transactionFeePercentage: entity.transaction_fee_percentage || entity.transactionFeePercentage,
    monthlyVolumeUSD: entity.monthlyVolumeUSD,
    accountAgeMonths: entity.accountAgeMonths
  };
};

export const toSubscriptionPlanEntity = (model: SubscriptionPlanModel): SubscriptionPlan => {
  return {
    id: model.id,
    name: model.name,
    monthlyPrice: model.monthlyPrice,
    annualPrice: model.annualPrice,
    productLimit: model.productLimit,
    features: model.features,
    isActive: model.isActive,
    description: model.description || '',
    transactionFeePercentage: model.transactionFeePercentage,
    monthlyVolumeUSD: model.monthlyVolumeUSD,
    accountAgeMonths: model.accountAgeMonths,
    // Add snake_case versions for backward compatibility
    monthly_price: model.monthlyPrice,
    annual_price: model.annualPrice,
    product_limit: model.productLimit,
    is_active: model.isActive,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    transaction_fee_percentage: model.transactionFeePercentage,
    price: model.monthlyPrice
  };
};

export const toSubscriptionPlanModels = (entities: SubscriptionPlan[]): SubscriptionPlanModel[] => {
  return entities.map(entity => toSubscriptionPlanModel(entity));
};

export const toSubscriptionPlanEntities = (models: SubscriptionPlanModel[]): SubscriptionPlan[] => {
  return models.map(model => toSubscriptionPlanEntity(model));
};
