import { 
  SystemMetric, 
  SystemMetricEntity, 
  LocalSystemMetric,
  MetricStatus,
  Trend 
} from '@/types/metrics';

export const toSystemMetric = (entity: SystemMetricEntity): SystemMetric => {
  return {
    id: entity.id,
    metricName: entity.metric_name,
    metricType: entity.metric_type,
    metricValue: entity.metric_value,
    metricDate: entity.metric_date,
    percentageChange: entity.percentage_change,
    trend: entity.trend,
    category: entity.category,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
  };
};

export const toSystemMetrics = (entities: SystemMetricEntity[]): SystemMetric[] => {
  return entities.map(toSystemMetric);
};

export const toSystemMetricEntity = (model: SystemMetric): SystemMetricEntity => {
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
  };
};

export const toLocalSystemMetric = (metric: SystemMetric): LocalSystemMetric => {
  // Map status based on some business logic
  let status: "normal" | "warning" | "critical" = "normal";
  
  if (metric.percentageChange > 50) {
    status = "warning";
  } else if (metric.percentageChange > 100) {
    status = "critical";
  }
  
  return {
    id: metric.id,
    name: metric.metricName,
    value: metric.metricValue,
    unit: metric.metricType === 'percentage' ? '%' : '#',
    timestamp: metric.metricDate,
    status: status,
    createdAt: metric.createdAt,
    updatedAt: metric.updatedAt,
  };
};

export const toLocalSystemMetrics = (metrics: SystemMetric[]): LocalSystemMetric[] => {
  return metrics.map(toLocalSystemMetric);
};
