
import { Test, TestStatus, TestStep } from '@/types/testing';

export class TestRunner {
  private tests: Test[];
  private currentTestIndex: number = 0;
  private onUpdate: (tests: Test[]) => void;

  constructor(tests: Test[], onUpdate: (tests: Test[]) => void) {
    this.tests = [...tests];
    this.onUpdate = onUpdate;
  }

  getTests(): Test[] {
    return [...this.tests];
  }

  getCurrentTest(): Test | null {
    if (this.currentTestIndex < this.tests.length) {
      return this.tests[this.currentTestIndex];
    }
    return null;
  }

  setStepStatus(testId: string, stepId: string, status: TestStatus, actualResult?: string): void {
    const testIndex = this.tests.findIndex(t => t.id === testId);
    if (testIndex === -1) return;

    const test = {...this.tests[testIndex]};
    const stepIndex = test.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return;

    const updatedStep: TestStep = {
      ...test.steps[stepIndex],
      status,
      actualResult: actualResult || test.steps[stepIndex].actualResult
    };

    const updatedSteps = [...test.steps];
    updatedSteps[stepIndex] = updatedStep;

    const updatedTest: Test = {
      ...test,
      steps: updatedSteps
    };

    // Check if all steps are complete
    const allStepsComplete = updatedTest.steps.every(step => step.status && step.status !== 'pending');
    const anyStepFailed = updatedTest.steps.some(step => step.status === 'fail');

    // Update test status based on steps
    if (allStepsComplete) {
      updatedTest.status = anyStepFailed ? 'fail' : 'pass';
    } else {
      updatedTest.status = 'pending';
    }

    const updatedTests = [...this.tests];
    updatedTests[testIndex] = updatedTest;
    
    this.tests = updatedTests;
    this.onUpdate(this.tests);
  }

  setTestStatus(testId: string, status: TestStatus): void {
    const testIndex = this.tests.findIndex(t => t.id === testId);
    if (testIndex === -1) return;

    const updatedTests = [...this.tests];
    updatedTests[testIndex] = {
      ...updatedTests[testIndex],
      status
    };

    this.tests = updatedTests;
    this.onUpdate(this.tests);
  }

  moveToNextTest(): boolean {
    if (this.currentTestIndex < this.tests.length - 1) {
      this.currentTestIndex++;
      this.onUpdate(this.tests);
      return true;
    }
    return false;
  }

  moveToPreviousTest(): boolean {
    if (this.currentTestIndex > 0) {
      this.currentTestIndex--;
      this.onUpdate(this.tests);
      return true;
    }
    return false;
  }

  generateReport(): any {
    const total = this.tests.length;
    const passed = this.tests.filter(t => t.status === 'pass').length;
    const failed = this.tests.filter(t => t.status === 'fail').length;
    const pending = this.tests.filter(t => t.status === 'pending' || !t.status).length;
    const blocked = this.tests.filter(t => t.status === 'blocked').length;
    const notApplicable = this.tests.filter(t => t.status === 'not-applicable').length;
    
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    return {
      summary: {
        total,
        passed,
        failed,
        pending,
        blocked,
        notApplicable,
        passRate: Math.round(passRate * 100) / 100
      },
      tests: this.tests.map(test => ({
        id: test.id,
        name: test.name,
        status: test.status,
        priority: test.priority,
        stepsTotal: test.steps.length,
        stepsPassed: test.steps.filter(s => s.status === 'pass').length,
        stepsFailed: test.steps.filter(s => s.status === 'fail').length
      }))
    };
  }
}

export default TestRunner;
