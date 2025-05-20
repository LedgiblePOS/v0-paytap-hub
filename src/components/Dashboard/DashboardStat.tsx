
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trend } from "@/types/enums";

interface DashboardStatProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  trend?: Trend;
}

const DashboardStat: React.FC<DashboardStatProps> = ({
  title,
  value,
  icon,
  change,
  trend = Trend.NEUTRAL,
}) => {
  return (
    <Card>
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <p
              className={`text-xs font-medium mt-1 ${
                trend === Trend.UP
                  ? "text-green-600"
                  : trend === Trend.DOWN
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {change} from last week
            </p>
          )}
        </div>
        <div className="bg-ledgible-gray p-3 rounded-full">{icon}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardStat;
