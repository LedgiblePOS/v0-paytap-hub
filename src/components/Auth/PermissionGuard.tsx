import React from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/utils/permissions/types";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that conditionally renders children based on user permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback
}) => {
  const { can } = usePermissions();
  
  // Check if user has permission
  const hasPermission = can(permission);
  
  // If user has permission, render children
  if (hasPermission) {
    return <>{children}</>;
  }
  
  // Otherwise, render fallback or null
  return fallback ? <>{fallback}</> : null;
};

export default PermissionGuard;
