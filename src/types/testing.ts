
export type TestPriority = 'low' | 'medium' | 'high' | 'critical';
export type TestStatus = 'pending' | 'pass' | 'fail' | 'blocked' | 'not-applicable';

export interface TestStep {
  id: string;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status?: TestStatus;
  order: number;
  screenshot?: string;
}

export interface TestPrerequisite {
  id: string;
  description: string;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  priority: TestPriority;
  status?: TestStatus;
  steps: TestStep[];
  prerequisites: TestPrerequisite[];
  assignedTo?: string;
  executedBy?: string;
  executedAt?: string;
  duration?: number;
  environment?: string;
  version?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: Test[];
  createdAt: string;
  updatedAt: string;
}

export interface TestRun {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  testSuites: TestSuite[];
  passRate?: number;
  environment: string;
  version: string;
  executedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestReport {
  id: string;
  testRun: TestRun;
  summary: {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    notApplicable: number;
    pending: number;
    passRate: number;
  };
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  createdAt: string;
  generatedBy: string;
}

export interface UserFeedback {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'reviewed' | 'planned' | 'implemented' | 'rejected';
  requirementId?: string;
  testId?: string;
}

export interface TestEnvironment {
  id: string;
  name: string;
  description: string;
  url: string;
  type: 'development' | 'staging' | 'production' | 'qa';
  createdAt: string;
  updatedAt: string;
}

export interface RequirementVerification {
  id: string;
  requirementId: string;
  requirementText: string;
  status: 'pending' | 'verified' | 'failed' | 'blocked';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  testIds: string[];
}
