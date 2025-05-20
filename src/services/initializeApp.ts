
import { supabase } from '@/integrations/supabase/client';
import logger from '@/utils/logging';
import { monitoring } from '@/services/monitoring/monitoringService';
import { getCurrentEnvironment, isProduction } from '@/config/environment';
import { DeploymentEnvironment } from '@/types/enums';

/**
 * Initialize the application with proper environment settings
 * Sets up monitoring, logging, and other environment-specific configurations
 */
export const initializeApp = async (): Promise<void> => {
  try {
    const environment = getCurrentEnvironment();
    
    // Log application startup
    logger.info('Application initializing', { 
      environment,
      version: import.meta.env.VITE_APP_VERSION || '1.0.0'
    });
    
    // Initialize monitoring for production and staging
    if (environment !== DeploymentEnvironment.DEVELOPMENT) {
      monitoring.initialize({
        enabled: true,
        sampleRate: environment === DeploymentEnvironment.PRODUCTION ? 0.1 : 0.5,
        alertThreshold: environment === DeploymentEnvironment.PRODUCTION ? 2000 : 5000
      });
      
      logger.info('Monitoring initialized', {
        enabled: true,
        environment
      });
    }
    
    // Verify authentication is working
    try {
      const { data: { session } } = await supabase.auth.getSession();
      logger.info('Auth session check', { 
        isAuthenticated: !!session
      });
    } catch (error) {
      logger.error('Failed to check authentication session', { error });
    }
    
    // Register performance tracking for page navigations if in production
    if (isProduction()) {
      try {
        // Use Performance Navigation Timing API if available
        const performanceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              monitoring.trackPerformance('page_load', navEntry.loadEventEnd - navEntry.startTime, {
                url: window.location.pathname,
                type: 'navigation'
              });
            }
          });
        });
        
        performanceObserver.observe({ entryTypes: ['navigation'] });
        logger.info('Navigation performance tracking enabled');
      } catch (error) {
        logger.warn('Could not initialize performance observer', { error });
      }
    }
    
    // Record application initialization success
    logger.info('Application initialized successfully', { environment });
    
    // Return promise to ensure initialization completes
    return Promise.resolve();
  } catch (error) {
    console.error('Application initialization failed:', error);
    logger.critical('Application initialization failed', { error });
    return Promise.reject(error);
  }
};

export default initializeApp;
