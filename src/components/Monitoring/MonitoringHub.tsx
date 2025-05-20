
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, AlertTriangle, Gauge, Shield } from "lucide-react";
import { ErrorMetricsTooltip, PerformanceMetricsTooltip } from './MonitoringTooltips';
import SecurityGuide from '../Onboarding/SecurityGuide';

const MonitoringHub: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">System Monitoring</h1>
      </div>

      <Tabs defaultValue="errors">
        <TabsList>
          <TabsTrigger value="errors">
            <ErrorMetricsTooltip>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Error Tracking
              </div>
            </ErrorMetricsTooltip>
          </TabsTrigger>
          <TabsTrigger value="performance">
            <PerformanceMetricsTooltip>
              <div className="flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Performance
              </div>
            </PerformanceMetricsTooltip>
          </TabsTrigger>
          <TabsTrigger value="security">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Real-time Error Monitoring</AlertTitle>
                  <AlertDescription>
                    Automatically tracks and analyzes application errors. Configure alert thresholds in settings.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Gauge className="h-4 w-4" />
                  <AlertTitle>System Performance</AlertTitle>
                  <AlertDescription>
                    Monitors page load times, API response times, and resource usage.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringHub;
