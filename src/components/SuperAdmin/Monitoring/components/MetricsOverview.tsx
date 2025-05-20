
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MetricsOverviewProps } from '@/types/metrics';
import { Trend } from '@/types/enums';
import MetricCard from './MetricCard';
import { 
  BarChart, 
  Users, 
  ShoppingBag, 
  CreditCard,
  Activity,
  TrendingUp
} from 'lucide-react';

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ 
  systemMetrics,
  metrics,
  isLoading = false,
  loading = false
}) => {
  const actualMetrics = systemMetrics || metrics;
  const actualLoading = isLoading || loading;
  
  const metricsData = useMemo(() => {
    if (!actualMetrics || actualLoading) {
      return [];
    }
    
    // Map metrics to standardized format for MetricCard
    return actualMetrics.map(metric => {
      // Use consistently camelCase properties
      const metricName = metric.name || metric.metricName;
      const metricValue = metric.value || metric.metricValue;
      const percentageChange = metric.percentageChange;
      
      // Ensure trend is properly typed
      let trend: Trend = Trend.NEUTRAL;
      if (typeof metric.trend === 'string') {
        trend = metric.trend.toLowerCase() === 'up' ? Trend.UP 
              : metric.trend.toLowerCase() === 'down' ? Trend.DOWN 
              : metric.trend.toLowerCase() === 'stable' ? Trend.STABLE
              : Trend.NEUTRAL;
      } else if (metric.trend) {
        trend = metric.trend;
      }
      
      // Define icon based on metric type
      let icon;
      const metricType = metric.metricType || metric.type;
                        
      switch (metricType?.toLowerCase()) {
        case 'users':
          icon = <Users className="h-8 w-8 text-primary" />;
          break;
        case 'transactions':
          icon = <CreditCard className="h-8 w-8 text-primary" />;
          break;
        case 'products':
          icon = <ShoppingBag className="h-8 w-8 text-primary" />;
          break;
        case 'activity':
          icon = <Activity className="h-8 w-8 text-primary" />;
          break;
        default:
          icon = <TrendingUp className="h-8 w-8 text-primary" />;
      }
      
      return {
        title: metricName || 'Unknown Metric',
        value: metricValue,
        trend,
        trendValue: percentageChange !== null ? Number(percentageChange) : undefined,
        icon,
        // Add additional details
        description: `${metricType || ''} metric`
      };
    });
  }, [actualMetrics, actualLoading]);

  if (actualLoading) {
    return <div>Loading metrics...</div>;
  }

  if (!actualMetrics || actualMetrics.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No metrics available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="metrics-overview">
      {metricsData.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          trend={metric.trend}
          trendValue={metric.trendValue}
          icon={metric.icon}
          description={metric.description}
        />
      ))}
    </div>
  );
};

export default MetricsOverview;
