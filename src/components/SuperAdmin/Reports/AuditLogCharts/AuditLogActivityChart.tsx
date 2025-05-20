
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogModel } from '@/types';

interface Props {
  logs: AuditLogModel[];
}

const AuditLogActivityChart: React.FC<Props> = ({ logs }) => {
  const transformData = (logs: AuditLogModel[]) => {
    return logs.reduce((acc: any[], log) => {
      const date = format(new Date(log.createdAt), 'MMM dd');
      const existingDate = acc.find((item: any) => item.date === date);

      if (existingDate) {
        existingDate.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, []);
  };

  const data = transformData(logs);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AuditLogActivityChart;
