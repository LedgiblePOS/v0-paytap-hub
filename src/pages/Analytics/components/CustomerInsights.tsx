
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export interface CustomerData {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  conversionRate: number;
}

export interface CustomerInsightsProps {
  data: CustomerData;
}

const CustomerInsights: React.FC<CustomerInsightsProps> = ({ data }) => {
  const { newCustomers, returningCustomers, totalCustomers, conversionRate } = data;
  
  const chartData = [
    { name: 'New Customers', value: newCustomers },
    { name: 'Returning Customers', value: returningCustomers },
  ];
  
  const COLORS = ['#0088FE', '#00C49F'];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Customers</div>
              <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">New Customers</div>
              <div className="text-2xl font-bold">{newCustomers.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((newCustomers / totalCustomers) * 100)}% of total
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Returning Customers</div>
              <div className="text-2xl font-bold">{returningCustomers.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((returningCustomers / totalCustomers) * 100)}% of total
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Conversion Rate</div>
              <div className="text-2xl font-bold">{conversionRate}%</div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Customers']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInsights;
