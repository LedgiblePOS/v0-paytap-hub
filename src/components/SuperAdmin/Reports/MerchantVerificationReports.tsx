
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MerchantVerificationReports: React.FC = () => {
  const [period, setPeriod] = useState('all');

  const { data: verificationStats, isLoading } = useQuery({
    queryKey: ['verificationReports', period],
    queryFn: async () => {
      // Get verification status distribution
      const { data: verifications, error } = await supabase
        .from('merchant_verifications')
        .select(`
          id,
          status,
          verification_type,
          created_at,
          verified_at
        `);
      
      if (error) throw error;
      
      // Calculate status distribution
      const statusCounts: Record<string, number> = {};
      verifications.forEach((v) => {
        const status = v.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      const statusData = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value
      }));
      
      // Calculate verification types
      const typeCounts: Record<string, number> = {};
      verifications.forEach((v) => {
        const type = v.verification_type || 'unknown';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      
      const typeData = Object.entries(typeCounts).map(([name, value]) => ({
        name,
        value
      }));
      
      // Calculate processing times
      const processingTimes: number[] = [];
      verifications.forEach((v) => {
        if (v.verified_at && v.created_at) {
          const created = new Date(v.created_at);
          const verified = new Date(v.verified_at);
          const diffDays = (verified.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          processingTimes.push(diffDays);
        }
      });
      
      const averageProcessingTime = processingTimes.length > 0
        ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
        : 0;
      
      return {
        statusData,
        typeData,
        totalVerifications: verifications.length,
        pendingVerifications: statusCounts['pending'] || 0,
        approvedVerifications: statusCounts['approved'] || 0,
        rejectedVerifications: statusCounts['rejected'] || 0,
        averageProcessingTime
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
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="self-end">
              <Button>Generate Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Verifications</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold">{verificationStats?.totalVerifications || 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Pending</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold">{verificationStats?.pendingVerifications || 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Approved</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold text-green-600">{verificationStats?.approvedVerifications || 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rejected</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mt-2" />
              ) : (
                <p className="text-3xl font-bold text-red-600">{verificationStats?.rejectedVerifications || 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4 text-center">Verification Status Distribution</h3>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationStats?.statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {verificationStats?.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4 text-center">Verification Types</h3>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verificationStats?.typeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {verificationStats?.typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Processing Time */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4 text-center">Verification Processing</h3>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">Average Processing Time</p>
            {isLoading ? (
              <Skeleton className="h-12 w-24 mx-auto mt-2" />
            ) : (
              <p className="text-4xl font-bold">
                {verificationStats?.averageProcessingTime.toFixed(1) || "0"} days
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantVerificationReports;
