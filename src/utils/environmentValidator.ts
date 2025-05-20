
import logger from '@/utils/logging';
import { isProduction } from '@/config/environment';

/**
 * Required environment variables for different environments
 */
export const ENVIRONMENT_REQUIREMENTS = {
  all: [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ],
  staging: [
    'VITE_APP_ENV',
    'VITE_API_URL',
  ],
  production: [
    'VITE_APP_ENV',
    'VITE_API_URL',
    'VITE_LOG_LEVEL',
    'VITE_MONITORING_ENABLED',
  ]
};

/**
 * Validates that environment variables are properly configured for the current environment
 */
export const validateEnvironmentForCurrentEnv = (): {
  valid: boolean;
  missingVars: string[];
  message: string;
} => {
  const currentEnv = import.meta.env.VITE_APP_ENV?.toLowerCase() || 'development';
  const requiredVars = [
    ...ENVIRONMENT_REQUIREMENTS.all,
    ...(currentEnv === 'production' ? ENVIRONMENT_REQUIREMENTS.production : []),
    ...(currentEnv === 'staging' ? ENVIRONMENT_REQUIREMENTS.staging : [])
  ];
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    logger.error(`Missing environment variables for ${currentEnv} environment:`, { missingVars });
  } else {
    logger.info(`Environment variable validation passed for ${currentEnv} environment`);
  }
  
  return {
    valid: missingVars.length === 0,
    missingVars,
    message: missingVars.length === 0
      ? `All required environment variables are set for ${currentEnv} environment`
      : `Missing environment variables for ${currentEnv}: ${missingVars.join(', ')}`
  };
};

/**
 * Ensures secure environment variables are not exposed
 */
export const checkForExposedSecrets = (): {
  secure: boolean;
  exposedSecrets: string[];
  message: string;
} => {
  // List of variables that should never be exposed to the client
  const sensitiveVarPatterns = [
    /password/i,
    /secret/i,
    /key$/i,
    /token$/i,
  ];
  
  // Check for any client-exposed variables that match sensitive patterns
  const exposedVars = Object.keys(import.meta.env)
    .filter(key => {
      // If this is a sensitive-looking variable that wasn't specifically allowed to be exposed
      return sensitiveVarPatterns.some(pattern => pattern.test(key))
        && key !== 'VITE_SUPABASE_ANON_KEY'; // This one is ok to expose
    });
  
  if (exposedVars.length > 0) {
    logger.warn('Potentially sensitive variables exposed to client:', { exposedVars });
  }
  
  return {
    secure: exposedVars.length === 0,
    exposedSecrets: exposedVars,
    message: exposedVars.length === 0
      ? 'No sensitive information exposed in client environment variables'
      : `Potentially sensitive variables exposed: ${exposedVars.join(', ')}`
  };
};

/**
 * Comprehensive environment configuration check for production readiness
 */
export const validateEnvironmentForProduction = (): {
  ready: boolean;
  checks: Record<string, any>;
} => {
  const checks: Record<string, any> = {};
  
  // 1. Check required environment variables
  checks.requiredVariables = validateEnvironmentForCurrentEnv();
  
  // 2. Check for exposed secrets
  checks.securityCheck = checkForExposedSecrets();
  
  // 3. Check environment-specific configuration
  if (isProduction()) {
    checks.productionSpecific = {
      valid: !!import.meta.env.VITE_MONITORING_ENABLED,
      message: import.meta.env.VITE_MONITORING_ENABLED
        ? 'Production monitoring is enabled'
        : 'Production monitoring should be enabled for production'
    };
  }
  
  // Determine overall readiness
  const isReady = Object.values(checks).every(
    (check: any) => check.valid !== false && check.secure !== false
  );
  
  return {
    ready: isReady,
    checks
  };
};

export default {
  validateEnvironmentForCurrentEnv,
  checkForExposedSecrets,
  validateEnvironmentForProduction
};
