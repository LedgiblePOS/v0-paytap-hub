
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  data?: Array<any>;
  dataKey?: string;
  chartType?: 'line' | 'area';
  chartColor?: string;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const ResponsiveAnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  trend,
  data = [],
  dataKey = 'value',
  chartType = 'line',
  chartColor = '#10B981',
  className = '',
  icon,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className={`${className} animate-pulse`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            {icon && <div className="h-6 w-6 bg-gray-200 rounded"></div>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-7 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-[60px] bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={trend.isPositive ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
            </span>
            {' from previous period'}
          </p>
        )}
        
        {data.length > 0 && (
          <div className="mt-4 h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart 
                  data={data} 
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Line 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={chartColor} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              ) : (
                <AreaChart 
                  data={data} 
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`color-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={chartColor} 
                    fillOpacity={1} 
                    fill={`url(#color-${title.replace(/\s+/g, '-')})`}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsiveAnalyticsCard;
