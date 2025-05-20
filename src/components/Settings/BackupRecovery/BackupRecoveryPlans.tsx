import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon, DatabaseIcon, HistoryIcon } from "lucide-react";
import { MetricCardProps } from "@/types/metrics";
import { Trend } from '@/types/enums';

const BackupRecoveryPlans: React.FC = () => {
  const backupMetrics = [
    {
      title: "Last Backup",
      value: "2 hours ago",
      description: "5/14/2023, 10:30 AM",
      icon: <ClockIcon className="h-4 w-4" />,
      trend: Trend.NEUTRAL  // Add missing trend property
    },
    {
      title: "Backup Size",
      value: "1.2 GB",
      description: "Total backup size",
      icon: <DatabaseIcon className="h-4 w-4" />,
      trend: Trend.NEUTRAL  // Add missing trend property
    },
    {
      title: "Recovery Point",
      value: "4 hours",
      description: "Maximum data loss window",
      icon: <HistoryIcon className="h-4 w-4" />,
      trend: Trend.NEUTRAL  // Add missing trend property
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Recovery</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {backupMetrics.map((metric, index) => (
          <div key={index}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon && <div className="h-4 w-4 text-muted-foreground">{metric.icon}</div>}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BackupRecoveryPlans;
