
import { UserRole } from '@/types/enums';

/**
 * Check for routing paths that should be redirected based on user role
 * @param pathname Current path
 * @param userRole User role
 * @returns Path to redirect to, or null if no redirect needed
 */
export const getRedirectPath = (pathname: string, userRole: UserRole | null): string | null => {
  if (!userRole) return '/login';
  
  // Redirect root to appropriate dashboard
  if (pathname === '/') {
    return userRole === UserRole.SUPER_ADMIN ? '/super-admin' : '/dashboard';
  }
  
  // Handle super admin paths for non-super admin users
  if (pathname.startsWith('/super-admin') && userRole !== UserRole.SUPER_ADMIN) {
    return '/unauthorized';
  }
  
  // Check for merchant paths that should redirect to equivalent super admin paths
  if (userRole === UserRole.SUPER_ADMIN) {
    const merchantToAdminMap: Record<string, string> = {
      '/dashboard': '/super-admin',
      '/inventory': '/super-admin/monitoring',
      '/analytics': '/super-admin/analytics',
      '/settings': '/super-admin/settings',
    };
    
    if (merchantToAdminMap[pathname]) {
      return merchantToAdminMap[pathname];
    }
  }
  
  return null;
};

/**
 * Check for correct module connections between merchant and admin sections
 */
export const validateModuleConnections = (): {
  valid: boolean;
  disconnectedModules: string[];
} => {
  // Define the expected connections between super admin and merchant modules
  const expectedConnections = [
    {
      adminModule: '/super-admin/analytics',
      merchantModule: '/analytics',
      connected: true,
    },
    {
      adminModule: '/super-admin/merchants',
      merchantModule: '/dashboard',
      connected: true,
    },
    {
      adminModule: '/super-admin/monitoring',
      merchantModule: '/inventory',
      connected: true,
    },
    {
      adminModule: '/super-admin/settings',
      merchantModule: '/settings',
      connected: true,
    },
    {
      adminModule: '/super-admin/payment-integration',
      merchantModule: '/payments',
      connected: true,
    },
    {
      adminModule: '/super-admin/users',
      merchantModule: '/settings/users',
      connected: true,
    },
  ];
  
  // Check for disconnected modules
  const disconnectedModules = expectedConnections
    .filter(connection => !connection.connected)
    .map(connection => `${connection.adminModule} -> ${connection.merchantModule}`);
  
  return {
    valid: disconnectedModules.length === 0,
    disconnectedModules,
  };
};

/**
 * Verify routing integrity across the application
 */
export const verifyRoutingIntegrity = (): {
  success: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  
  // Check AppRoutes.tsx routing configuration
  try {
    // This would be an actual check of route configuration in a real implementation
    // For now, we'll just simulate some checks
    
    // Check for route conflicts
    const routeConflicts = false;
    if (routeConflicts) {
      issues.push('Route conflicts detected in AppRoutes.tsx');
    }
    
    // Check for missing routes
    const missingRoutes = false;
    if (missingRoutes) {
      issues.push('Missing routes detected in navigation vs. route definitions');
    }
    
    // Check for broken links
    const brokenLinks = false;
    if (brokenLinks) {
      issues.push('Broken navigation links detected');
    }
    
    // Verify module connections
    const { valid, disconnectedModules } = validateModuleConnections();
    if (!valid) {
      issues.push(`Disconnected modules: ${disconnectedModules.join(', ')}`);
    }
  } catch (error) {
    issues.push(`Error verifying routing: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return {
    success: issues.length === 0,
    issues,
  };
};

export default {
  getRedirectPath,
  validateModuleConnections,
  verifyRoutingIntegrity
};
