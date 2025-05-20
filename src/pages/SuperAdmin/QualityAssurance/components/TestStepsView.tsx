
import React, { useState } from 'react';
import { TestStep, TestStatus } from '@/types/testing';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TestStepsViewProps {
  steps: TestStep[];
}

const TestStepsView: React.FC<TestStepsViewProps> = ({ steps }) => {
  const [testSteps, setTestSteps] = useState<TestStep[]>(steps);
  
  const updateStepStatus = (stepId: string, status: TestStatus) => {
    setTestSteps(prevSteps => prevSteps.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };
  
  const updateActualResult = (stepId: string, result: string) => {
    setTestSteps(prevSteps => prevSteps.map(step => 
      step.id === stepId ? { ...step, actualResult: result } : step
    ));
  };
  
  const getStatusIcon = (status?: TestStatus) => {
    if (!status) return <Circle className="h-4 w-4 text-muted-foreground cursor-pointer" />;
    
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500 cursor-pointer" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive cursor-pointer" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground cursor-pointer" />;
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Step</TableHead>
          <TableHead>Expected Result</TableHead>
          <TableHead>Actual Result</TableHead>
          <TableHead className="w-16">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testSteps.map((step) => (
          <TableRow key={step.id}>
            <TableCell>{step.order}</TableCell>
            <TableCell>{step.description}</TableCell>
            <TableCell>{step.expectedResult}</TableCell>
            <TableCell>
              <Textarea 
                className="min-h-[60px] resize-none"
                placeholder="Enter actual result..."
                value={step.actualResult || ''}
                onChange={(e) => updateActualResult(step.id, e.target.value)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <div 
                  className="cursor-pointer"
                  onClick={() => updateStepStatus(step.id, 'pass')}
                >
                  <CheckCircle className={cn(
                    "h-5 w-5",
                    step.status === 'pass' ? "text-green-500" : "text-muted-foreground/30"
                  )} />
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => updateStepStatus(step.id, 'fail')}
                >
                  <XCircle className={cn(
                    "h-5 w-5",
                    step.status === 'fail' ? "text-destructive" : "text-muted-foreground/30"
                  )} />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TestStepsView;
