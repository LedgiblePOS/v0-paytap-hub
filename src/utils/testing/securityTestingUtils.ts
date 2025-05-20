
/**
 * Security Testing Utilities
 * 
 * Tools for testing application security and validating protection mechanisms
 */
export class SecurityTester {
  /**
   * Test CSRF protection
   * 
   * @param url The URL to test
   * @param method The HTTP method to use
   * @param validToken A valid CSRF token
   * @returns Test results
   */
  public static async testCSRFProtection(
    url: string,
    method: string = 'POST',
    validToken: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Test with valid token
      const validResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': validToken
        },
        body: JSON.stringify({ test: true })
      });
      
      if (!validResponse.ok) {
        return {
          success: false,
          message: `Request with valid token failed: ${validResponse.status}`
        };
      }
      
      // Test with invalid token
      const invalidResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'invalid-token'
        },
        body: JSON.stringify({ test: true })
      });
      
      if (invalidResponse.ok) {
        return {
          success: false,
          message: 'Request with invalid token succeeded, CSRF protection may be bypassed'
        };
      }
      
      // Test with missing token
      const missingResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      });
      
      if (missingResponse.ok) {
        return {
          success: false,
          message: 'Request with missing token succeeded, CSRF protection may be bypassed'
        };
      }
      
      return {
        success: true,
        message: 'CSRF protection is working correctly'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error testing CSRF protection: ${error}`
      };
    }
  }
  
  /**
   * Test XSS protection by attempting to inject a script
   * 
   * @param inputField The DOM element to test
   * @param xssPayload The XSS payload to inject
   */
  public static testXSSProtection(
    inputField: HTMLInputElement | HTMLTextAreaElement,
    xssPayload: string = '<script>alert("XSS")</script>'
  ): { success: boolean; message: string } {
    try {
      const originalValue = inputField.value;
      
      // Set the XSS payload
      inputField.value = xssPayload;
      
      // Trigger relevant events to propagate the value
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      inputField.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Check if a script tag was created or if the payload was sanitized
      const createdScripts = document.querySelectorAll(`script:contains("XSS")`);
      
      // Restore original value
      inputField.value = originalValue;
      inputField.dispatchEvent(new Event('input', { bubbles: true }));
      inputField.dispatchEvent(new Event('change', { bubbles: true }));
      
      if (createdScripts.length > 0) {
        return {
          success: false,
          message: 'XSS protection failed: Script tag was injected'
        };
      }
      
      return {
        success: true,
        message: 'XSS protection is working correctly'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error testing XSS protection: ${error}`
      };
    }
  }
  
  /**
   * Test authorization boundaries
   * 
   * @param url The URL to test
   * @param token User authentication token
   */
  public static async testAuthorizationBoundaries(
    url: string,
    token?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      
      if (!token && response.ok) {
        return {
          success: false,
          message: 'Unauthenticated access to protected resource succeeded'
        };
      }
      
      return {
        success: true,
        message: 'Authorization boundaries are properly enforced'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error testing authorization boundaries: ${error}`
      };
    }
  }
  
  /**
   * Generate a report of security test results
   */
  public static generateSecurityTestReport(
    results: Record<string, any>
  ): { passed: string[]; failed: string[]; report: string } {
    const passed: string[] = [];
    const failed: string[] = [];
    
    Object.entries(results).forEach(([testName, result]) => {
      if (result.success) {
        passed.push(testName);
      } else {
        failed.push(`${testName}: ${result.message}`);
      }
    });
    
    const totalTests = passed.length + failed.length;
    const passPercentage = Math.round((passed.length / totalTests) * 100);
    
    const report = `
      # Security Test Report
      
      Date: ${new Date().toLocaleDateString()}
      
      ## Summary
      - Total Tests: ${totalTests}
      - Passed: ${passed.length} (${passPercentage}%)
      - Failed: ${failed.length} (${100 - passPercentage}%)
      
      ## Failed Tests
      ${failed.length > 0 ? failed.map(f => `- ${f}`).join('\n') : 'All tests passed.'}
      
      ## Recommendations
      ${failed.length > 0 ? 'Review and address the failed security tests as soon as possible.' : 'Continue regular security testing to maintain application security.'}
    `;
    
    return { passed, failed, report };
  }
}

export default SecurityTester;
