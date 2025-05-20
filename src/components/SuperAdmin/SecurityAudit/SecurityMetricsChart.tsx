
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface SecurityMetricData {
  name: string;
  issues: number;
  resolved: number;
}

export interface SecurityMetricsChartProps {
  data: SecurityMetricData[];
  title?: string;
  height?: number;
}

const SecurityMetricsChart: React.FC<SecurityMetricsChartProps> = ({ 
  data,
  title = "Monthly Security Issues",
  height = 300
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="issues" name="Issues Detected" fill="#ff6b6b" />
              <Bar dataKey="resolved" name="Issues Resolved" fill="#4ecdc4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMetricsChart;
