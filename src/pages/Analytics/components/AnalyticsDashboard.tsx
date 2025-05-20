
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SalesChart from './SalesChart';
import SalesOverview, { SalesMetrics } from './SalesOverview';
import CustomerInsights, { CustomerData } from './CustomerInsights';
import ProductPerformance, { ProductData } from './ProductPerformance';

export interface AnalyticsDashboardProps {
  salesData: { date: string; amount: number }[];
  customerData: CustomerData;
  productData: ProductData[];
  salesMetrics: SalesMetrics;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  salesData,
  customerData,
  productData,
  salesMetrics,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                View your business performance metrics and insights. Here you can track sales,
                customer behavior, and product performance.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Export Reports
              </button>
              <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-50">
                Set Sales Goals
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <SalesOverview metrics={salesMetrics} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerInsights data={customerData} />
        <ProductPerformance data={productData} />
      </div>
      
      <SalesChart data={salesData} title="Sales Over Time" />
    </div>
  );
};

export default AnalyticsDashboard;
