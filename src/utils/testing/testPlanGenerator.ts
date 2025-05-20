
import { Test, TestStep, TestSuite } from '@/types/testing';

/**
 * Generates a test plan for a given set of features or user journeys
 * 
 * This utility helps QA teams create consistent test plans for all core features
 */
export class TestPlanGenerator {
  /**
   * Generate a test plan for a user journey
   */
  public static generateUserJourneyPlan(
    journeyName: string, 
    description: string,
    steps: string[]
  ): TestSuite {
    const testSteps = steps.map((step, index) => {
      return {
        id: `step-${index + 1}`,
        description: step,
        expectedResult: '',  // To be filled by QA team
        order: index + 1
      } as TestStep;
    });
    
    return {
      id: `journey-${Date.now()}`,
      name: journeyName,
      description,
      tests: [
        {
          id: `test-${Date.now()}`,
          name: `Complete ${journeyName}`,
          description: `Verify the complete ${journeyName} flow works as expected`,
          priority: 'high',
          steps: testSteps,
          prerequisites: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  /**
   * Generate a security test suite
   */
  public static generateSecurityTestSuite(): TestSuite {
    return {
      id: `security-${Date.now()}`,
      name: 'Security Test Suite',
      description: 'Comprehensive security tests for the application',
      tests: [
        {
          id: `sec-auth-${Date.now()}`,
          name: 'Authentication Security',
          description: 'Test authentication security features',
          priority: 'critical',
          steps: [
            {
              id: 'sec-auth-1',
              description: 'Test brute force protection',
              expectedResult: 'System should block after multiple failed attempts',
              order: 1
            },
            {
              id: 'sec-auth-2',
              description: 'Test password complexity requirements',
              expectedResult: 'System should reject weak passwords',
              order: 2
            },
            {
              id: 'sec-auth-3',
              description: 'Test authentication token security',
              expectedResult: 'Tokens should be properly secured and validated',
              order: 3
            }
          ],
          prerequisites: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `sec-csrf-${Date.now()}`,
          name: 'CSRF Protection',
          description: 'Test Cross-Site Request Forgery protections',
          priority: 'critical',
          steps: [
            {
              id: 'sec-csrf-1',
              description: 'Test CSRF token validation',
              expectedResult: 'System should reject requests without valid CSRF tokens',
              order: 1
            }
          ],
          prerequisites: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `sec-xss-${Date.now()}`,
          name: 'XSS Protection',
          description: 'Test Cross-Site Scripting protections',
          priority: 'critical',
          steps: [
            {
              id: 'sec-xss-1',
              description: 'Test input sanitization',
              expectedResult: 'System should sanitize user input to prevent XSS',
              order: 1
            },
            {
              id: 'sec-xss-2',
              description: 'Test Content Security Policy',
              expectedResult: 'CSP should prevent execution of malicious scripts',
              order: 2
            }
          ],
          prerequisites: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  /**
   * Generate a performance test suite
   */
  public static generatePerformanceTestSuite(): TestSuite {
    return {
      id: `perf-${Date.now()}`,
      name: 'Performance Test Suite',
      description: 'Performance tests for the application',
      tests: [
        {
          id: `perf-load-${Date.now()}`,
          name: 'Load Testing',
          description: 'Test application performance under load',
          priority: 'high',
          steps: [
            {
              id: 'perf-load-1',
              description: 'Test with 100 concurrent users',
              expectedResult: 'Response time should be under 2 seconds',
              order: 1
            },
            {
              id: 'perf-load-2',
              description: 'Test with 500 concurrent users',
              expectedResult: 'Response time should be under 5 seconds',
              order: 2
            }
          ],
          prerequisites: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  /**
   * Generate critical user journey test plans
   */
  public static generateCriticalJourneyPlans(): TestSuite[] {
    const userJourneys: Array<{name: string, description: string, steps: string[]}> = [
      {
        name: 'User Registration',
        description: 'Test the complete user registration flow',
        steps: [
          'Navigate to registration page',
          'Fill out registration form with valid data',
          'Submit the form',
          'Verify email (if required)',
          'Complete profile setup',
          'Access dashboard after registration'
        ]
      },
      {
        name: 'Merchant Onboarding',
        description: 'Test the complete merchant onboarding flow',
        steps: [
          'Register as a merchant',
          'Complete business profile',
          'Upload required documents',
          'Verify business information',
          'Set up payment methods',
          'Complete onboarding checklist'
        ]
      },
      {
        name: 'Payment Processing',
        description: 'Test the complete payment processing flow',
        steps: [
          'Create a new transaction',
          'Select payment method',
          'Process payment',
          'Verify payment confirmation',
          'Check receipt generation',
          'Verify transaction appears in merchant dashboard'
        ]
      }
    ];
    
    return userJourneys.map(journey => 
      this.generateUserJourneyPlan(journey.name, journey.description, journey.steps)
    );
  }
}
