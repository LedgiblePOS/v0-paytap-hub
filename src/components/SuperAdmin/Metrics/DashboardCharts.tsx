
import React from "react";
import RevenueChart from "./RevenueChart";
import { TimeRange } from "@/types/enums";

interface DashboardChartsProps {
  timeRange: TimeRange | string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ timeRange }) => {
  // Mock data for revenue chart
  const mockRevenueData = [
    { date: '2023-01-01', revenue: 8000, transactions: 145 },
    { date: '2023-02-01', revenue: 12000, transactions: 168 },
    { date: '2023-03-01', revenue: 15000, transactions: 210 },
    { date: '2023-04-01', revenue: 18000, transactions: 232 },
    { date: '2023-05-01', revenue: 25000, transactions: 305 },
    { date: '2023-06-01', revenue: 32000, transactions: 356 },
    { date: '2023-07-01', revenue: 38000, transactions: 402 },
    { date: '2023-08-01', revenue: 45000, transactions: 458 },
    { date: '2023-09-01', revenue: 52000, transactions: 512 },
    { date: '2023-10-01', revenue: 56000, transactions: 545 },
    { date: '2023-11-01', revenue: 60000, transactions: 589 },
    { date: '2023-12-01', revenue: 65000, transactions: 620 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <RevenueChart timeRange={timeRange as TimeRange} data={mockRevenueData} />
    </div>
  );
};

export default DashboardCharts;
