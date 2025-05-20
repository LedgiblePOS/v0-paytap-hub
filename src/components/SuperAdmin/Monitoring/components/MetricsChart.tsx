
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsChartProps } from '@/types/metrics';
import { Trend } from '@/types/enums';

const MetricsChart: React.FC<MetricsChartProps> = ({ data, timeRange }) => {
  // Process data according to timeRange if needed
  const chartData = React.useMemo(() => {
    // Here you would implement any data transformation based on timeRange
    return data;
  }, [data, timeRange]);
  
  // Determine trend
  const trend = React.useMemo(() => {
    if (!chartData || chartData.length < 2) return Trend.NEUTRAL;
    
    const firstValue = chartData[0]?.value || 0;
    const lastValue = chartData[chartData.length - 1]?.value || 0;
    
    if (lastValue > firstValue) return Trend.UP;
    if (lastValue < firstValue) return Trend.DOWN;
    return Trend.NEUTRAL;
  }, [chartData]);
  
  // Define color based on trend
  const lineColor = trend === Trend.UP ? '#10B981' : trend === Trend.DOWN ? '#EF4444' : '#6B7280';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Metrics Over {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
