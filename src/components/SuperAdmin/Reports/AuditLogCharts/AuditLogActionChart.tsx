
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogModel } from '@/types/audit';

interface AuditLogActionChartProps {
  logs: AuditLogModel[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AuditLogActionChart: React.FC<AuditLogActionChartProps> = ({ logs }) => {
  // Group logs by action
  const actionCounts = logs.reduce((acc: Record<string, number>, log) => {
    const action = log.action || 'UNKNOWN';
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});
  
  // Convert to chart data
  const data = Object.entries(actionCounts).map(([action, count]) => ({
    name: action,
    value: count
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Actions Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} logs`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogActionChart;
