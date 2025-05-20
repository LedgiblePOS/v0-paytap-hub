
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogModel } from '@/types/audit';

interface AuditLogTimeseriesChartProps {
  logs: AuditLogModel[];
}

const AuditLogTimeseriesChart: React.FC<AuditLogTimeseriesChartProps> = ({ logs }) => {
  // Group logs by date and action
  const groupedByDate = logs.reduce((acc: Record<string, Record<string, number>>, log) => {
    const date = new Date(log.createdAt).toLocaleDateString();
    const action = log.action || 'UNKNOWN';
    
    if (!acc[date]) {
      acc[date] = {};
    }
    
    acc[date][action] = (acc[date][action] || 0) + 1;
    return acc;
  }, {});
  
  // Convert to chart data
  const data = Object.entries(groupedByDate).map(([date, actions]) => ({
    date,
    ...actions
  }));
  
  // Sort by date
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Get unique actions for lines
  const uniqueActions = Array.from(
    new Set(logs.map(log => log.action).filter(Boolean))
  ) as string[];

  // Colors for different actions
  const actionColors: Record<string, string> = {
    CREATE: '#4CAF50',
    UPDATE: '#2196F3',
    DELETE: '#F44336',
    READ: '#9C27B0',
    LOGIN: '#FF9800',
    LOGOUT: '#795548',
    REGISTER: '#00BCD4',
    DEFAULT: '#607D8B'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Audit Log Activity Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {uniqueActions.map((action) => (
                <Line
                  key={action}
                  type="monotone"
                  dataKey={action}
                  name={action}
                  stroke={actionColors[action] || actionColors.DEFAULT}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogTimeseriesChart;
