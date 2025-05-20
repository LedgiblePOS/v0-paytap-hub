
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileBarChart } from 'lucide-react';

const TestRunHistory: React.FC = () => {
  // Mock data for test run history
  const mockTestRuns = [
    {
      id: '1',
      name: 'Weekly Regression',
      date: '2025-05-02',
      executor: 'John Smith',
      environment: 'QA',
      passRate: 95,
      status: 'completed',
    },
    {
      id: '2',
      name: 'Security Audit',
      date: '2025-04-28',
      executor: 'Alice Johnson',
      environment: 'Staging',
      passRate: 87,
      status: 'completed',
    },
    {
      id: '3',
      name: 'Performance Benchmark',
      date: '2025-04-25',
      executor: 'Robert Brown',
      environment: 'Load Test',
      passRate: 90,
      status: 'completed',
    },
    {
      id: '4',
      name: 'Release Candidate Tests',
      date: '2025-05-07',
      executor: 'Sarah Davis',
      environment: 'Pre-Prod',
      status: 'in-progress',
    }
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test Run</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Environment</TableHead>
            <TableHead>Executed By</TableHead>
            <TableHead>Pass Rate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockTestRuns.map((run) => (
            <TableRow key={run.id}>
              <TableCell className="font-medium">{run.name}</TableCell>
              <TableCell>{run.date}</TableCell>
              <TableCell>{run.environment}</TableCell>
              <TableCell>{run.executor}</TableCell>
              <TableCell>
                {run.passRate ? (
                  <div className="flex items-center space-x-2">
                    <Progress value={run.passRate} className="h-2 w-40" />
                    <span className="text-sm">{run.passRate}%</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
              <TableCell>{getStatusBadge(run.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <FileBarChart className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {mockTestRuns.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No test runs recorded yet.</p>
        </div>
      )}
    </div>
  );
};

export default TestRunHistory;
