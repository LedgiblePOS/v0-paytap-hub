
/**
 * Route validator utility
 * Checks if routes between merchant and super admin sections are properly connected
 */

import { User } from '@/types/user';
import { UserRole } from '@/types/enums';

/**
 * Validates if the user has access to a specific route based on role
 */
export const validateRouteAccess = (
  user: User | null, 
  pathname: string
): { 
  hasAccess: boolean; 
  redirectTo?: string;
} => {
  if (!user) {
    // User is not logged in, redirect to login
    return {
      hasAccess: false,
      redirectTo: '/login'
    };
  }

  // Check for super admin routes
  if (pathname.startsWith('/super-admin')) {
    if (user.role !== UserRole.SUPER_ADMIN) {
      return {
        hasAccess: false,
        redirectTo: '/unauthorized'
      };
    }
    return { hasAccess: true };
  }

  // Check for admin-only routes in the merchant section
  const adminOnlyRoutes = [
    '/settings/users',
    '/settings/advanced',
    '/settings/backup',
  ];

  if (adminOnlyRoutes.some(route => pathname.startsWith(route))) {
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN) {
      return {
        hasAccess: false,
        redirectTo: '/unauthorized'
      };
    }
  }

  return { hasAccess: true };
};

/**
 * Maps merchant routes to their super admin equivalents
 */
export const getMerchantToAdminRoute = (merchantRoute: string): string | null => {
  const routeMapping: Record<string, string> = {
    '/dashboard': '/super-admin',
    '/inventory': '/super-admin/monitoring',
    '/customers': '/super-admin/users',
    '/analytics': '/super-admin/analytics',
    '/settings': '/super-admin/settings',
    '/settings/users': '/super-admin/user-management',
    '/payments': '/super-admin/payment-integration'
  };

  // Check for exact matches
  if (routeMapping[merchantRoute]) {
    return routeMapping[merchantRoute];
  }

  // Check for prefix matches
  for (const [merchant, admin] of Object.entries(routeMapping)) {
    if (merchantRoute.startsWith(`${merchant}/`)) {
      return `${admin}${merchantRoute.substring(merchant.length)}`;
    }
  }

  return null;
};

/**
 * Maps super admin routes to their merchant equivalents
 */
export const getAdminToMerchantRoute = (adminRoute: string): string | null => {
  // Remove the '/super-admin' prefix if present
  const normalizedRoute = adminRoute.startsWith('/super-admin')
    ? adminRoute.substring('/super-admin'.length)
    : adminRoute;
  
  if (!normalizedRoute || normalizedRoute === '/') {
    return '/dashboard';
  }
  
  const routeMapping: Record<string, string> = {
    '/analytics': '/analytics',
    '/monitoring': '/inventory',
    '/settings': '/settings',
    '/user-management': '/settings/users',
    '/payment-integration': '/payments'
  };

  // Check for exact matches
  if (routeMapping[normalizedRoute]) {
    return routeMapping[normalizedRoute];
  }

  // Check for prefix matches
  for (const [admin, merchant] of Object.entries(routeMapping)) {
    if (normalizedRoute.startsWith(`${admin}/`)) {
      return `${merchant}${normalizedRoute.substring(admin.length)}`;
    }
  }

  // Default to dashboard for any unmapped routes
  return '/dashboard';
};

export default {
  validateRouteAccess,
  getMerchantToAdminRoute,
  getAdminToMerchantRoute
};
