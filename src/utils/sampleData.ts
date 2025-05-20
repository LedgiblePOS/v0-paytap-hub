
import { SystemMetric } from '@/types/metrics';
import { addDays, subDays, format } from 'date-fns';

export const generateSampleMetrics = (days: number = 30): SystemMetric[] => {
  const metrics: SystemMetric[] = [];
  const today = new Date();
  
  const metricTypes = ['user_activity', 'api_usage', 'error_rate', 'performance'];
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    
    metricTypes.forEach(type => {
      // Generate random but realistic-looking data
      const baseValue = type === 'error_rate' ? 0.5 : 100;
      const randomFactor = 0.2; // 20% variation
      const value = baseValue + (Math.random() * 2 - 1) * baseValue * randomFactor;
      
      // Calculate trend based on previous day
      const prevValue = metrics.find(m => 
        m.metric_type === type && 
        m.metric_date === format(addDays(date, -1), 'yyyy-MM-dd')
      )?.metric_value ?? value;
      
      const percentageChange = ((value - prevValue) / prevValue) * 100;
      const trend = percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral';
      
      metrics.push({
        id: `${type}-${format(date, 'yyyy-MM-dd')}`,
        metric_date: format(date, 'yyyy-MM-dd'),
        metric_type: type,
        metric_name: type.replace('_', ' ').toUpperCase(),
        metric_value: Number(value.toFixed(2)),
        trend,
        percentage_change: Number(percentageChange.toFixed(1)),
        notes: `Sample ${type} metric`,
        created_at: date.toISOString(),
        updated_at: date.toISOString()
      });
    });
  }
  
  return metrics;
};
