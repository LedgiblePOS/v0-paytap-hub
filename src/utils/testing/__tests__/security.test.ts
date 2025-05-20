
import { testCSRFProtection, verifySecurityHeaders } from '../securityTestUtils';
import { apiClient } from "@/services/api/apiClient";
import { securityHeaders } from "@/services/api/apiHeaders";
import { loginRateLimiter } from "@/utils/RateLimiter";

// Mock the modules
jest.mock('@/services/api/apiClient');
jest.mock('@/utils/RateLimiter');

describe('Security Testing', () => {
  describe('CSRF Protection', () => {
    it('should validate matching tokens', () => {
      const result = testCSRFProtection();
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Security Headers', () => {
    it('should detect missing headers', () => {
      // Test with missing header
      const headers = { ...securityHeaders };
      delete headers['X-Frame-Options'];
      
      const result = verifySecurityHeaders(headers);
      expect(result.valid).toBe(false);
      expect(result.missingHeaders).toContain('X-Frame-Options');
    });
    
    it('should validate complete headers', () => {
      // Test with all headers
      const headers = { 
        ...securityHeaders, 
        'Content-Security-Policy': "default-src 'self'"
      };
      
      const result = verifySecurityHeaders(headers);
      expect(result.valid).toBe(true);
      expect(result.missingHeaders.length).toBe(0);
    });
  });
  
  describe('API Client Security', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    it('should apply rate limiting to sensitive endpoints', async () => {
      // Setup mocks
      (loginRateLimiter.isRateLimited as jest.Mock).mockReturnValue(false);
      (apiClient.request as jest.Mock).mockResolvedValue({ success: true });
      
      // Make request to sensitive endpoint
      try {
        await apiClient.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        });
        
        // Check if rate limiting was checked
        expect(loginRateLimiter.isRateLimited).toHaveBeenCalled();
      } catch (error) {
        fail('Request should not have thrown an error');
      }
    });
    
    it('should block requests when rate limited', async () => {
      // Setup mocks
      (loginRateLimiter.isRateLimited as jest.Mock).mockReturnValue(true);
      
      // Make request that should be rate limited
      await expect(
        apiClient.request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        })
      ).rejects.toThrow('Too many requests');
    });
    
    it('should add security headers to requests', async () => {
      // Setup mocks
      (loginRateLimiter.isRateLimited as jest.Mock).mockReturnValue(false);
      (apiClient.request as jest.Mock).mockImplementation((endpoint, options) => {
        // Check for security headers
        const hasSecurityHeaders = Object.keys(securityHeaders).every(
          header => options.headers && header in options.headers
        );
        
        if (hasSecurityHeaders) {
          return Promise.resolve({ success: true });
        } else {
          return Promise.reject(new Error('Missing security headers'));
        }
      });
      
      // Make request
      const result = await apiClient.request('/api/test');
      expect(result).toEqual({ success: true });
    });
  });
});
