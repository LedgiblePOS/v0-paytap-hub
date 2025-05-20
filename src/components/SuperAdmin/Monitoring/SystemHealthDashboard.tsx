import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import MetricsOverview from './components/MetricsOverview';
import { useSystemMetrics } from './hooks/useSystemMetrics';
import { SystemMetric } from '@/types/metrics';
import { Trend } from '@/types/enums';

const SystemHealthDashboard: React.FC = () => {
  const { metrics, loading, error } = useSystemMetrics();
  
  // Convert metrics to ensure they match the expected format for MetricsOverview
  const formattedMetrics: SystemMetric[] = metrics ? metrics.map(metric => ({
    id: metric.id,
    metricName: metric.metricName,
    metricValue: metric.metricValue,
    metricType: metric.metricType === 'percentage' ? '%' : '#',
    metricDate: metric.metricDate,
    percentageChange: metric.percentageChange || 0,
    trend: (metric.trend as Trend) || Trend.NEUTRAL,
    category: metric.category || 'general',
    createdAt: metric.createdAt,
    updatedAt: metric.updatedAt
  })) : [];
  
  const getStatusFromMetric = (metric: SystemMetric): "normal" | "warning" | "critical" => {
    if (metric.percentageChange > 100) return "critical";
    if (metric.percentageChange > 50) return "warning";
    return "normal";
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Health</h2>
      
      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
      
      {loading ? (
        <p>Loading system metrics...</p>
      ) : (
        <MetricsOverview 
          metrics={formattedMetrics}
          loading={loading}
        />
      )}
    </div>
  );
};

export default SystemHealthDashboard;
