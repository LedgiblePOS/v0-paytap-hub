
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingDown, TrendingUp } from 'lucide-react';

export interface Metric {
  name: string;
  value: number;
  target: number;
  unit?: string;
  trend?: number;
}

export interface PerformanceMetricsProps {
  metrics: Metric[];
  isLoading?: boolean;
  title?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  metrics,
  isLoading = false,
  title = "Performance Metrics"
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {metrics.map((metric, index) => {
            const percentComplete = (metric.value / metric.target) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{metric.name}</p>
                    <div className="text-2xl font-bold">
                      {metric.unit && metric.unit.startsWith('$') ? metric.unit : ''}
                      {metric.value.toLocaleString()}
                      {metric.unit && !metric.unit.startsWith('$') ? metric.unit : ''}
                    </div>
                  </div>
                  {metric.trend !== undefined && (
                    <div className={`flex items-center ${metric.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend >= 0 ? 
                        <TrendingUp className="h-4 w-4 mr-1" /> : 
                        <TrendingDown className="h-4 w-4 mr-1" />
                      }
                      <span>{Math.abs(metric.trend).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={percentComplete > 100 ? 100 : percentComplete} 
                    className="h-2" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>Progress</div>
                    <div>
                      Target: {metric.unit || ''}{metric.target.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
