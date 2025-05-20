
import React, { useState } from 'react';
import { Test, TestSuite, TestStatus } from '@/types/testing';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import TestStepsView from './TestStepsView';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Play, XCircle } from 'lucide-react';

interface TestSuiteViewProps {
  testSuite: TestSuite;
}

const TestSuiteView: React.FC<TestSuiteViewProps> = ({ testSuite }) => {
  const [tests, setTests] = useState<Test[]>(testSuite.tests);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  
  const updateTestStatus = (testId: string, status: TestStatus) => {
    setTests(prevTests => prevTests.map(test => 
      test.id === testId ? { ...test, status } : test
    ));
  };
  
  const getStatusBadge = (status?: TestStatus) => {
    if (!status) return <Badge variant="outline">Pending</Badge>;
    
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-500">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'blocked':
        return <Badge variant="secondary">Blocked</Badge>;
      case 'not-applicable':
        return <Badge variant="outline">N/A</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const getStatusIcon = (status?: TestStatus) => {
    if (!status) return <Circle className="h-4 w-4 text-muted-foreground" />;
    
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'blocked':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      case 'not-applicable':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{testSuite.name}</CardTitle>
        <CardDescription>{testSuite.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {tests.map((test) => (
            <AccordionItem key={test.id} value={test.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  {getStatusIcon(test.status)}
                  <span className="ml-2">{test.name}</span>
                </div>
                <div className="flex items-center space-x-4 mr-4">
                  <Badge variant="outline">{test.priority}</Badge>
                  {getStatusBadge(test.status)}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                  
                  {test.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Prerequisites:</h4>
                      <ul className="list-disc list-inside text-sm">
                        {test.prerequisites.map((prereq) => (
                          <li key={prereq.id}>{prereq.description}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <TestStepsView steps={test.steps} />
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateTestStatus(test.id, 'not-applicable')}
                    >
                      Mark N/A
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => updateTestStatus(test.id, 'fail')}
                    >
                      Mark Failed
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => updateTestStatus(test.id, 'pass')}
                    >
                      Mark Passed
                    </Button>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-1" /> Run Test
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TestSuiteView;
