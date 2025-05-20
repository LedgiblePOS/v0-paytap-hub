
import { SystemMetric, LocalSystemMetric } from '@/types/metrics';
import { Trend } from '@/types/enums';

export const toLocalSystemMetric = (entity: SystemMetric): LocalSystemMetric => {
  return {
    id: entity.id,
    metricName: entity.metric_name,
    metricType: entity.metric_type,
    metricValue: entity.metric_value,
    metricDate: entity.metric_date,
    percentageChange: entity.percentage_change,
    trend: entity.trend as Trend,
    category: entity.category,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    notes: entity.notes,
    // Add snake_case properties for backward compatibility
    metric_name: entity.metric_name,
    metric_type: entity.metric_type,
    metric_value: entity.metric_value,
    metric_date: entity.metric_date,
    percentage_change: entity.percentage_change
  };
};

export const toSystemMetric = (model: LocalSystemMetric): SystemMetric => {
  return {
    id: model.id,
    metric_name: model.metricName,
    metric_type: model.metricType,
    metric_value: model.metricValue,
    metric_date: model.metricDate,
    percentage_change: model.percentageChange,
    trend: model.trend,
    category: model.category,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    notes: model.notes
  };
};

export const toLocalSystemMetrics = (entities: SystemMetric[]): LocalSystemMetric[] => {
  return entities.map(toLocalSystemMetric);
};

export const toSystemMetrics = (models: LocalSystemMetric[]): SystemMetric[] => {
  return models.map(toSystemMetric);
};
