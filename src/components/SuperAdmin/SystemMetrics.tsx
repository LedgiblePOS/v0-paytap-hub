
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trend } from '@/types/enums';

// Fix the comparison by using proper type checking
const getTrendIcon = (trend: Trend) => {
  if (trend === Trend.UP) {
    return <span className="text-green-500">↑</span>;
  } else if (trend === Trend.DOWN) {
    return <span className="text-red-500">↓</span>;
  } else {
    return <span className="text-gray-500">→</span>;
  }
};

interface SystemMetricsProps {
  title: string;
  value: number;
  trend: Trend;
  previousValue: number;
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ title, value, trend, previousValue }) => {
  const percentageChange = previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = percentageChange > 0;

  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between space-x-4 p-4">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon(trend)}
          <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {percentageChange.toFixed(2)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemMetrics;
