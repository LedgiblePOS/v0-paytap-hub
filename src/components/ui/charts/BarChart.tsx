
import React from 'react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartData } from '@/types/charts';

interface BarChartProps {
  data: ChartData[];
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  tooltip?: boolean;
  grid?: boolean;
  legend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xAxisKey = 'name',
  yAxisKey = 'value',
  height = 300,
  tooltip = true,
  grid = true,
  legend = true
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip && <Tooltip />}
        {legend && <Legend />}
        <Bar dataKey={yAxisKey} fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
