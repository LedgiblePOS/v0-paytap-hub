
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
}

const MetricCard: React.FC<MetricProps> = ({ 
  title, 
  value, 
  description, 
  trend, 
  trendValue 
}) => {
  // Convert value to string if it's a number and fixed to 2 decimal places
  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && trendValue && (
          <div className={`flex items-center mt-1 text-xs ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            <span className="ml-1">
              {typeof trendValue === 'number' ? trendValue.toFixed(2) : trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MonitoringDashboard: React.FC = () => {
  // Example metrics data
  const metrics: MetricProps[] = [
    {
      title: 'CPU Usage',
      value: 45.5,
      description: 'Average across all servers',
      trend: 'up',
      trendValue: 3.2
    },
    {
      title: 'Memory Usage',
      value: 68,
      description: 'Percentage used',
      trend: 'neutral',
      trendValue: 0.5
    },
    {
      title: 'API Latency',
      value: 124,
      description: 'Average response time (ms)',
      trend: 'down',
      trendValue: 12
    },
    {
      title: 'Error Rate',
      value: 0.05,
      description: 'Percentage of requests',
      trend: 'down',
      trendValue: 0.02
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">System Monitoring</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
