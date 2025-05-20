
import React from 'react';
import AnalyticsSummary from './AnalyticsSummary';
import SalesChart from './SalesChart';
import PerformanceMetrics from './PerformanceMetrics';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardAnalyticsProps {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  period = 'weekly'
}) => {
  const analytics = useDashboardAnalytics();
  
  if (analytics.error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Error Loading Analytics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {analytics.error}. Please try refreshing the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="dashboard-analytics">
      <h2 className="text-2xl font-semibold tracking-tight">Analytics {period && `(${period})`}</h2>
      
      <AnalyticsSummary
        totalRevenue={analytics.totalRevenue}
        orderCount={analytics.orderCount}
        averageOrderValue={analytics.averageOrderValue}
        customerCount={analytics.customerCount}
        revenueTrend={analytics.revenueTrend}
        orderTrend={analytics.orderTrend}
        aovTrend={analytics.aovTrend}
        customerTrend={analytics.customerTrend}
        isLoading={analytics.isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SalesChart 
            data={analytics.salesData}
            title="Sales Overview" 
            isLoading={analytics.isLoading}
          />
        </div>
        <div>
          <PerformanceMetrics 
            metrics={analytics.performanceMetrics}
            isLoading={analytics.isLoading}
          />
        </div>
      </div>
      
      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Sales Performance</h3>
            <Button variant="outline" size="sm">Export Data</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Best Selling Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Afternoon</div>
                <p className="text-xs text-muted-foreground mt-1">
                  2-5pm generates 38% of daily revenue
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Sale Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.aovTrend > 0 ? '+' : ''}{analytics.aovTrend.toFixed(1)}% from last period
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products" className="space-y-4 pt-4">
          <p className="text-muted-foreground">
            Product performance analytics will be implemented in the next phase.
          </p>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4 pt-4">
          <p className="text-muted-foreground">
            Customer analytics will be implemented in the next phase.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalytics;
