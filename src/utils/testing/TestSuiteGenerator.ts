
import { v4 as uuidv4 } from 'uuid';
import { Test, TestPriority, TestPrerequisite, TestStep } from '@/types/testing';

export class TestSuiteGenerator {
  static createEmptyTest(name: string, description: string, priority: TestPriority = 'medium'): Test {
    return {
      id: uuidv4(),
      name,
      description,
      priority,
      steps: [],
      prerequisites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static addStep(test: Test, description: string, expectedResult: string): Test {
    const newStep: TestStep = {
      id: uuidv4(),
      description,
      expectedResult,
      order: test.steps.length + 1
    };

    return {
      ...test,
      steps: [...test.steps, newStep],
      updatedAt: new Date().toISOString()
    };
  }

  static addPrerequisite(test: Test, description: string): Test {
    const newPrerequisite: TestPrerequisite = {
      id: uuidv4(),
      description
    };

    return {
      ...test,
      prerequisites: [...test.prerequisites, newPrerequisite],
      updatedAt: new Date().toISOString()
    };
  }

  static createMerchantOnboardingTestSuite(): Test[] {
    const tests: Test[] = [];

    // Test 1: Merchant Registration
    let test = this.createEmptyTest(
      "Merchant Registration", 
      "Verify that a new merchant can register successfully",
      "critical"
    );
    
    test = this.addPrerequisite(test, "System is accessible and registration page is available");
    test = this.addPrerequisite(test, "Valid email account is available for testing");
    
    test = this.addStep(
      test,
      "Navigate to the registration page",
      "Registration page loads successfully with all form fields"
    );
    
    test = this.addStep(
      test,
      "Complete the registration form with valid data",
      "Form accepts input without validation errors"
    );
    
    test = this.addStep(
      test,
      "Submit the registration form",
      "System displays a success message and sends a verification email"
    );
    
    test = this.addStep(
      test,
      "Verify the email address by clicking the link in the verification email",
      "Email verification is successful and user is redirected to the login page"
    );
    
    tests.push(test);

    // Test 2: Merchant Login
    test = this.createEmptyTest(
      "Merchant Login", 
      "Verify that a registered merchant can login successfully",
      "critical"
    );
    
    test = this.addPrerequisite(test, "Merchant account has been registered and verified");
    
    test = this.addStep(
      test,
      "Navigate to the login page",
      "Login page loads successfully with email and password fields"
    );
    
    test = this.addStep(
      test,
      "Enter valid credentials and submit the form",
      "System authenticates the user and redirects to the dashboard"
    );
    
    test = this.addStep(
      test,
      "Verify that the dashboard displays correct merchant information",
      "Dashboard shows the merchant's name, business details, and relevant metrics"
    );
    
    tests.push(test);

    // Additional tests can be added here
    
    return tests;
  }

  static createPaymentProcessingTestSuite(): Test[] {
    const tests: Test[] = [];

    // Test 1: Process Card Payment
    let test = this.createEmptyTest(
      "Process Card Payment", 
      "Verify that card payments can be processed successfully",
      "critical"
    );
    
    test = this.addPrerequisite(test, "Merchant is logged in and has payment processing enabled");
    test = this.addPrerequisite(test, "Test payment card is available");
    
    test = this.addStep(
      test,
      "Navigate to the POS page",
      "POS interface loads successfully"
    );
    
    test = this.addStep(
      test,
      "Add items to the cart",
      "Items are added to the cart with correct prices"
    );
    
    test = this.addStep(
      test,
      "Proceed to checkout",
      "Checkout screen appears with payment options"
    );
    
    test = this.addStep(
      test,
      "Select card payment and complete the transaction",
      "Payment processes successfully and receipt is generated"
    );
    
    tests.push(test);

    // Test 2: Generate Sales Report
    test = this.createEmptyTest(
      "Generate Sales Report", 
      "Verify that sales reports can be generated and exported",
      "high"
    );
    
    test = this.addPrerequisite(test, "Merchant is logged in");
    test = this.addPrerequisite(test, "Transaction history exists");
    
    test = this.addStep(
      test,
      "Navigate to the Reports section",
      "Reports interface loads successfully"
    );
    
    test = this.addStep(
      test,
      "Select date range and report type",
      "Report options are applied correctly"
    );
    
    test = this.addStep(
      test,
      "Generate the report",
      "Report is generated with accurate data"
    );
    
    test = this.addStep(
      test,
      "Export the report to a file",
      "Report file is downloaded successfully in the requested format"
    );
    
    tests.push(test);
    
    return tests;
  }

  static createSecurityTestSuite(): Test[] {
    const tests: Test[] = [];

    // Test 1: User Role Permissions
    let test = this.createEmptyTest(
      "User Role Permissions", 
      "Verify that user role permissions are enforced correctly",
      "high"
    );
    
    test = this.addPrerequisite(test, "User accounts with different role levels exist");
    
    test = this.addStep(
      test,
      "Login as a standard user",
      "User is authenticated and has access only to allowed features"
    );
    
    test = this.addStep(
      test,
      "Attempt to access admin-only features",
      "Access is denied with appropriate error message"
    );
    
    test = this.addStep(
      test,
      "Login as an admin user",
      "Admin is authenticated and has access to admin features"
    );
    
    tests.push(test);

    // Test 2: Password Change
    test = this.createEmptyTest(
      "Password Change", 
      "Verify that users can change their password securely",
      "medium"
    );
    
    test = this.addPrerequisite(test, "User is logged in");
    
    test = this.addStep(
      test,
      "Navigate to the user settings page",
      "Settings page loads with password change option"
    );
    
    test = this.addStep(
      test,
      "Enter current password and new password",
      "System validates password strength and format"
    );
    
    test = this.addStep(
      test,
      "Submit the password change form",
      "System confirms password change and requires re-login"
    );
    
    test = this.addStep(
      test,
      "Login with the new password",
      "Login is successful with the new credentials"
    );
    
    tests.push(test);
    
    return tests;
  }

  static getDefaultTestSuites(): Test[] {
    return [
      ...this.createMerchantOnboardingTestSuite(),
      ...this.createPaymentProcessingTestSuite(),
      ...this.createSecurityTestSuite()
    ];
  }
}

export default TestSuiteGenerator;
