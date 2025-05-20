
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { RefreshCw, Activity, AlertTriangle, Clock, Cpu } from 'lucide-react';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { Trend } from '@/types/enums';

const SystemMetricsCard: React.FC<{
  title: string;
  value: string | number;
  trend?: Trend;
  change?: string | number;
  icon: React.ReactNode;
}> = ({ title, value, trend, change, icon }) => {
  const trendColor = trend === Trend.UP ? 'text-red-500' : 'text-green-500';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${trendColor} flex items-center`}>
            {trend === Trend.UP ? '↑' : '↓'} {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const MonitoringDashboard: React.FC = () => {
  const { 
    userActivityMetrics,
    apiUsageMetrics,
    errorRateMetrics,
    performanceMetrics,
    isLoading,
    error
  } = useSystemMetrics();
  
  const [timeFrame, setTimeFrame] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  
  const latestUserActivity = userActivityMetrics?.[0];
  const latestApiUsage = apiUsageMetrics?.[0];
  const latestErrorRate = errorRateMetrics?.[0];
  const latestPerformance = performanceMetrics?.[0];
  
  return (
    <MainLayoutContent>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time system health and performance monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex space-x-2">
            <Button 
              variant={timeFrame === '1h' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeFrame('1h')}
            >
              1h
            </Button>
            <Button 
              variant={timeFrame === '24h' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeFrame('24h')}
            >
              24h
            </Button>
            <Button 
              variant={timeFrame === '7d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeFrame('7d')}
            >
              7d
            </Button>
            <Button 
              variant={timeFrame === '30d' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeFrame('30d')}
            >
              30d
            </Button>
          </div>
          
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <SystemMetricsCard 
          title="Active Users"
          value={isLoading ? "-" : latestUserActivity?.metricValue || 0}
          trend={latestUserActivity?.trend}
          change={`${latestUserActivity?.percentageChange || 0}% from last period`}
          icon={<Activity className="h-4 w-4" />}
        />
        
        <SystemMetricsCard 
          title="API Requests"
          value={isLoading ? "-" : latestApiUsage?.metricValue || 0}
          trend={latestApiUsage?.trend}
          change={`${latestApiUsage?.percentageChange || 0}% from last period`}
          icon={<Clock className="h-4 w-4" />}
        />
        
        <SystemMetricsCard 
          title="Error Rate"
          value={isLoading ? "-" : `${latestErrorRate?.metricValue || 0}%`}
          trend={latestErrorRate?.trend}
          change={`${latestErrorRate?.percentageChange || 0}% from last period`}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        
        <SystemMetricsCard 
          title="Response Time"
          value={isLoading ? "-" : `${latestPerformance?.metricValue || 0}ms`}
          trend={latestPerformance?.trend}
          change={`${latestPerformance?.percentageChange || 0}% from last period`}
          icon={<Cpu className="h-4 w-4" />}
        />
      </div>
      
      {/* Tabs for detailed metrics */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer>
                {/* Overview chart will be implemented here */}
                <div className="flex h-full items-center justify-center">
                  <p>System health metrics chart will be displayed here</p>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer>
                {/* Performance chart will be implemented here */}
                <div className="flex h-full items-center justify-center">
                  <p>Performance metrics chart will be displayed here</p>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer>
                {/* Error rate chart will be implemented here */}
                <div className="flex h-full items-center justify-center">
                  <p>Error rate chart will be displayed here</p>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-96">
              <ChartContainer>
                {/* User activity chart will be implemented here */}
                <div className="flex h-full items-center justify-center">
                  <p>User activity chart will be displayed here</p>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayoutContent>
  );
};

export default MonitoringDashboard;
