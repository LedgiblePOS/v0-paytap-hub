
import { useState, useEffect } from 'react';
import { SystemMetric } from '@/types/metrics';
import { Trend } from '@/types/enums';
import { supabase } from '@/lib/supabase';

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Fixed groupMetricsByType to use reduce correctly
  const groupMetricsByType = (metrics: SystemMetric[]) => {
    return metrics.reduce((acc: Record<string, Array<SystemMetric>>, metric) => {
      // Safely access properties with type checking
      const type = metric.metricType || 'unknown';
      
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(metric);
      return acc;
    }, {});
  };

  // Fix setMetrics call to properly convert the data
  const convertToSystemMetrics = (data: any[]): SystemMetric[] => {
    return data.map(item => {
      // Convert string trend to enum Trend
      let trendValue: Trend;
      if (typeof item.trend === 'string') {
        switch(item.trend.toUpperCase()) {
          case 'UP':
            trendValue = Trend.UP;
            break;
          case 'DOWN':
            trendValue = Trend.DOWN;
            break;
          case 'STABLE':
            trendValue = Trend.STABLE;
            break;
          default:
            trendValue = Trend.NEUTRAL;
        }
      } else {
        trendValue = item.trend || Trend.NEUTRAL;
      }

      return {
        id: item.id,
        metricName: item.metric_name || '',
        metricType: item.metric_type || '',
        metricValue: Number(item.metric_value || 0),
        metricDate: item.metric_date || '',
        percentageChange: Number(item.percentage_change || 0),
        trend: trendValue,
        category: item.category || '',
        createdAt: item.created_at || '',
        updatedAt: item.updated_at || '',
      };
    });
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('system_metrics')
        .select('*');

      if (error) {
        setError(error.message);
        console.error('Error fetching system metrics:', error);
        return;
      }
      
      if (data) {
        const convertedMetrics = convertToSystemMetrics(data);
        setMetrics(convertedMetrics);
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching system metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [timeframe]);

  return {
    metrics,
    loading,
    error,
    groupMetricsByType,
    refetch: fetchMetrics,
    timeframe,
    setTimeframe
  };
};

export default useSystemMetrics;
