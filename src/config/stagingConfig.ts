
import { LogLevel } from '@/types/enums';

/**
 * Staging environment configuration - mirrors production but allows for testing
 */
const stagingConfig = {
  // API endpoints
  apiEndpoints: {
    base: import.meta.env.VITE_API_URL || 'https://staging-api.example.com',
    auth: '/auth',
    payments: '/payments',
    merchants: '/merchants',
    products: '/products',
    customers: '/customers',
    analytics: '/analytics'
  },
  
  // Feature flags for staging environment
  features: {
    newDashboard: true,
    advancedAnalytics: true,
    betaFeatures: true,
    testAccounts: true
  },
  
  // Monitoring and logging settings for staging
  monitoring: {
    logLevel: LogLevel.INFO,
    errorReportingEnabled: true,
    performanceTrackingEnabled: true,
    userTrackingEnabled: true,
    sampleRate: 0.5 // Sample 50% of events
  },
  
  // Cache settings optimized for staging
  cache: {
    defaultTTL: 300, // 5 minutes in seconds
    refreshInterval: 60, // 1 minute in seconds
    staleWhileRevalidate: true
  },
  
  // Resource limits for staging environment
  resourceLimits: {
    maxConcurrentApiCalls: 10,
    maxItemsPerPage: 100,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxBatchSize: 50
  },
  
  // Testing specific configuration
  testing: {
    testUserEmails: ['test@example.com', 'qa@example.com'],
    mockedEndpoints: false,
    showTestingTools: true,
    verificationBypass: true
  },
  
  // Deployment settings
  deployment: {
    buildId: import.meta.env.VITE_BUILD_ID || 'staging-local',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    deployedAt: import.meta.env.VITE_DEPLOY_DATE || new Date().toISOString()
  }
};

export default stagingConfig;
