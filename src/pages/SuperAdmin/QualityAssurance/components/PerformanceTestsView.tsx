
import React from 'react';
import { TestSuite } from '@/types/testing';
import TestSuiteView from './TestSuiteView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Gauge } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PerformanceTestsViewProps {
  testSuite: TestSuite;
}

const PerformanceTestsView: React.FC<PerformanceTestsViewProps> = ({ testSuite }) => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Performance Testing Guidelines</AlertTitle>
        <AlertDescription>
          Performance tests should be run against isolated environments that closely mirror production.
          Start with low load and gradually increase to avoid service disruption.
        </AlertDescription>
      </Alert>
      
      <Card className="bg-secondary/10 border-dashed">
        <CardHeader>
          <div className="flex items-center">
            <Gauge className="h-5 w-5 mr-2" />
            <CardTitle>Performance Metrics</CardTitle>
          </div>
          <CardDescription>
            Key metrics to monitor during performance testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Response Time: Average time to process a request</li>
            <li>Throughput: Number of requests processed per second</li>
            <li>Error Rate: Percentage of requests resulting in errors</li>
            <li>CPU Utilization: Percentage of CPU resources used</li>
            <li>Memory Usage: Amount of memory consumed</li>
            <li>Database Query Time: Time taken to execute database queries</li>
          </ul>
        </CardContent>
      </Card>
      
      <TestSuiteView testSuite={testSuite} />
    </div>
  );
};

export default PerformanceTestsView;
