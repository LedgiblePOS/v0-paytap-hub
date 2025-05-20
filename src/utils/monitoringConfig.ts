
/**
 * Centralized configuration for application monitoring
 * 
 * This file serves as the single source of truth for monitoring configuration
 * across different environments and services.
 */

import { DeploymentEnvironment, LogLevel } from '@/types/enums';

// Detect environment
export const getEnvironment = (): DeploymentEnvironment => {
  const env = import.meta.env.VITE_APP_ENV || 'development';
  
  switch (env.toLowerCase()) {
    case 'production':
      return DeploymentEnvironment.PRODUCTION;
    case 'staging':
      return DeploymentEnvironment.STAGING;
    default:
      return DeploymentEnvironment.DEVELOPMENT;
  }
};

// Environment flags
export const isProduction = (): boolean => getEnvironment() === DeploymentEnvironment.PRODUCTION;
export const isStaging = (): boolean => getEnvironment() === DeploymentEnvironment.STAGING;
export const isDevelopment = (): boolean => getEnvironment() === DeploymentEnvironment.DEVELOPMENT;

// Feature flags from environment variables
export const getFeatureFlag = (name: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[`VITE_FEATURE_${name.toUpperCase()}`];
  return value ? value === 'true' : defaultValue;
};

// Monitoring configuration
export const monitoringConfig = {
  // Error monitoring configuration
  errorMonitoring: {
    // Whether to send errors to the backend
    enabled: isProduction() || isStaging(),
    
    // Error sampling rate (0-1)
    samplingRate: isProduction() ? 1.0 : 0.5,
    
    // Minimum error severity to track
    minimumSeverity: isProduction() ? LogLevel.ERROR : LogLevel.WARNING,
    
    // API endpoint for error reporting
    endpoint: isProduction() 
      ? 'https://api.example.com/errors' 
      : 'https://staging-api.example.com/errors',
    
    // Whether to include user information in error reports
    includeUserInfo: true,
    
    // Whether to capture console errors
    captureConsoleErrors: isProduction() || isStaging(),
    
    // Maximum errors to buffer before sending
    bufferSize: isProduction() ? 10 : 5,
    
    // Interval to flush error buffer (ms)
    flushInterval: isProduction() ? 30000 : 10000
  },
  
  // Performance monitoring configuration
  performanceMonitoring: {
    // Whether to monitor performance
    enabled: isProduction() || isStaging(),
    
    // Trace sampling rate (0-1)
    traceSamplingRate: isProduction() ? 0.1 : 0.5,
    
    // API endpoint for performance data
    endpoint: isProduction()
      ? 'https://api.example.com/performance'
      : 'https://staging-api.example.com/performance',
    
    // Whether to track page load performance
    trackPageLoad: true,
    
    // Whether to track API call performance
    trackApiCalls: true,
    
    // Whether to track component render performance
    trackComponentRender: isStaging(),
    
    // Minimum duration to consider slow (ms)
    slowThreshold: isProduction() ? 1000 : 500
  },
  
  // User activity tracking configuration
  userTracking: {
    // Whether to track user activity
    enabled: getFeatureFlag('ENABLE_USER_TRACKING', isProduction()),
    
    // Whether to track clicks
    trackClicks: isProduction(),
    
    // Whether to track page views
    trackPageViews: true,
    
    // Whether to track feature usage
    trackFeatureUsage: true,
    
    // Session idle timeout (ms)
    sessionIdleTimeout: 30 * 60 * 1000, // 30 minutes
    
    // User ID storage key
    userIdStorageKey: 'app_user_id',
    
    // Session ID storage key
    sessionIdStorageKey: 'app_session_id'
  },
  
  // Audit logging configuration
  auditLogging: {
    // Whether to log audit events
    enabled: isProduction() || isStaging(),
    
    // API endpoint for audit logs
    endpoint: isProduction()
      ? 'https://api.example.com/audit'
      : 'https://staging-api.example.com/audit',
    
    // Events to always log
    criticalEvents: [
      'login',
      'logout',
      'password_change',
      'permission_change',
      'payment_process',
      'data_export'
    ]
  }
};

export default monitoringConfig;
