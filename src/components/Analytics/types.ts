
import { TimeRange } from "@/types/metrics";

export interface InventoryAnalyticsProps {
  inventoryData: any[];
  lowStockItems: any[];
  totalStockValue: number;
  stockTurnoverRate: number;
  timeRange?: TimeRange;
}

export interface SalesAnalyticsProps {
  salesData: Array<{
    date: string;
    amount: number;
  }>;
  compareData?: Array<{
    date: string;
    amount: number;
  }>;
  timeRange: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
}

export interface CustomerAnalyticsProps {
  newCustomers: number;
  activeCustomers: number;
  customerRetentionRate: number;
  averageSpend: number;
  customerTrend: number;
  timeRange?: TimeRange;
}

export interface PerformanceAnalyticsProps {
  metrics: Array<{
    name: string;
    value: number;
    target: number;
    unit?: string;
    trend?: number;
  }>;
  timeRange?: TimeRange;
}
