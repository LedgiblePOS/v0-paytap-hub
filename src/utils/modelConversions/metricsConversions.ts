
import { SystemMetricEntity, MerchantAnalyticEntity } from '@/types/entities';

// Define model types if not already defined elsewhere
export interface SystemMetricModel {
  id: string;
  metricName: string;
  metricType: string;
  metricValue: number;
  metricDate: string;
  category?: string;
  notes?: string;
  trend?: string;
  percentageChange?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantAnalyticModel {
  id: string;
  merchantId?: string;
  metricType: string;
  metricValue: number;
  period: string;
  createdAt: string;
  updatedAt: string;
}

// Conversion functions for SystemMetric
export function toSystemMetricModel(entity: SystemMetricEntity | any): SystemMetricModel {
  if (!entity) return null as any;

  return {
    id: entity.id,
    metricName: entity.metric_name,
    metricType: entity.metric_type,
    metricValue: Number(entity.metric_value),
    metricDate: entity.metric_date,
    category: entity.category,
    notes: entity.notes,
    trend: entity.trend,
    percentageChange: entity.percentage_change ? Number(entity.percentage_change) : undefined,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  };
}

export function toSystemMetricEntity(model: SystemMetricModel): SystemMetricEntity {
  return {
    id: model.id,
    metric_name: model.metricName,
    metric_type: model.metricType,
    metric_value: model.metricValue,
    metric_date: model.metricDate,
    category: model.category,
    notes: model.notes,
    trend: model.trend,
    percentage_change: model.percentageChange,
    created_at: model.createdAt,
    updated_at: model.updatedAt
  };
}

// Conversion functions for MerchantAnalytic
export function toMerchantAnalyticModel(entity: MerchantAnalyticEntity | any): MerchantAnalyticModel {
  if (!entity) return null as any;

  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    metricType: entity.metric_type,
    metricValue: Number(entity.metric_value),
    period: entity.period,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  };
}

export function toMerchantAnalyticEntity(model: MerchantAnalyticModel): MerchantAnalyticEntity {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    metric_type: model.metricType,
    metric_value: model.metricValue,
    period: model.period,
    created_at: model.createdAt,
    updated_at: model.updatedAt
  };
}

// Batch conversion functions
export function toSystemMetricModels(entities: SystemMetricEntity[] | any[]): SystemMetricModel[] {
  if (!entities || !Array.isArray(entities)) return [];
  return entities.map(toSystemMetricModel);
}

export function toMerchantAnalyticModels(entities: MerchantAnalyticEntity[] | any[]): MerchantAnalyticModel[] {
  if (!entities || !Array.isArray(entities)) return [];
  return entities.map(toMerchantAnalyticModel);
}
