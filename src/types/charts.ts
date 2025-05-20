
export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
}

export interface MetricChartData extends ChartData {
  metric_date: string;
  metric_value: number;
  trend?: 'up' | 'down' | 'neutral';
  percentage_change?: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}
