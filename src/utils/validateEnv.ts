
import logger from '@/utils/logging';
import { isProduction } from '@/config/environment';

/**
 * Required environment variables for the application
 */
const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

/**
 * Production-only required environment variables
 */
const PRODUCTION_REQUIRED_ENV_VARS = [
  'VITE_APP_ENV'
];

/**
 * Validates that all required environment variables are present
 * Returns true if all required variables are present, false otherwise
 */
export function validateEnvironmentVariables(): boolean {
  const envVarChecks: Record<string, boolean> = {};
  let allValid = true;
  
  // Check all required environment variables
  REQUIRED_ENV_VARS.forEach(varName => {
    const isPresent = !!import.meta.env[varName];
    envVarChecks[varName] = isPresent;
    
    if (!isPresent) {
      allValid = false;
      logger.error(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Check production-only required variables if in production
  if (isProduction()) {
    PRODUCTION_REQUIRED_ENV_VARS.forEach(varName => {
      const isPresent = !!import.meta.env[varName];
      envVarChecks[varName] = isPresent;
      
      if (!isPresent) {
        allValid = false;
        logger.error(`Missing production required environment variable: ${varName}`);
      }
    });
  }
  
  // Log environment validation results
  if (allValid) {
    logger.info('Environment variable validation passed');
  } else {
    logger.error('Environment variable validation failed', { envVarChecks });
  }
  
  return allValid;
}

export default validateEnvironmentVariables;
