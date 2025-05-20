
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, ShoppingCart } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon }) => {
  const isTrendPositive = trend && trend > 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/20 p-1.5 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center text-xs mt-1">
            {isTrendPositive ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={isTrendPositive ? "text-green-500" : "text-red-500"}>
              {Math.abs(trend).toFixed(1)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AnalyticsSummaryProps {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  customerCount: number;
  revenueTrend?: number;
  orderTrend?: number;
  aovTrend?: number;
  customerTrend?: number;
  currency?: string;
  isLoading?: boolean;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({
  totalRevenue,
  orderCount,
  averageOrderValue,
  customerCount,
  revenueTrend = 0,
  orderTrend = 0,
  aovTrend = 0,
  customerTrend = 0,
  currency = '$',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="analytics-summary">
      <MetricCard 
        title="Total Revenue" 
        value={`${currency}${totalRevenue.toLocaleString()}`} 
        trend={revenueTrend}
        icon={<TrendingUp className="h-4 w-4" />} 
      />
      <MetricCard 
        title="Total Orders" 
        value={orderCount.toLocaleString()} 
        trend={orderTrend}
        icon={<ShoppingCart className="h-4 w-4" />} 
      />
      <MetricCard 
        title="Avg. Order Value" 
        value={`${currency}${averageOrderValue.toLocaleString()}`} 
        trend={aovTrend}
        icon={<ShoppingCart className="h-4 w-4" />} 
      />
      <MetricCard 
        title="Total Customers" 
        value={customerCount.toLocaleString()} 
        trend={customerTrend}
        icon={<Users className="h-4 w-4" />} 
      />
    </div>
  );
};

export default AnalyticsSummary;
