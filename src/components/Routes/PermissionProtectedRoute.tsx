
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Permission } from "@/utils/permissions/types";
import { hasPermission } from "@/utils/permissions/permissionCheck";
import { Loader2 } from "lucide-react";

interface PermissionProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
  fallbackPath?: string;
}

/**
 * Route wrapper that requires specific permissions to access
 */
const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  children,
  requiredPermission,
  fallbackPath = "/unauthorized"
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking permissions...</span>
      </div>
    );
  }
  
  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check permission
  const permitted = hasPermission(user, requiredPermission);
  
  if (!permitted) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Render the protected content
  return <>{children}</>;
};

export default PermissionProtectedRoute;
