
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export interface UserActivityData {
  day: string;
  active: number;
  new: number;
}

export interface UserActivityChartProps {
  data?: UserActivityData[];
  height?: number | string;
  title?: string;
}

// Mock data
const defaultUserActivityData: UserActivityData[] = [
  { day: 'Mon', active: 120, new: 12 },
  { day: 'Tue', active: 132, new: 18 },
  { day: 'Wed', active: 145, new: 22 },
  { day: 'Thu', active: 140, new: 15 },
  { day: 'Fri', active: 150, new: 21 },
  { day: 'Sat', active: 135, new: 8 },
  { day: 'Sun', active: 110, new: 5 },
];

const UserActivityChart: React.FC<UserActivityChartProps> = ({ 
  data = defaultUserActivityData,
  height = "300px",
  title
}) => {
  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={0} barCategoryGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="active" fill="#3B82F6" name="Active Users" />
            <Bar dataKey="new" fill="#10B981" name="New Users" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserActivityChart;
