
import React from 'react';
import { TestSuite } from '@/types/testing';
import TestSuiteView from './TestSuiteView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Lock } from 'lucide-react';

interface SecurityTestsViewProps {
  testSuite: TestSuite;
}

const SecurityTestsView: React.FC<SecurityTestsViewProps> = ({ testSuite }) => {
  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Security Testing Notice</AlertTitle>
        <AlertDescription>
          Security testing should be performed in isolated environments only. 
          Never run penetration tests against production systems without proper authorization.
        </AlertDescription>
      </Alert>
      
      <Card className="bg-secondary/10 border-dashed">
        <CardHeader>
          <div className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            <CardTitle>Security Testing Guidelines</CardTitle>
          </div>
          <CardDescription>
            Important guidelines for security testing procedures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Obtain written authorization before performing any security tests</li>
            <li>Document all testing activities and findings</li>
            <li>Use testing accounts only, never test with real user data</li>
            <li>Report critical vulnerabilities immediately to the security team</li>
            <li>Follow responsible disclosure practices</li>
          </ul>
        </CardContent>
      </Card>
      
      <TestSuiteView testSuite={testSuite} />
    </div>
  );
};

export default SecurityTestsView;
