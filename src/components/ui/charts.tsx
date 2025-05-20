
import React from 'react';
import { 
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define a set of colors for charts
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

interface ChartData {
  name: string;
  [key: string]: any;
}

interface LineChartProps {
  data: ChartData[];
  height?: number;
  xAxis: string;
  yAxis: string;
  dataKey?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  xAxis,
  yAxis,
  dataKey
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey || yAxis} 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

interface BarChartProps {
  data: ChartData[];
  height?: number;
  xAxis: string;
  yAxis: string;
  dataKey?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 300, 
  xAxis,
  yAxis,
  dataKey
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey || yAxis} fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface PieChartProps {
  data: any[];
  height?: number;
  nameKey: string;
  dataKey: string;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  height = 300, 
  nameKey,
  dataKey
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// Additional chart components can be added here
