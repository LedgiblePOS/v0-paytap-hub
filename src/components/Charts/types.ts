
import React from 'react';
import { TimeRange } from '@/types/metrics';

export interface ChartConfig {
  label: string;
  theme: {
    light: string;
    dark: string;
  };
}

export interface ChartContainerProps {
  children: React.ReactNode;
  config?: {
    [key: string]: ChartConfig;
  };
  className?: string;
  height?: number | string;
}

export interface LineChartProps {
  data: any[];
  keys: string[];
  indexKey: string;
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  timeRange?: TimeRange;
  tooltipFormatter?: (value: number, name: string) => [string, string];
}

export interface BarChartProps {
  data: any[];
  keys: string[];
  indexKey: string;
  height?: number;
  colors?: string[];
  stacked?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  timeRange?: TimeRange;
  tooltipFormatter?: (value: number, name: string) => [string, string];
}

export interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  height?: number;
  colors?: string[];
  showLegend?: boolean;
}
