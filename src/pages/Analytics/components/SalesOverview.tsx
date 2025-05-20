
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from 'lucide-react';

export interface SalesMetrics {
  totalSales: number;
  averageOrderValue: number;
  growthRate: number;
  period: string;
}

export interface SalesOverviewProps {
  metrics: SalesMetrics;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ metrics }) => {
  const { totalSales, averageOrderValue, growthRate, period } = metrics;
  const isPositiveGrowth = growthRate >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Total Sales</span>
                <span className="text-2xl font-bold">${totalSales.toLocaleString()}</span>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">For {period}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Average Order</span>
                <span className="text-2xl font-bold">${averageOrderValue.toLocaleString()}</span>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">For {period}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Growth Rate</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{Math.abs(growthRate)}%</span>
                  {isPositiveGrowth ? (
                    <ArrowUpRight className="h-5 w-5 text-green-600 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5 text-red-600 ml-1" />
                  )}
                </div>
              </div>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                isPositiveGrowth ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {isPositiveGrowth ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Compared to previous {period}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesOverview;
