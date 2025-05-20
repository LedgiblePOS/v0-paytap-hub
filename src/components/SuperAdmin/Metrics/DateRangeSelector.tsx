
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export type TimeRange = "7d" | "30d" | "90d" | "custom";

interface DateRangeSelectorProps {
  timeRange: TimeRange;
  dateRange: DateRange | undefined;
  onTimeRangeChange: (range: TimeRange) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
}) => {
  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "Pick a date range";
    }

    if (dateRange.to) {
      return `${format(dateRange.from, "LLL dd, y")} - ${format(
        dateRange.to,
        "LLL dd, y"
      )}`;
    }

    return format(dateRange.from, "LLL dd, y");
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={timeRange} onValueChange={onTimeRangeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {timeRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[250px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateRangeSelector;
