
import { DeploymentEnvironment } from '@/types/enums';

interface DeploymentConfig {
  environment: DeploymentEnvironment;
  apiBaseUrl: string;
  cdnUrl: string;
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
  analyticsEnabled: boolean;
  featureFlags: Record<string, boolean>;
  cacheTTL: number;
  batchSize: number;
  timeout: number;
}

/**
 * Default configuration for staging environment
 */
export const stagingConfig: DeploymentConfig = {
  environment: DeploymentEnvironment.STAGING,
  apiBaseUrl: import.meta.env.VITE_API_URL || 'https://staging-api.example.com',
  cdnUrl: 'https://staging-cdn.example.com',
  loggingLevel: 'info',
  analyticsEnabled: true,
  featureFlags: {
    newDashboard: true,
    advancedAnalytics: true,
    betaFeatures: true,
  },
  cacheTTL: 300, // seconds
  batchSize: 100,
  timeout: 30000, // ms
};

/**
 * Default configuration for production environment
 */
export const productionConfig: DeploymentConfig = {
  environment: DeploymentEnvironment.PRODUCTION,
  apiBaseUrl: import.meta.env.VITE_API_URL || 'https://api.example.com',
  cdnUrl: 'https://cdn.example.com',
  loggingLevel: 'error',
  analyticsEnabled: true,
  featureFlags: {
    newDashboard: true,
    advancedAnalytics: true,
    betaFeatures: false,
  },
  cacheTTL: 600, // seconds
  batchSize: 50,
  timeout: 15000, // ms
};

/**
 * Default configuration for development environment
 */
export const developmentConfig: DeploymentConfig = {
  environment: DeploymentEnvironment.DEVELOPMENT,
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  cdnUrl: '/',
  loggingLevel: 'debug',
  analyticsEnabled: false,
  featureFlags: {
    newDashboard: true,
    advancedAnalytics: true,
    betaFeatures: true,
  },
  cacheTTL: 0, // no cache in development
  batchSize: 10,
  timeout: 60000, // ms
};

/**
 * Get the current deployment configuration based on environment
 */
export function getDeploymentConfig(): DeploymentConfig {
  const envName = import.meta.env.VITE_APP_ENV?.toLowerCase() || 'development';
  
  switch (envName) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    default:
      return developmentConfig;
  }
}

export default getDeploymentConfig();
