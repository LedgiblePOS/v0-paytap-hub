
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import DateRangeSelector, { TimeRange } from "./DateRangeSelector";
import { DateRange } from "react-day-picker";

interface DashboardHeaderProps {
  timeRange: TimeRange;
  dateRange: DateRange | undefined;
  onTimeRangeChange: (range: TimeRange) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
  onRefresh,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        <DateRangeSelector
          timeRange={timeRange}
          dateRange={dateRange}
          onTimeRangeChange={onTimeRangeChange}
          onDateRangeChange={onDateRangeChange}
        />
        
        <Button onClick={onRefresh} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
