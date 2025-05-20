
/**
 * Security testing utilities
 */

import { validateCSRFToken, generateCSRFToken } from "@/utils/security/csrf";
import { securityHeaders } from "@/services/api/apiHeaders";

/**
 * Test CSRF token generation and validation
 */
export const testCSRFProtection = (): { valid: boolean; message: string } => {
  try {
    // Generate a token
    const token = generateCSRFToken();
    
    // Validate the same token (should pass)
    const isValidSameToken = validateCSRFToken(token, token);
    if (!isValidSameToken) {
      return { valid: false, message: 'CSRF validation failed for matching tokens' };
    }
    
    // Validate with different token (should fail)
    const differentToken = generateCSRFToken();
    const isValidDifferentToken = validateCSRFToken(token, differentToken);
    if (isValidDifferentToken) {
      return { valid: false, message: 'CSRF validation incorrectly passed for non-matching tokens' };
    }
    
    // Validate with null token (should fail)
    const isValidNullToken = validateCSRFToken(null, token);
    if (isValidNullToken) {
      return { valid: false, message: 'CSRF validation incorrectly passed for null token' };
    }
    
    return { valid: true, message: 'CSRF protection is working correctly' };
  } catch (error) {
    return { valid: false, message: `CSRF test failed with error: ${error}` };
  }
};

/**
 * Verify that all required security headers are present
 */
export const verifySecurityHeaders = (headers: Record<string, string>): { 
  valid: boolean;
  missingHeaders: string[];
  message: string;
} => {
  const requiredHeaders = Object.keys(securityHeaders);
  const missingHeaders = requiredHeaders.filter(header => !headers[header]);
  
  if (missingHeaders.length > 0) {
    return {
      valid: false,
      missingHeaders,
      message: `Missing required security headers: ${missingHeaders.join(', ')}`
    };
  }
  
  // Check for Content-Security-Policy specifically
  if (!headers['Content-Security-Policy']) {
    return {
      valid: false,
      missingHeaders: ['Content-Security-Policy'],
      message: 'Missing Content-Security-Policy header'
    };
  }
  
  return {
    valid: true,
    missingHeaders: [],
    message: 'All security headers are present'
  };
};

/**
 * Test rate limiting functionality
 */
export const testRateLimiting = (
  rateLimitFn: (clientId: string) => boolean,
  recordAttemptFn: (clientId: string) => void,
  resetFn: (clientId: string) => void,
  maxAttempts = 5
): { valid: boolean; message: string } => {
  try {
    const testClientId = `test-${Date.now()}`;
    
    // Reset any previous test data
    resetFn(testClientId);
    
    // Should not be rate-limited initially
    if (rateLimitFn(testClientId)) {
      return { valid: false, message: 'Rate limiter incorrectly limiting on first attempt' };
    }
    
    // Record attempts up to the limit
    for (let i = 0; i < maxAttempts; i++) {
      recordAttemptFn(testClientId);
    }
    
    // Should now be rate-limited
    if (!rateLimitFn(testClientId)) {
      return { valid: false, message: `Rate limiter failed to limit after ${maxAttempts} attempts` };
    }
    
    // Reset and verify limiter is cleared
    resetFn(testClientId);
    if (rateLimitFn(testClientId)) {
      return { valid: false, message: 'Rate limiter failed to reset' };
    }
    
    return { valid: true, message: 'Rate limiting is working correctly' };
  } catch (error) {
    return { valid: false, message: `Rate limiting test failed with error: ${error}` };
  }
};

/**
 * Run all security tests
 */
export const runSecurityTests = () => {
  const results = {
    csrf: testCSRFProtection(),
    // Additional tests would be implemented here
  };
  
  return results;
};
