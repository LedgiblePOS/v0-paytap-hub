import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryData {
  category: string;
  count: number;
  value: number;
}

export interface InventoryAnalyticsProps {
  inventoryData: CategoryData[];
  lowStockItems: any[];
  totalStockValue: number;
  stockTurnoverRate: number;
}

const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({ 
  inventoryData, 
  lowStockItems, 
  totalStockValue, 
  stockTurnoverRate 
}) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Inventory Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold mb-2">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-2">Key Metrics</h3>
            <p>Total Stock Value: ${totalStockValue.toFixed(2)}</p>
            <p>Stock Turnover Rate: {stockTurnoverRate}</p>
            <p>Low Stock Items: {lowStockItems.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAnalytics;
