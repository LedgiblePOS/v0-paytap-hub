
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogModel } from '@/types';

interface Props {
  logs: AuditLogModel[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AuditLogActionsPieChart: React.FC<Props> = ({ logs }) => {
  const getActionsData = (logs: AuditLogModel[]) => {
    const actions: { [key: string]: number } = {};
    
    logs.forEach(log => {
      const action = log.action;
      actions[action] = (actions[action] || 0) + 1;
    });
    
    return Object.keys(actions).map(action => ({
      name: action,
      value: actions[action]
    }));
  };
  
  const data = getActionsData(logs);
  
  if (data.length === 0) {
    return <div className="text-center p-4">No actions data available.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              labelLine
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AuditLogActionsPieChart;
