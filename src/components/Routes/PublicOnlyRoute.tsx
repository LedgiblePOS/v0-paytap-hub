
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/enums';

interface PublicOnlyRouteProps {
  redirectTo?: string;
}

/**
 * Route that is only accessible when the user is NOT logged in.
 * If user is logged in, they will be redirected to the specified path or dashboard.
 */
const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ redirectTo = '/dashboard' }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking authentication
    return <div>Loading authentication status...</div>;
  }

  // If user is authenticated, redirect them
  if (isAuthenticated) {
    // Handle redirects for specific user roles
    if (user?.role === UserRole.SUPER_ADMIN) {
      return <Navigate to="/super-admin" replace state={{ from: location }} />;
    }
    
    // Default redirect for other authenticated users
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // If not authenticated, render the child routes
  return <Outlet />;
};

export default PublicOnlyRoute;
