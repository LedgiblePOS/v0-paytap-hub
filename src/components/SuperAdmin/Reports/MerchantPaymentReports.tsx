
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns/paymentReportColumns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const MerchantPaymentReports: React.FC = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data: paymentStats, isLoading } = useQuery({
    queryKey: ['paymentReports', timeframe, startDate, endDate],
    queryFn: async () => {
      const start = startDate?.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const end = endDate?.toISOString() || new Date().toISOString();
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount, 
          payment_method,
          status,
          created_at,
          merchants (
            business_name,
            subscription_tier
          )
        `)
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data for table view
      const tableData = data.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        paymentMethod: tx.payment_method,
        status: tx.status,
        createdAt: tx.created_at,
        merchantName: tx.merchants?.business_name || 'Unknown',
        subscriptionTier: tx.merchants?.subscription_tier || 'N/A'
      }));
      
      // Prepare chart data
      const paymentMethodData = data.reduce((acc: Record<string, number>, tx) => {
        const method = tx.payment_method;
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {});
      
      const chartData = Object.entries(paymentMethodData).map(([method, count]) => ({
        name: method,
        count
      }));
      
      return {
        tableData,
        chartData
      };
    }
  });
  
  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <p className="text-sm font-medium mb-2">Time Period</p>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {timeframe === 'custom' && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Start Date</p>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">End Date</p>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </>
            )}
            
            <div className="self-end">
              <Button>Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Payment Method Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={paymentStats?.chartData || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Transaction Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Payment Transactions</h3>
          {paymentStats?.tableData && (
            <DataTable columns={columns} data={paymentStats.tableData} />
          )}
          {isLoading && (
            <div className="flex justify-center p-8">
              Loading payment data...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantPaymentReports;
