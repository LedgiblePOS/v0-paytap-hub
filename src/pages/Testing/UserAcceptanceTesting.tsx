
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Test, TestStatus, TestStep } from '@/types/testing';
import { TestRunner } from '@/utils/testing/TestRunner';
import { TestSuiteGenerator } from '@/utils/testing/TestSuiteGenerator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileCheck, FileWarning, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const statusColors: Record<TestStatus, string> = {
  'pass': 'bg-green-100 text-green-800 hover:bg-green-200',
  'fail': 'bg-red-100 text-red-800 hover:bg-red-200',
  'pending': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  'blocked': 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  'not-applicable': 'bg-blue-100 text-blue-800 hover:bg-blue-200'
};

const statusIcons: Record<TestStatus, React.ReactNode> = {
  'pass': <CheckCircle className="h-4 w-4 text-green-500" />,
  'fail': <AlertCircle className="h-4 w-4 text-red-500" />,
  'pending': <Clock className="h-4 w-4 text-yellow-500" />,
  'blocked': <FileWarning className="h-4 w-4 text-gray-500" />,
  'not-applicable': <FileCheck className="h-4 w-4 text-blue-500" />
};

const UserAcceptanceTesting: React.FC = () => {
  const { toast } = useToast();
  const [activeSuite, setActiveSuite] = useState<string>('merchant');
  const [tests, setTests] = useState<Test[]>([]);
  const [testRunner, setTestRunner] = useState<TestRunner | null>(null);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [stakeholders, setStakeholders] = useState<string[]>(['John (Product Manager)', 'Sarah (UX Designer)', 'Mike (Lead Developer)']);
  
  // Initialize test suites
  useEffect(() => {
    const allTests = TestSuiteGenerator.getDefaultTestSuites();
    const runner = new TestRunner(allTests, (updatedTests) => {
      setTests(updatedTests);
    });
    setTestRunner(runner);
    setTests(allTests);
    setCurrentTest(runner.getCurrentTest());
  }, []);

  const handleSelectTest = (test: Test) => {
    setCurrentTest(test);
  };

  const handleUpdateStepStatus = (stepId: string, status: TestStatus, actualResult?: string) => {
    if (!currentTest || !testRunner) return;
    
    testRunner.setStepStatus(currentTest.id, stepId, status, actualResult);
    setCurrentTest(testRunner.getCurrentTest());
  };

  const handleExportReport = () => {
    if (!testRunner) return;
    
    const report = testRunner.generateReport();
    const jsonData = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `uat-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Report Exported",
      description: "The UAT report has been exported successfully."
    });
  };

  const handleSaveFeedback = () => {
    if (!feedback.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please enter feedback before saving.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Feedback Saved",
      description: "Your feedback has been saved for post-launch improvements."
    });
    
    setFeedback('');
  };

  const renderTestStatus = (status?: TestStatus) => {
    if (!status) return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        {statusIcons['pending']} Pending
      </Badge>
    );
    
    return (
      <Badge variant="outline" className={statusColors[status]}>
        {statusIcons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Acceptance Testing</h1>
        <p className="text-muted-foreground mt-2">
          Conduct UAT with stakeholders and document feedback for post-launch improvements.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {stakeholders.map((stakeholder, index) => (
          <Card key={index} className="w-full sm:w-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Stakeholder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  {stakeholder.charAt(0)}
                </div>
                <span>{stakeholder}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Dialog>
          <DialogTrigger asChild>
            <Card className="w-full sm:w-auto cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Add Stakeholder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xl">
                    +
                  </div>
                  <span>Add new</span>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Stakeholder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right col-span-1">Name:</p>
                <input className="col-span-3 p-2 border rounded" placeholder="Stakeholder name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right col-span-1">Role:</p>
                <input className="col-span-3 p-2 border rounded" placeholder="Stakeholder role" />
              </div>
              <div className="flex justify-end">
                <Button>Add Stakeholder</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Test Suites</CardTitle>
              <CardDescription>Run tests to verify system requirements</CardDescription>
            </div>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="merchant" onValueChange={setActiveSuite} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="merchant">Merchant Onboarding</TabsTrigger>
              <TabsTrigger value="payment">Payment Processing</TabsTrigger>
              <TabsTrigger value="security">Security Features</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Test Cases</h3>
                <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
                  {tests.map(test => (
                    <div
                      key={test.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 ${currentTest?.id === test.id ? 'bg-muted' : ''}`}
                      onClick={() => handleSelectTest(test)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{test.name}</h4>
                        {renderTestStatus(test.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                {currentTest ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-lg">{currentTest.name}</h3>
                      <Badge variant={currentTest.priority === 'critical' ? 'destructive' : 'secondary'}>
                        {currentTest.priority.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p>{currentTest.description}</p>
                    
                    {currentTest.prerequisites.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Prerequisites</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {currentTest.prerequisites.map(prereq => (
                            <li key={prereq.id}>{prereq.description}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Test Steps</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Step</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Expected Result</TableHead>
                            <TableHead className="w-28">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentTest.steps.map((step, index) => (
                            <TableRow key={step.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{step.description}</TableCell>
                              <TableCell>{step.expectedResult}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <select
                                    className="border rounded p-1 text-sm w-full"
                                    value={step.status || 'pending'}
                                    onChange={(e) => handleUpdateStepStatus(
                                      step.id, 
                                      e.target.value as TestStatus,
                                      step.actualResult
                                    )}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="pass">Pass</option>
                                    <option value="fail">Fail</option>
                                    <option value="blocked">Blocked</option>
                                    <option value="not-applicable">N/A</option>
                                  </select>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Actual Results / Notes</h4>
                      <Textarea 
                        placeholder="Document the actual results and any observations..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-between mt-4">
                      <div className="space-x-2">
                        <Button variant="outline" disabled={!currentTest.steps.length}>Previous Step</Button>
                        <Button disabled={!currentTest.steps.length}>Next Step</Button>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={() => {
                          if (testRunner) testRunner.setTestStatus(currentTest.id, 'blocked');
                        }}>Mark Blocked</Button>
                        <Button variant="destructive" onClick={() => {
                          if (testRunner) testRunner.setTestStatus(currentTest.id, 'fail');
                        }}>Fail Test</Button>
                        <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => {
                          if (testRunner) testRunner.setTestStatus(currentTest.id, 'pass');
                        }}>Pass Test</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Select a test case to begin testing</p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Collection</CardTitle>
          <CardDescription>Document stakeholder feedback for post-launch improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter feedback from stakeholders for post-launch improvements..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              className="w-full"
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="critical" />
              <label htmlFor="critical" className="text-sm font-medium">Mark as critical (requires immediate attention post-launch)</label>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveFeedback}>Save Feedback</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements Verification</CardTitle>
          <CardDescription>Verify all system requirements have been met</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-32">Verified By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>Merchant onboarding process is complete and functional</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </TableCell>
                <TableCell>John (PM)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2</TableCell>
                <TableCell>Payment processing supports all required payment methods</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </TableCell>
                <TableCell>Sarah (UX)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>3</TableCell>
                <TableCell>User role permissions are correctly enforced</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>4</TableCell>
                <TableCell>Reporting functionality delivers accurate data exports</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </TableCell>
                <TableCell>—</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5</TableCell>
                <TableCell>System performs acceptably under expected load</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </TableCell>
                <TableCell>Mike (Dev)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAcceptanceTesting;
