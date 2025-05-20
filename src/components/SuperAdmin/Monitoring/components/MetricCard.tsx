
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MetricCardProps } from '@/types/metrics';

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendValue,
  percentageChange,
  icon,
  description,
  className = '',
  loading = false
}) => {
  // Use either trendValue or percentageChange for backward compatibility
  const displayTrendValue = trendValue !== undefined ? trendValue : percentageChange;
  
  // Format the value if it's a number
  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{formattedValue}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && displayTrendValue !== undefined && (
              <div className={`flex items-center mt-1 text-xs ${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                <span className="ml-1">
                  {typeof displayTrendValue === 'number' ? displayTrendValue.toFixed(2) : displayTrendValue}
                </span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
