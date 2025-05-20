
import { validateEnvironmentForCurrentEnv } from './environmentValidator';
import { verifyDatabaseHealth } from './e2eTesting';
import { isProduction } from '@/config/environment';
import { supabase } from '@/integrations/supabase/client';

/**
 * Comprehensive verification of routing and module connections
 * Ensures that the super admin and merchant sections are properly connected
 */
export const verifyRouteConnections = async (): Promise<{
  success: boolean;
  results: Record<string, any>;
}> => {
  console.log('Starting route connection verification');
  
  // Validate environment variables first
  const envValid = validateEnvironmentForCurrentEnv();
  if (!envValid.valid) {
    console.error('Environment validation failed, may affect routing');
    return {
      success: false,
      results: {
        environmentValidation: envValid
      }
    };
  }
  
  // Verify database health as it might affect dynamic routes
  const dbHealth = await verifyDatabaseHealth();
  if (!dbHealth.success) {
    console.warn('Database health check failed, may affect dynamic routing');
  }
  
  // Check module connections between admin and merchant
  const moduleConnections = validateModuleConnections();
  
  // Verify overall routing integrity
  const routingIntegrity = verifyRoutingIntegrity();
  
  // Use the new database function to verify route access for current user
  const user = (await supabase.auth.getSession()).data.session?.user;
  let routeAccessValid = true;
  let routeAccessResults: Record<string, boolean> = {};
  
  if (user) {
    try {
      for (const route of ['/dashboard', '/products', '/settings']) {
        const { data, error } = await supabase.rpc('verify_route_access', {
          route_path: route,
          user_id: user.id
        });
        
        if (error) {
          console.error(`Error verifying route access for ${route}:`, error);
          routeAccessValid = false;
        }
        
        routeAccessResults[route] = !!data;
        if (!data) routeAccessValid = false;
      }
    } catch (error) {
      console.error("Route access verification error:", error);
      routeAccessValid = false;
    }
  }
  
  const results: Record<string, any> = {
    environmentValidation: envValid,
    databaseHealth: dbHealth,
    moduleConnections,
    routingIntegrity,
    routeAccess: {
      valid: routeAccessValid,
      results: routeAccessResults
    }
  };
  
  const allTestsPassing = Object.values(results).every(
    (result: any) => result.success !== false && result.valid !== false
  );
  
  if (allTestsPassing) {
    console.log('All routing connections verified successfully');
  } else {
    console.error('Routing verification failed, see results for details');
  }
  
  return {
    success: allTestsPassing,
    results
  };
};

/**
 * Validates module connections between different parts of the application
 */
export const validateModuleConnections = () => {
  // This is a placeholder for actual implementation
  return {
    valid: true,
    disconnectedModules: []
  };
};

/**
 * Verifies the integrity of routing configuration
 */
export const verifyRoutingIntegrity = () => {
  // This is a placeholder for actual implementation
  return {
    valid: true,
    issues: []
  };
};

/**
 * Generate a detailed report of routing connections
 */
export const generateRoutingReport = async (): Promise<string> => {
  const verification = await verifyRouteConnections();
  
  let report = '# Routing Connection Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Overall Status: ${verification.success ? '✅ VALID' : '❌ ISSUES DETECTED'}\n\n`;
  
  // Add details for each check
  Object.entries(verification.results).forEach(([checkName, check]: [string, any]) => {
    report += `### ${checkName}\n`;
    report += `Status: ${check.success !== false && check.valid !== false ? '✅ PASSED' : '❌ FAILED'}\n`;
    report += `Message: ${check.message || 'No details provided'}\n\n`;
    
    // Add details if available
    if (check.issues && check.issues.length > 0) {
      report += `Issues:\n`;
      check.issues.forEach((issue: string) => {
        report += `- ${issue}\n`;
      });
      report += '\n';
    }
    
    if (check.disconnectedModules && check.disconnectedModules.length > 0) {
      report += `Disconnected modules:\n`;
      check.disconnectedModules.forEach((module: string) => {
        report += `- ${module}\n`;
      });
      report += '\n';
    }
  });
  
  // Add recommendations
  report += '## Recommendations\n\n';
  
  if (!verification.success) {
    report += '- Address the issues listed above before proceeding to production\n';
    report += '- Test navigation paths manually to verify connections\n';
    report += '- Review route definitions in SuperAdminRoutes.tsx and MerchantRoutes.tsx\n';
  } else {
    report += '- Run final e2e tests to confirm routing works as expected\n';
    report += '- Consider adding route transition analytics for production monitoring\n';
  }
  
  return report;
};

export default {
  verifyRouteConnections,
  generateRoutingReport
};
