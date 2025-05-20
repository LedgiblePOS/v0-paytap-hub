
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/SuperAdmin/Metrics/DashboardHeader";
import DashboardCards from "@/components/SuperAdmin/Metrics/DashboardCards";
import DashboardCharts from "@/components/SuperAdmin/Metrics/DashboardCharts";
import PlatformAnalyticsCard from "@/components/SuperAdmin/Metrics/PlatformAnalyticsCard";
import { DateRange } from "react-day-picker";
import { TimeRange } from "@/components/SuperAdmin/Metrics/DateRangeSelector";

const SuperAdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const getTimeRangeLabel = () => {
    if (timeRange === "7d") {
      return "Last 7 days";
    }
    
    if (timeRange === "30d") {
      return "Last 30 days";
    }
    
    if (timeRange === "90d") {
      return "Last 90 days";
    }
    
    return "Custom date range";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader
        timeRange={timeRange}
        dateRange={dateRange}
        onTimeRangeChange={setTimeRange}
        onDateRangeChange={setDateRange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Overview for {getTimeRangeLabel()}</CardTitle>
          <CardDescription>
            Key metrics for platform performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardCards timeRange={timeRange} />
        </CardContent>
      </Card>
      
      <DashboardCharts timeRange={timeRange} />
      
      <PlatformAnalyticsCard />
    </div>
  );
};

export default SuperAdminDashboard;
