
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Activity, Server, Clock, RefreshCw, Cpu } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SystemHealthOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<any[]>([]);
  const [resourceUsage, setResourceUsage] = useState({
    cpu: 28,
    memory: 42,
    storage: 63,
    network: 36
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemMetrics();
  }, [timeRange]);

  const fetchSystemMetrics = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      let startDate = new Date();
      
      if (timeRange === 'day') {
        startDate.setDate(startDate.getDate() - 1);
      } else if (timeRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else {
        startDate.setDate(startDate.getDate() - 30);
      }
      
      const { data, error } = await supabase
        .from('system_metrics')
        .select('*')
        .gte('metric_date', startDate.toISOString().split('T')[0])
        .order('metric_date', { ascending: true });
        
      if (error) throw error;
      
      setSystemMetrics(data || []);
      
      // Simulate updating resource usage with new values
      setResourceUsage({
        cpu: 20 + Math.floor(Math.random() * 40),
        memory: 30 + Math.floor(Math.random() * 50),
        storage: 50 + Math.floor(Math.random() * 30),
        network: 20 + Math.floor(Math.random() * 40)
      });
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: "Error Loading Metrics",
        description: "Could not load system health metrics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    await fetchSystemMetrics();
    toast({
      title: "Metrics Refreshed",
      description: "System health metrics have been updated"
    });
    setIsRefreshing(false);
  };

  // Prepare chart data
  const prepareChartData = (metricType: string) => {
    return systemMetrics
      .filter(metric => metric.metric_type === metricType)
      .map(metric => ({
        date: new Date(metric.metric_date).toLocaleDateString(),
        value: metric.metric_value
      }));
  };

  const performanceData = prepareChartData('performance');
  const errorRateData = prepareChartData('error_rate');
  const apiUsageData = prepareChartData('api_usage');

  // Prepare resource usage charts (simulated data)
  const generateResourceHistoryData = () => {
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - i);
      
      data.push({
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cpu: 20 + Math.floor(Math.random() * 50),
        memory: 30 + Math.floor(Math.random() * 50),
        disk: 40 + Math.floor(Math.random() * 30)
      });
    }
    
    return data;
  };

  const resourceHistoryData = generateResourceHistoryData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          onClick={refreshMetrics} 
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}
        </Button>
      </div>

      {/* Resource Usage Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{resourceUsage.cpu}%</span>
              </div>
              <Progress value={resourceUsage.cpu} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{resourceUsage.memory}%</span>
              </div>
              <Progress value={resourceUsage.memory} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{resourceUsage.storage}%</span>
              </div>
              <Progress value={resourceUsage.storage} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Network Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{resourceUsage.network}%</span>
              </div>
              <Progress value={resourceUsage.network} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage History</CardTitle>
          <CardDescription>24-hour system resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={resourceHistoryData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                  name="CPU"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorMemory)"
                  name="Memory"
                />
                <Area
                  type="monotone"
                  dataKey="disk"
                  stroke="#ffc658"
                  fillOpacity={1}
                  fill="url(#colorDisk)"
                  name="Disk I/O"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="errors">Error Rates</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>Average response time in milliseconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading performance metrics...</p>
                    </div>
                  </div>
                ) : performanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorPerf)"
                        name="Response Time (ms)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No performance data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Rates</CardTitle>
              <CardDescription>System errors as percentage of requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading error metrics...</p>
                    </div>
                  </div>
                ) : errorRateData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={errorRateData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#ef4444"
                        name="Error Rate (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No error rate data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Total API requests per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading API usage metrics...</p>
                    </div>
                  </div>
                ) : apiUsageData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={apiUsageData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#22c55e"
                        name="API Requests"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No API usage data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthOverview;
