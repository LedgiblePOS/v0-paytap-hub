
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface ProductData {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface ProductPerformanceProps {
  data: ProductData[];
}

const ProductPerformance: React.FC<ProductPerformanceProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                tick={{ fontSize: 12 }} 
                height={70} 
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value}` : value,
                  name === 'revenue' ? 'Revenue' : 'Units Sold'
                ]} 
              />
              <Bar dataKey="revenue" fill="#0077cc" name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Top 5 Products</h4>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.slice(0, 5).map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{product.totalSold}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPerformance;
