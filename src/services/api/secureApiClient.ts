
import { supabase } from '@/integrations/supabase/client';
import { addCSRFToHeaders, getCSRFToken } from '@/utils/security/csrf';
import { apiRateLimiter, sensitiveOperationLimiter } from '@/utils/RateLimiter';
import logger from '@/utils/logging';
import enhancedAuditService, { AuditSeverity } from '@/services/enhancedAuditService';

// Security headers to include with every request
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};

// HTTP request method types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request options interface
interface RequestOptions {
  method?: HttpMethod;
  body?: BodyInit | null;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  sensitive?: boolean; // Flag for sensitive operations
}

// Error response type
interface ErrorResponse {
  status: number;
  message: string;
  details?: any;
}

/**
 * Secure API client with built-in security features
 */
class SecureApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...securityHeaders
    };
  }
  
  /**
   * Make a secure API request with rate limiting, CSRF protection
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body = null, headers = {}, credentials = 'same-origin', sensitive = false } = options;
    
    // Get client IP (or a session identifier if IP not available)
    const clientIdentifier = localStorage.getItem('session_id') || 'anonymous';
    
    // Apply rate limiting
    const limiter = sensitive ? sensitiveOperationLimiter : apiRateLimiter;
    if (limiter.isRateLimited(clientIdentifier)) {
      // Log rate limit breach
      enhancedAuditService.logSecurityEvent({
        action: 'RATE_LIMIT_EXCEEDED',
        description: `Rate limit exceeded for endpoint: ${endpoint}`,
        userId: (await supabase.auth.getUser()).data.user?.id,
        severity: AuditSeverity.WARNING,
        metadata: { endpoint, method }
      });
      
      throw new Error('Too many requests');
    }
    
    // Always record an attempt
    limiter.recordAttempt(clientIdentifier);
    
    // Apply CSRF protection for state-changing operations
    const csrfProtectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    const requestHeaders = { 
      ...this.defaultHeaders,
      ...headers
    };
    
    if (csrfProtectedMethods.includes(method)) {
      Object.assign(requestHeaders, addCSRFToHeaders(requestHeaders));
    }
    
    // Start measuring response time
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body,
        credentials
      });
      
      // Calculate response time
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log all API calls for audit and performance monitoring
      logger.debug(`API ${method} ${endpoint}`, {
        responseTime: `${responseTime.toFixed(2)}ms`,
        status: response.status
      });
      
      // Handle API errors
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          status: response.status,
          message: response.statusText
        }));
        
        // Log critical failures
        if (response.status >= 500) {
          enhancedAuditService.logSecurityEvent({
            action: 'API_ERROR',
            description: `API error: ${errorData.message}`,
            userId: (await supabase.auth.getUser()).data.user?.id,
            severity: AuditSeverity.ERROR,
            metadata: { endpoint, status: response.status, error: errorData }
          });
        }
        
        throw errorData;
      }
      
      // Return the response data
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error) {
      // Log and rethrow errors
      logger.error(`API request failed: ${endpoint}`, { error });
      throw error;
    }
  }
  
  // Convenience methods for common HTTP verbs
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  async post<T = any>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async put<T = any>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
  
  async patch<T = any>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}

// Export a singleton instance
const secureApiClient = new SecureApiClient();
export default secureApiClient;
