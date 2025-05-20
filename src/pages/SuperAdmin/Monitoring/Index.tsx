
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsOverview from '@/components/SuperAdmin/Monitoring/components/MetricsOverview';
import useSystemMetrics from '@/components/SuperAdmin/Monitoring/hooks/useSystemMetrics';
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

const SystemMonitoring: React.FC = () => {
  const { metrics, loading, error, refetch, timeframe, setTimeframe } = useSystemMetrics();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
          <p className="text-muted-foreground">Monitor system health and performance.</p>
        </div>
        
        <Button onClick={refetch} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>Error loading system metrics. Please try again later.</span>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '--' : `${metrics.cpu.value}%`}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span className={`${metrics.cpu.trend === 'UP' ? 'text-destructive' : 'text-green-600'}`}>
                {metrics.cpu.change}% 
              </span>
              <span className="ml-1">from last hour</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '--' : `${metrics.memory.value}%`}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span className={`${metrics.memory.trend === 'UP' ? 'text-destructive' : 'text-green-600'}`}>
                {metrics.memory.change}% 
              </span>
              <span className="ml-1">from last hour</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '--' : `${metrics.responseTime.value}ms`}</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <span className={`${metrics.responseTime.trend === 'UP' ? 'text-destructive' : 'text-green-600'}`}>
                {metrics.responseTime.change}ms 
              </span>
              <span className="ml-1">from last hour</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={timeframe === '1h' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeframe('1h')}
            >
              1h
            </Button>
            <Button 
              variant={timeframe === '24h' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeframe('24h')}
            >
              24h
            </Button>
            <Button 
              variant={timeframe === '7d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeframe('7d')}
            >
              7d
            </Button>
            <Button 
              variant={timeframe === '30d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeframe('30d')}
            >
              30d
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <MetricsOverview metrics={metrics} loading={loading} />
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <p>Detailed performance metrics will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <p>System error logs will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitoring;
