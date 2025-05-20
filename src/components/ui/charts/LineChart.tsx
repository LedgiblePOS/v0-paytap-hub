
import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartData } from '@/types/charts';

interface LineChartProps {
  data: ChartData[];
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  tooltip?: boolean;
  grid?: boolean;
  legend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
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
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip && <Tooltip />}
        {legend && <Legend />}
        <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" activeDot={{ r: 8 }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
