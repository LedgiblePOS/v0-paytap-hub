import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/utils/formatters';

const MerchantActivityReports: React.FC = () => {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['merchantActivityReports'],
    queryFn: async () => {
      // Merchant growth over time
      const { data: merchants, error: merchantError } = await supabase
        .from('merchants')
        .select('id, created_at, subscription_tier')
        .order('created_at', { ascending: true });
        
      if (merchantError) throw merchantError;
      
      // Transaction volume over time
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('id, amount, created_at, merchant_id')
        .order('created_at', { ascending: true });
        
      if (txError) throw txError;
      
      // Process merchant growth data
      const merchantsByMonth: Record<string, number> = {};
      const merchantsBySubscription: Record<string, number> = {};
      
      merchants.forEach(merchant => {
        const date = new Date(merchant.created_at);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        merchantsByMonth[monthYear] = (merchantsByMonth[monthYear] || 0) + 1;
        
        const subscriptionTier = merchant.subscription_tier || 'Unknown';
        merchantsBySubscription[subscriptionTier] = (merchantsBySubscription[subscriptionTier] || 0) + 1;
      });
      
      // Process transaction data
      const transactionsByMonth: Record<string, number> = {};
      const volumeByMonth: Record<string, number> = {};
      
      transactions.forEach(tx => {
        const date = new Date(tx.created_at);
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        transactionsByMonth[monthYear] = (transactionsByMonth[monthYear] || 0) + 1;
        volumeByMonth[monthYear] = (volumeByMonth[monthYear] || 0) + (tx.amount || 0);
      });
      
      // Format growth data for charts
      const growthData = Object.entries(merchantsByMonth).map(([date, count]) => ({
        date,
        count,
        transactions: transactionsByMonth[date] || 0,
        volume: volumeByMonth[date] || 0
      })).sort((a, b) => a.date.localeCompare(b.date));
      
      // Calculate merchant activity metrics
      const averageTransactionsPerMerchant = transactions.length / merchants.length;
      
      // Format subscription data for charts
      const subscriptionData = Object.entries(merchantsBySubscription).map(([name, value]) => ({
        name,
        value
      }));
      
      return {
        growthData,
        subscriptionData,
        merchantCount: merchants.length,
        transactionCount: transactions.length,
        averageTransactionsPerMerchant
      };
    }
  });
  
  return (
    <div className="space-y-6">
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Merchants</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold">{activityData?.merchantCount || 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold">{formatNumber(activityData?.transactionCount || 0)}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Avg. Transactions per Merchant</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold">{activityData?.averageTransactionsPerMerchant.toFixed(1) || "0"}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Growth Chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4 text-center">Merchant Growth Over Time</h3>
          <div className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData?.growthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="count" stackId="1" stroke="#8884d8" fill="#8884d8" name="Merchants" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Volume */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4 text-center">Monthly Transaction Activity</h3>
          <div className="h-[300px]">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData?.growthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="#82ca9d" 
                    name="Transaction Count"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#ff7300" 
                    name="Transaction Volume ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantActivityReports;
