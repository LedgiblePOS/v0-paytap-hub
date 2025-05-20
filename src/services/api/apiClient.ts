
import { supabase } from "@/integrations/supabase/client";
import { securityHeaders } from "./apiHeaders";
import { loginRateLimiter, apiRateLimiter } from "@/utils/RateLimiter";
import { refreshTokenIfNeeded } from "@/utils/security/tokenValidator";
import enhancedAuditService, { AuditSeverity } from "@/services/enhancedAuditService";

interface ApiClientOptions {
  csrfToken?: string;
  skipRateLimit?: boolean;
  priority?: 'high' | 'normal' | 'low';
  timeout?: number;
}

/**
 * Centralized API client for handling all fetch requests
 * Implements security measures like CSRF protection, rate limiting,
 * authentication, and security headers
 */
class ApiClient {
  private static instance: ApiClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private readonly defaultTimeout = 30000; // 30 seconds
  
  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Make an authenticated API request with security headers and rate limiting
   */
  async request<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<T> {
    const { 
      csrfToken, 
      skipRateLimit = false, 
      priority = 'normal', 
      timeout = this.defaultTimeout,
      ...requestOptions 
    } = options;

    // Generate request ID for tracing
    const requestId = crypto.randomUUID();

    try {
      // Apply rate limiting for all endpoints
      if (!skipRateLimit) {
        // Use different rate limiting strategies based on endpoint sensitivity
        if (this.shouldApplyStrictRateLimit(endpoint)) {
          const clientId = await this.getClientIdentifier();
          if (loginRateLimiter.isRateLimited(clientId)) {
            this.logRateLimitExceeded(endpoint, clientId);
            throw new Error('Too many authentication attempts. Please try again later.');
          }
          loginRateLimiter.recordAttempt(clientId);
        } else {
          // Apply general API rate limiting
          const clientId = await this.getClientIdentifier();
          if (apiRateLimiter.isRateLimited(clientId)) {
            this.logRateLimitExceeded(endpoint, clientId);
            throw new Error('Too many requests. Please try again later.');
          }
          apiRateLimiter.recordAttempt(clientId);
        }
      }
      
      // Add security headers
      requestOptions.headers = {
        ...requestOptions.headers,
        ...securityHeaders,
        'X-Request-ID': requestId
      };

      // Add CSRF token to headers for non-GET requests
      if (options.method && options.method !== 'GET') {
        requestOptions.headers = {
          ...requestOptions.headers,
          'X-CSRF-Token': csrfToken || '',
        };
      }

      // Add session token if authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        // Check if token needs refreshing
        const token = await refreshTokenIfNeeded() || session.access_token;
        
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${timeout}ms`));
        }, timeout);
      });

      // Make the actual fetch request with timeout
      const response = await Promise.race([
        fetch(endpoint, requestOptions),
        timeoutPromise
      ]) as Response;
      
      if (!response.ok) {
        // Log API errors
        await this.logApiError(endpoint, response.status, response.statusText, requestId);
        
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      // Log and rethrow error
      console.error(`API request to ${endpoint} failed:`, error);
      
      await enhancedAuditService.logSecurityEvent({
        action: 'API_REQUEST_FAILED',
        description: `API request to ${endpoint} failed: ${error instanceof Error ? error.message : String(error)}`,
        userId: await this.getUserId(),
        severity: AuditSeverity.WARNING,
        metadata: { endpoint, requestId }
      });
      
      throw error;
    }
  }

  /**
   * Check if strict rate limiting should be applied
   */
  private shouldApplyStrictRateLimit(endpoint: string): boolean {
    const sensitiveEndpoints = [
      '/auth/login', 
      '/auth/register', 
      '/auth/reset-password', 
      '/auth/change-password',
      '/admin/'
    ];
    return sensitiveEndpoints.some(e => endpoint.includes(e));
  }

  /**
   * Apply standard rate limiting to non-auth endpoints
   */
  private shouldApplyRateLimit(endpoint: string): boolean {
    return !endpoint.startsWith('/public/');
  }

  /**
   * Get client identifier for rate limiting
   */
  private async getClientIdentifier(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || 'anonymous';
  }

  /**
   * Get current user ID
   */
  private async getUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  }

  /**
   * Log rate limit exceeded events
   */
  private async logRateLimitExceeded(endpoint: string, clientId: string): Promise<void> {
    await enhancedAuditService.logSecurityEvent({
      action: 'RATE_LIMIT_EXCEEDED',
      description: `Rate limit exceeded for endpoint: ${endpoint}`,
      userId: await this.getUserId(),
      severity: AuditSeverity.WARNING,
      metadata: { endpoint, clientId }
    });
  }

  /**
   * Log API errors
   */
  private async logApiError(
    endpoint: string, 
    status: number, 
    statusText: string,
    requestId: string
  ): Promise<void> {
    await enhancedAuditService.logSecurityEvent({
      action: 'API_ERROR',
      description: `API request failed: ${status} ${statusText}`,
      userId: await this.getUserId(),
      severity: status >= 500 ? AuditSeverity.ERROR : AuditSeverity.WARNING,
      metadata: { endpoint, status, statusText, requestId }
    });
  }
}

export const apiClient = ApiClient.getInstance();
