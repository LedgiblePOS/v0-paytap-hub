
import React from 'react';
import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartData } from '@/types/charts';

interface AreaChartProps {
  data: ChartData[];
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  tooltip?: boolean;
  grid?: boolean;
  legend?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
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
      <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip && <Tooltip />}
        {legend && <Legend />}
        <Area type="monotone" dataKey={yAxisKey} fill="#8884d8" stroke="#8884d8" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};
