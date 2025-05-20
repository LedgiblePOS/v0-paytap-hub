
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type TestStatus = 'idle' | 'running' | 'passed' | 'failed' | 'skipped';

interface TestResult {
  name: string;
  status: TestStatus;
  message?: string;
}

interface TestCategory {
  name: string;
  tests: TestResult[];
}

const TestChecker: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<TestCategory[]>([
    {
      name: 'Authentication Flows',
      tests: [
        { name: 'Login Process', status: 'idle' },
        { name: 'Registration Process', status: 'idle' },
        { name: 'Authentication Persistence', status: 'idle' },
      ]
    },
    {
      name: 'Role-Based Access Control',
      tests: [
        { name: 'Super Admin Access', status: 'idle' },
        { name: 'Merchant Access', status: 'idle' },
        { name: 'Staff Access', status: 'idle' },
      ]
    },
    {
      name: 'Page Rendering and Navigation',
      tests: [
        { name: 'Primary Navigation', status: 'idle' },
        { name: 'Section Switching', status: 'idle' },
        { name: 'Component Loading', status: 'idle' },
        { name: 'Responsive Design', status: 'idle' },
      ]
    },
    {
      name: 'Data Operations',
      tests: [
        { name: 'Form Submissions', status: 'idle' },
        { name: 'Real-time Validation', status: 'idle' },
        { name: 'Data Persistence', status: 'idle' },
      ]
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const totalTests = categories.reduce((sum, category) => sum + category.tests.length, 0);

  const runTests = async () => {
    setIsRunning(true);
    
    // Clone the categories array for updates
    const updatedCategories = [...categories];
    
    for (let categoryIndex = 0; categoryIndex < updatedCategories.length; categoryIndex++) {
      const category = updatedCategories[categoryIndex];
      
      for (let testIndex = 0; testIndex < category.tests.length; testIndex++) {
        const test = category.tests[testIndex];
        
        // Mark test as running
        test.status = 'running';
        setCurrentTest(test.name);
        setCategories([...updatedCategories]);
        
        // Simulate test running
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Determine test result (random for demonstration)
        const result = Math.random();
        if (result > 0.8) {
          test.status = 'failed';
          test.message = 'Test assertion failed';
        } else if (result > 0.1) {
          test.status = 'passed';
          test.message = 'All assertions passed';
        } else {
          test.status = 'skipped';
          test.message = 'Test skipped due to dependencies';
        }
        
        setCompletedCount(prev => prev + 1);
        setCategories([...updatedCategories]);
      }
    }
    
    setIsRunning(false);
    setCurrentTest(null);
  };

  const resetTests = () => {
    const updatedCategories = categories.map(category => ({
      ...category,
      tests: category.tests.map(test => ({ ...test, status: 'idle', message: undefined }))
    }));
    
    setCategories(updatedCategories);
    setCompletedCount(0);
    setCurrentTest(null);
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return (
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        );
      case 'skipped':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <div className="h-5 w-5 border border-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Assurance Test Runner</h1>
          <p className="text-muted-foreground">Run automated tests to verify application functionality</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button 
            variant="outline" 
            onClick={resetTests}
            disabled={isRunning}
          >
            Reset Tests
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      {isRunning && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="mb-2 flex justify-between items-center">
                  <div className="text-sm font-medium">Testing Progress</div>
                  <div className="text-sm text-muted-foreground">
                    {completedCount} of {totalTests} tests completed
                  </div>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(completedCount / totalTests) * 100}%` }} 
                  />
                </div>
                {currentTest && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Currently testing: {currentTest}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {categories.map((category, index) => (
        <Card key={index} className="mb-6">
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.tests.map((test, testIndex) => (
                <div key={testIndex} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <span>{test.name}</span>
                  </div>
                  <div className="text-sm">
                    {test.status === 'idle' ? (
                      <span className="text-muted-foreground">Not run</span>
                    ) : test.status === 'running' ? (
                      <span className="text-blue-500">Running...</span>
                    ) : test.status === 'passed' ? (
                      <span className="text-green-500">Passed</span>
                    ) : test.status === 'failed' ? (
                      <span className="text-red-500">Failed</span>
                    ) : (
                      <span className="text-amber-500">Skipped</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          {category.tests.some(t => t.message) && (
            <CardFooter className="border-t pt-6">
              <div className="w-full space-y-2">
                {category.tests.filter(t => t.message).map((test, i) => (
                  <div key={i} className={`p-3 rounded-md text-sm ${
                    test.status === 'passed' ? 'bg-green-50 text-green-700' : 
                    test.status === 'failed' ? 'bg-red-50 text-red-700' : 
                    'bg-amber-50 text-amber-700'
                  }`}>
                    <strong>{test.name}:</strong> {test.message}
                  </div>
                ))}
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default TestChecker;
