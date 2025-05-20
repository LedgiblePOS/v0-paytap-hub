import React from 'react';
import { DateRangeType } from '@/types/monitoring';

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    transactions: number;
  }>;
  timeRange?: any; // Update with the proper type if needed
}

// Fix the mapping of date range properties
const formatDateRange = (dateRange: DateRangeType) => {
  // Use start/end properties instead of from/to
  const startDate = dateRange.start ? new Date(dateRange.start) : new Date();
  const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
  
  // Format the dates as needed
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

// Rest of component implementation
const RevenueChart: React.FC<RevenueChartProps> = ({ data, timeRange }) => {
  // Implementation details would go here
  // This is a placeholder for the actual chart implementation
  return (
    <div className="w-full h-64 bg-background border rounded-md p-4">
      <h3 className="text-lg font-medium mb-2">Revenue Overview</h3>
      {timeRange && (
        <div className="text-sm text-muted-foreground mb-4">
          {formatDateRange(timeRange)}
        </div>
      )}
      <div className="h-40 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-primary w-8" 
              style={{ 
                height: `${Math.max(5, (item.revenue / Math.max(...data.map(d => d.revenue))) * 100)}px` 
              }}
            />
            <span className="text-xs mt-1">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-lg font-medium">
            ${data.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-lg font-medium">
            {data.reduce((sum, item) => sum + item.transactions, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
