
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  percentChange: number;
  timeRange: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  percentChange, 
  timeRange 
}) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-4">
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
          <span className="text-green-500 font-medium">+{percentChange}%</span>
          <span className="ml-1">from {timeRange === "year" ? "last year" : "previous period"}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardCardsProps {
  timeRange: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ timeRange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        title="Total Merchants"
        value="36"
        percentChange={20}
        timeRange={timeRange}
      />
      <StatCard 
        title="Total Revenue"
        value="$145,200"
        percentChange={15}
        timeRange={timeRange}
      />
      <StatCard 
        title="Transactions"
        value="1,240"
        percentChange={32}
        timeRange={timeRange}
      />
    </div>
  );
};

export default DashboardCards;
