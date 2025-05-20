
import { supabase } from "@/integrations/supabase/client";
import { securityHeaders } from "./apiHeaders";
import { loginRateLimiter, apiRateLimiter } from "@/utils/RateLimiter";
import { refreshTokenIfNeeded } from "@/utils/security/tokenValidator";
import enhancedAuditService, { AuditSeverity } from "@/services/enhancedAuditService";
import apiCacheService from "./apiCacheService";
import performanceMonitoringService from "@/services/monitoring/performanceMonitoringService";

interface ApiClientOptions {
  csrfToken?: string;
  skipRateLimit?: boolean;
  priority?: 'high' | 'normal' | 'low';
  timeout?: number;
  useCache?: boolean;
  cacheTtl?: number;
}

/**
 * Optimized API client for handling all fetch requests with improved performance
 */
class OptimizedApiClient {
  private static instance: OptimizedApiClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private readonly defaultTimeout = 30000; // 30 seconds
  
  private constructor() {}

  static getInstance(): OptimizedApiClient {
    if (!OptimizedApiClient.instance) {
      OptimizedApiClient.instance = new OptimizedApiClient();
    }
    return OptimizedApiClient.instance;
  }

  /**
   * Make an authenticated API request with caching and performance monitoring
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
      useCache = true,
      cacheTtl,
      ...requestOptions 
    } = options;

    // Generate request ID for tracing
    const requestId = crypto.randomUUID();
    
    // Start performance measurement
    const perfKey = `api-${endpoint.replace(/\//g, '-')}`;
    performanceMonitoringService.mark(perfKey);

    // Check cache for GET requests
    if (useCache && (!requestOptions.method || requestOptions.method === 'GET')) {
      const cacheKey = this.generateCacheKey(endpoint, requestOptions);
      const cachedData = apiCacheService.get<T>(cacheKey);
      
      if (cachedData) {
        console.log(`[API] Cache hit for ${endpoint}`);
        
        // Measure cache performance
        performanceMonitoringService.measure(`${perfKey}-cached`, perfKey);
        return cachedData;
      }
    }

    try {
      // Apply rate limiting for non-cached requests
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
      
      // Parse response
      const data = await response.json();
      
      // Cache the response for GET requests
      if (useCache && (!requestOptions.method || requestOptions.method === 'GET')) {
        const cacheKey = this.generateCacheKey(endpoint, requestOptions);
        apiCacheService.set(cacheKey, data, cacheTtl);
      }
      
      // Complete performance measurement
      performanceMonitoringService.measure(perfKey, perfKey);
      
      return data;
    } catch (error) {
      // Log error and performance failure
      performanceMonitoringService.measure(`${perfKey}-failed`, perfKey);
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
   * Generate a cache key for a request
   */
  private generateCacheKey(endpoint: string, options: RequestInit): string {
    const bodyStr = options.body ? JSON.stringify(options.body) : '';
    return `${endpoint}:${bodyStr}`;
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

  /**
   * Invalidate cache for a specific endpoint
   */
  invalidateCache(endpoint: string): void {
    apiCacheService.invalidateByPattern(endpoint);
  }
}

// Export a singleton instance
export const optimizedApiClient = OptimizedApiClient.getInstance();
