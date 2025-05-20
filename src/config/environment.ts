import { DeploymentEnvironment, LogLevel } from '@/types/enums';

export interface EnvironmentConfig {
  name: DeploymentEnvironment;
  apiEndpoints: {
    base: string;
    auth: string;
    payments: string;
    merchants: string;
    products: string;
    customers: string;
    analytics: string;
  };
  logLevel: LogLevel;
  featureFlags: Record<string, boolean>;
  monitoring: {
    enabled: boolean;
    sampleRate: number;
    errorThreshold: number;
  };
}

/**
 * Get the current environment based on environment variables
 */
export const getCurrentEnvironment = (): DeploymentEnvironment => {
  const envName = import.meta.env.VITE_APP_ENV?.toLowerCase() || 'development';
  
  switch (envName) {
    case 'production':
      return DeploymentEnvironment.PRODUCTION;
    case 'staging':
      return DeploymentEnvironment.STAGING;
    case 'test':
      return DeploymentEnvironment.TEST;
    case 'development':
    default:
      return DeploymentEnvironment.DEVELOPMENT;
  }
};

/**
 * Check if the current environment is production
 */
export const isProduction = (): boolean => {
  return getCurrentEnvironment() === DeploymentEnvironment.PRODUCTION;
};

// Environment configuration
const environmentConfig: Record<DeploymentEnvironment, EnvironmentConfig> = {
  [DeploymentEnvironment.PRODUCTION]: {
    name: DeploymentEnvironment.PRODUCTION,
    apiEndpoints: {
      base: 'https://api.ledgible.app',
      auth: 'https://api.ledgible.app/auth',
      payments: 'https://api.ledgible.app/payments',
      merchants: 'https://api.ledgible.app/merchants',
      products: 'https://api.ledgible.app/products',
      customers: 'https://api.ledgible.app/customers',
      analytics: 'https://api.ledgible.app/analytics'
    },
    logLevel: LogLevel.ERROR,
    featureFlags: {
      enableAnalytics: true,
      enableNotifications: true,
      enableNewDashboard: true
    },
    monitoring: {
      enabled: true,
      sampleRate: 0.1,
      errorThreshold: 5
    }
  },
  [DeploymentEnvironment.STAGING]: {
    name: DeploymentEnvironment.STAGING,
    apiEndpoints: {
      base: 'https://staging-api.ledgible.app',
      auth: 'https://staging-api.ledgible.app/auth',
      payments: 'https://staging-api.ledgible.app/payments',
      merchants: 'https://staging-api.ledgible.app/merchants',
      products: 'https://staging-api.ledgible.app/products',
      customers: 'https://staging-api.ledgible.app/customers',
      analytics: 'https://staging-api.ledgible.app/analytics'
    },
    logLevel: LogLevel.WARNING,
    featureFlags: {
      enableAnalytics: true,
      enableNotifications: true,
      enableNewDashboard: true
    },
    monitoring: {
      enabled: true,
      sampleRate: 0.5,
      errorThreshold: 3
    }
  },
  [DeploymentEnvironment.DEVELOPMENT]: {
    name: DeploymentEnvironment.DEVELOPMENT,
    apiEndpoints: {
      base: 'http://localhost:8000',
      auth: 'http://localhost:8000/auth',
      payments: 'http://localhost:8000/payments',
      merchants: 'http://localhost:8000/merchants',
      products: 'http://localhost:8000/products',
      customers: 'http://localhost:8000/customers',
      analytics: 'http://localhost:8000/analytics'
    },
    logLevel: LogLevel.DEBUG,
    featureFlags: {
      enableAnalytics: true,
      enableNotifications: true,
      enableNewDashboard: false
    },
    monitoring: {
      enabled: false,
      sampleRate: 1.0,
      errorThreshold: 0
    }
  },
  // Adding the missing TEST environment
  [DeploymentEnvironment.TEST]: {
    name: DeploymentEnvironment.TEST,
    apiEndpoints: {
      base: 'http://localhost:8000',
      auth: 'http://localhost:8000/auth',
      payments: 'http://localhost:8000/payments',
      merchants: 'http://localhost:8000/merchants',
      products: 'http://localhost:8000/products',
      customers: 'http://localhost:8000/customers',
      analytics: 'http://localhost:8000/analytics'
    },
    logLevel: LogLevel.DEBUG,
    featureFlags: {
      enableAnalytics: false,
      enableNotifications: false,
      enableNewDashboard: false
    },
    monitoring: {
      enabled: false,
      sampleRate: 1.0,
      errorThreshold: 0
    }
  }
};

export default environmentConfig;
