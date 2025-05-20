
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, LineChart, BarChart2, Cpu, RefreshCw } from 'lucide-react';
import performanceBenchmark from '@/utils/performance/PerformanceBenchmark';

interface PerformanceStat {
  name: string;
  count: number;
  avg: number;
  min: number;
  max: number;
}

/**
 * Component to display performance metrics and benchmarks
 */
const PerformancePanel: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStat[]>([]);
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);
  const [webVitals, setWebVitals] = useState<Record<string, number>>({
    FCP: 0, // First Contentful Paint
    LCP: 0, // Largest Contentful Paint
    CLS: 0, // Cumulative Layout Shift
    FID: 0, // First Input Delay
    TTI: 0, // Time to Interactive
  });

  // Collect and format performance stats
  const updateStats = () => {
    // Get all results from benchmark
    const results = performanceBenchmark.getResults();
    
    // Group by name and calculate statistics
    const groupedStats: Record<string, number[]> = {};
    
    results.forEach(result => {
      if (!groupedStats[result.name]) {
        groupedStats[result.name] = [];
      }
      groupedStats[result.name].push(result.duration);
    });
    
    // Calculate statistics for each group
    const formattedStats = Object.entries(groupedStats).map(([name, durations]) => {
      const total = durations.reduce((sum, d) => sum + d, 0);
      return {
        name,
        count: durations.length,
        avg: total / durations.length,
        min: Math.min(...durations),
        max: Math.max(...durations)
      };
    });
    
    setStats(formattedStats);
    
    // Update memory usage if available
    if (performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      setMemoryUsage({
        used: memory.usedJSHeapSize / (1024 * 1024),  // Convert to MB
        total: memory.totalJSHeapSize / (1024 * 1024),
        limit: memory.jsHeapSizeLimit / (1024 * 1024)
      });
    }
    
    // Collect Web Vitals metrics if available
    if ('PerformanceObserver' in window) {
      try {
        // Get FCP if available
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        if (fcpEntry) {
          setWebVitals(prev => ({ ...prev, FCP: fcpEntry.startTime }));
        }
        
        // Get LCP if available from entries
        const lcpEntries = performance.getEntriesByType('paint');
        const lcpEntry = lcpEntries.find(entry => entry.name === 'largest-contentful-paint');
        if (lcpEntry) {
          setWebVitals(prev => ({ ...prev, LCP: lcpEntry.startTime }));
        }
      } catch (error) {
        console.error('Error collecting web vitals:', error);
      }
    }
  };

  useEffect(() => {
    // Update stats initially
    updateStats();
    
    // Set up interval to update stats periodically
    const intervalId = setInterval(updateStats, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleClear = () => {
    performanceBenchmark.clearResults();
    updateStats();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={updateStats}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="benchmarks">
          <TabsList className="w-full bg-muted/30 rounded-none border-b">
            <TabsTrigger value="benchmarks" className="flex-1">
              <BarChart2 className="h-4 w-4 mr-1" />
              Benchmarks
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex-1">
              <Cpu className="h-4 w-4 mr-1" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="web-vitals" className="flex-1">
              <LineChart className="h-4 w-4 mr-1" />
              Web Vitals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="benchmarks" className="p-4">
            {stats.length > 0 ? (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Component/Function</th>
                        <th className="text-right py-2">Count</th>
                        <th className="text-right py-2">Avg (ms)</th>
                        <th className="text-right py-2">Min (ms)</th>
                        <th className="text-right py-2">Max (ms)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((stat) => (
                        <tr key={stat.name} className="border-b">
                          <td className="py-2">{stat.name}</td>
                          <td className="text-right py-2">{stat.count}</td>
                          <td className="text-right py-2">{stat.avg.toFixed(2)}</td>
                          <td className="text-right py-2">{stat.min.toFixed(2)}</td>
                          <td className="text-right py-2">{stat.max.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                No performance data collected yet
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="memory" className="p-4">
            {memoryUsage ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="text-muted-foreground text-sm">Used Memory</div>
                    <div className="text-2xl font-semibold">{memoryUsage.used.toFixed(2)} MB</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="text-muted-foreground text-sm">Total Allocated</div>
                    <div className="text-2xl font-semibold">{memoryUsage.total.toFixed(2)} MB</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-md">
                    <div className="text-muted-foreground text-sm">Heap Limit</div>
                    <div className="text-2xl font-semibold">{memoryUsage.limit.toFixed(2)} MB</div>
                  </div>
                </div>
                
                <div>
                  <div className="relative pt-1">
                    <div className="text-muted-foreground text-xs mb-1">
                      Memory Usage: {((memoryUsage.used / memoryUsage.limit) * 100).toFixed(1)}%
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-muted/30">
                      <div 
                        style={{ width: `${(memoryUsage.used / memoryUsage.limit) * 100}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Memory usage data not available in this browser
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="web-vitals" className="p-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm">FCP (First Contentful Paint)</div>
                <div className="text-2xl font-semibold">
                  {webVitals.FCP ? `${webVitals.FCP.toFixed(0)}ms` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {webVitals.FCP < 1800 ? 'Good' : webVitals.FCP < 3000 ? 'Needs Improvement' : 'Poor'}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm">LCP (Largest Contentful Paint)</div>
                <div className="text-2xl font-semibold">
                  {webVitals.LCP ? `${webVitals.LCP.toFixed(0)}ms` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {webVitals.LCP < 2500 ? 'Good' : webVitals.LCP < 4000 ? 'Needs Improvement' : 'Poor'}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm">FID (First Input Delay)</div>
                <div className="text-2xl font-semibold">
                  {webVitals.FID ? `${webVitals.FID.toFixed(0)}ms` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {webVitals.FID < 100 ? 'Good' : webVitals.FID < 300 ? 'Needs Improvement' : 'Poor'}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="text-muted-foreground text-sm">CLS (Cumulative Layout Shift)</div>
                <div className="text-2xl font-semibold">
                  {webVitals.CLS ? webVitals.CLS.toFixed(3) : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {webVitals.CLS < 0.1 ? 'Good' : webVitals.CLS < 0.25 ? 'Needs Improvement' : 'Poor'}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformancePanel;
