
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SubscriptionTier } from '@/types/enums';

interface SubscriptionData {
  tier: string;
  count: number;
}

interface SubscriptionAnalyticsProps {
  subscriptionData: SubscriptionData[];
  loading?: boolean;
}

const SubscriptionAnalytics: React.FC<SubscriptionAnalyticsProps> = ({ subscriptionData, loading = false }) => {
  const getChartData = () => {
    if (!subscriptionData || subscriptionData.length === 0) {
      return [];
    }

    const tierMap = new Map<string, number>([
      [SubscriptionTier.STARTER, 0],
      [SubscriptionTier.PROFESSIONAL, 0],
      [SubscriptionTier.ENTERPRISE, 0],
    ]);
    
    subscriptionData.forEach(item => {
      if (tierMap.has(item.tier)) {
        tierMap.set(item.tier, item.count);
      }
    });
    
    return Array.from(tierMap.entries()).map(([name, value]) => ({
      name,
      value
    }));
  };

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Subscription Tiers Distribution</CardTitle>
        <CardDescription>
          Number of merchants on each subscription tier
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value: number) => [`${value} merchants`, 'Count']}
                labelFormatter={(label) => `${label} tier`}
              />
              <Legend />
              <Bar dataKey="value" name="Merchants" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionAnalytics;
