
import { Trend } from './enums';

export interface SystemMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_type: string;
  percentage_change: number;
  trend: Trend;
  category: string;
  metric_date: string;
  created_at: string;
  updated_at: string;
  metric_unit?: string;
  metric_threshold?: number;
  
  // UI friendly fields
  metricName?: string;
  metricValue?: number;
  metricType?: string;
  percentageChange?: number;
}

export interface DateRangeType {
  start: Date;
  end: Date;
  from?: Date;
  to?: Date;
}

// Add TimeRange type for consistency across files
export type TimeRange = 'day' | 'week' | 'month' | 'year' | 'custom';
