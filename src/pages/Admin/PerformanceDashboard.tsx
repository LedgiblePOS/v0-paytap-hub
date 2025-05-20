
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, LayoutDashboard, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import PerformancePanel from '@/components/performance/PerformancePanel';
import performanceBenchmark from '@/utils/performance/PerformanceBenchmark';

const PerformanceDashboard: React.FC = () => {
  useEffect(() => {
    // Start monitoring performance
    performanceBenchmark.setEnabled(true);
    
    return () => {
      // Stop monitoring when component unmounts
      performanceBenchmark.setEnabled(false);
    };
  }, []);

  const runBenchmark = () => {
    performanceBenchmark.start('synthetic-benchmark');
    
    // Simulate CPU-intensive task
    const start = Date.now();
    while (Date.now() - start < 500) {
      // Heavy computation to simulate CPU usage
      Math.sqrt(Math.random() * 10000000);
    }
    
    performanceBenchmark.end('synthetic-benchmark');
  };

  const simulateNetworkActivity = async () => {
    performanceBenchmark.start('network-benchmark');
    
    try {
      // Make a sample network request
      await fetch('https://jsonplaceholder.typicode.com/posts');
    } catch (error) {
      console.error('Network simulation error:', error);
    } finally {
      performanceBenchmark.end('network-benchmark');
    }
  };

  return (
    <MainLayoutContent>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={runBenchmark} variant="outline" size="sm">
            Run CPU Benchmark
          </Button>
          <Button onClick={simulateNetworkActivity} variant="outline" size="sm">
            Test Network
          </Button>
          <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh Page
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Page Load Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" id="page-load-time">Calculating...</div>
            <script dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', () => {
                  setTimeout(() => {
                    if (window.performance) {
                      const perf = window.performance;
                      const pageLoadTime = perf.timing.loadEventEnd - perf.timing.navigationStart;
                      document.getElementById('page-load-time').textContent = 
                        pageLoadTime > 0 ? pageLoadTime + 'ms' : 'N/A';
                    }
                  }, 0);
                });
              `
            }} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              DOM Content Loaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" id="dom-load-time">Calculating...</div>
            <script dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', () => {
                  setTimeout(() => {
                    if (window.performance) {
                      const perf = window.performance;
                      const domLoadTime = perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart;
                      document.getElementById('dom-load-time').textContent = 
                        domLoadTime > 0 ? domLoadTime + 'ms' : 'N/A';
                    }
                  }, 0);
                });
              `
            }} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resources Loaded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" id="resources-count">Calculating...</div>
            <script dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('DOMContentLoaded', () => {
                  setTimeout(() => {
                    if (window.performance) {
                      const resources = window.performance.getEntriesByType('resource');
                      document.getElementById('resources-count').textContent = resources.length;
                    }
                  }, 0);
                });
              `
            }} />
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <PerformancePanel />
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Responsive Design Testing</h2>
        <Card>
          <CardHeader>
            <CardTitle>Device Previews</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="desktop">
              <TabsList className="w-full max-w-md mx-auto">
                <TabsTrigger value="mobile" className="flex-1">
                  <Smartphone className="h-4 w-4 mr-1" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="tablet" className="flex-1">
                  <Tablet className="h-4 w-4 mr-1" />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="desktop" className="flex-1">
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </TabsTrigger>
              </TabsList>
              <TabsContent value="mobile" className="mt-4">
                <div className="border rounded p-2 mx-auto" style={{ maxWidth: '375px' }}>
                  <div className="text-center text-sm text-muted-foreground mb-2">
                    iPhone (375px width)
                  </div>
                  <div className="border rounded bg-background" style={{ height: '667px' }}>
                    <iframe 
                      src={window.location.origin} 
                      className="w-full h-full"
                      style={{ pointerEvents: 'none' }}
                      title="Mobile Preview"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tablet" className="mt-4">
                <div className="border rounded p-2 mx-auto" style={{ maxWidth: '768px' }}>
                  <div className="text-center text-sm text-muted-foreground mb-2">
                    iPad (768px width)
                  </div>
                  <div className="border rounded bg-background" style={{ height: '1024px' }}>
                    <iframe 
                      src={window.location.origin} 
                      className="w-full h-full"
                      style={{ pointerEvents: 'none' }}
                      title="Tablet Preview"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="desktop" className="mt-4">
                <div className="border rounded p-2 mx-auto">
                  <div className="text-center text-sm text-muted-foreground mb-2">
                    Desktop (1280px width)
                  </div>
                  <div className="border rounded bg-background h-[600px]">
                    <iframe 
                      src={window.location.origin} 
                      className="w-full h-full"
                      style={{ pointerEvents: 'none' }}
                      title="Desktop Preview"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayoutContent>
  );
};

export default PerformanceDashboard;
