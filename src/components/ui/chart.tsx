
import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Line Chart
interface LineChartProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
}

export const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <ReactChart type="line" data={data} options={options || defaultOptions} />;
};

// Bar Chart
interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
}

export const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <ReactChart type="bar" data={data} options={options || defaultOptions} />;
};

// Pie Chart
interface PieChartProps {
  data: ChartData<'pie'>;
  options?: ChartOptions<'pie'>;
}

export const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <ReactChart type="pie" data={data} options={options || defaultOptions} />;
};

// Doughnut Chart
interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, options }) => {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <ReactChart type="doughnut" data={data} options={options || defaultOptions} />;
};

// Chart Container and Tooltip Components
interface ChartConfig {
  [key: string]: {
    label: string;
    theme: {
      light: string;
      dark: string;
    };
  };
}

interface ChartContainerProps {
  children: React.ReactNode;
  config: ChartConfig;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ children, config }) => {
  return (
    <div className="w-full h-full" data-chart-config={JSON.stringify(config)}>
      {children}
    </div>
  );
};

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  nameKey?: string;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ 
  active, 
  payload, 
  label, 
  nameKey = 'dataKey'
}) => {
  if (active && payload && payload.length) {
    const chartConfig = payload[0].payload.chartConfig || {};
    
    return (
      <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
        {label && <p className="text-sm font-medium">{label}</p>}
        <div className="space-y-1 mt-1">
          {payload.map((entry, index) => {
            const config = chartConfig[entry.dataKey] || {};
            const name = config.label || entry.name || entry.dataKey;
            
            return (
              <div key={`tooltip-item-${index}`} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }} />
                <span className="font-medium mr-1">{nameKey === 'dataKey' ? name : entry[nameKey]}:</span>
                <span className="text-muted-foreground">{entry.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// Export a convenient component for usage in other files
export { ReactChart as Chart };
