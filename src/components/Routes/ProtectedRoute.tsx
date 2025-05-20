
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

/**
 * Props for the ProtectedRoute component
 * @property {React.ReactNode} children - Component or elements to render if authorized
 * @property {UserRole | UserRole[]} [permission] - Required permission(s) to access this route
 * @property {string} [redirectTo="/auth"] - Where to redirect if not authenticated
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: UserRole | UserRole[];
  redirectTo?: string;
}

/**
 * Route component that requires authentication and optional permissions
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  redirectTo = '/auth',
}) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check permissions if required
  if (permission) {
    // Permission can be a UserRole or an array of UserRoles
    const permissionsToCheck = Array.isArray(permission) ? permission : [permission];
    
    // If any required permission is not met, redirect to dashboard or unauthorized page
    if (!hasPermission(permissionsToCheck)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
