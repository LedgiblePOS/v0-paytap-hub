
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestPlanGenerator } from '@/utils/testing/testPlanGenerator';
import { TestSuite } from '@/types/testing';
import TestSuiteView from './components/TestSuiteView';
import SecurityTestsView from './components/SecurityTestsView';
import PerformanceTestsView from './components/PerformanceTestsView';
import TestRunHistory from './components/TestRunHistory';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QualityAssurancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("test-plans");
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [securityTestSuite, setSecurityTestSuite] = useState<TestSuite | null>(null);
  const [performanceTestSuite, setPerformanceTestSuite] = useState<TestSuite | null>(null);
  const { toast } = useToast();
  
  // Generate test plans for critical user journeys
  const generateTestPlans = () => {
    const plans = TestPlanGenerator.generateCriticalJourneyPlans();
    setTestSuites(plans);
    
    toast({
      title: "Test Plans Generated",
      description: `Generated ${plans.length} test plans for critical user journeys.`,
    });
  };
  
  // Generate security test suite
  const generateSecurityTests = () => {
    const securitySuite = TestPlanGenerator.generateSecurityTestSuite();
    setSecurityTestSuite(securitySuite);
    
    toast({
      title: "Security Tests Generated",
      description: `Generated security test suite with ${securitySuite.tests.length} tests.`,
    });
  };
  
  // Generate performance test suite
  const generatePerformanceTests = () => {
    const perfSuite = TestPlanGenerator.generatePerformanceTestSuite();
    setPerformanceTestSuite(perfSuite);
    
    toast({
      title: "Performance Tests Generated",
      description: `Generated performance test suite with ${perfSuite.tests.length} tests.`,
    });
  };
  
  // Export test plans as JSON
  const exportTestPlans = () => {
    const allPlans = {
      userJourneys: testSuites,
      security: securityTestSuite,
      performance: performanceTestSuite
    };
    
    const dataStr = JSON.stringify(allPlans, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'test-plans.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Test Plans Exported",
      description: `All test plans exported to ${exportFileDefaultName}.`,
    });
  };
  
  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quality Assurance</h1>
          <p className="text-muted-foreground">Manage and execute test plans for critical functionality.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={exportTestPlans} variant="outline" disabled={!testSuites.length}>
            <Download className="mr-2 h-4 w-4" />
            Export Plans
          </Button>
          <Button onClick={() => document.getElementById('import-test-plans')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import Plans
          </Button>
          <input
            type="file"
            id="import-test-plans"
            className="hidden"
            accept=".json"
            onChange={(e) => {
              // Implementation for importing test plans would go here
              toast({
                title: "Import not implemented",
                description: "This feature is under development.",
              });
            }}
          />
        </div>
      </div>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="test-plans">User Journey Tests</TabsTrigger>
              <TabsTrigger value="security-tests">Security Tests</TabsTrigger>
              <TabsTrigger value="performance-tests">Performance Tests</TabsTrigger>
              <TabsTrigger value="test-history">Test History</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value="test-plans" className="p-4">
              {testSuites.length > 0 ? (
                <div className="space-y-4">
                  {testSuites.map((suite) => (
                    <TestSuiteView key={suite.id} testSuite={suite} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No test plans generated yet.</p>
                  <Button onClick={generateTestPlans}>
                    Generate User Journey Test Plans
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="security-tests" className="p-4">
              {securityTestSuite ? (
                <SecurityTestsView testSuite={securityTestSuite} />
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No security tests generated yet.</p>
                  <Button onClick={generateSecurityTests}>
                    Generate Security Test Suite
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="performance-tests" className="p-4">
              {performanceTestSuite ? (
                <PerformanceTestsView testSuite={performanceTestSuite} />
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">No performance tests generated yet.</p>
                  <Button onClick={generatePerformanceTests}>
                    Generate Performance Test Suite
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="test-history" className="p-4">
              <TestRunHistory />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default QualityAssurancePage;
