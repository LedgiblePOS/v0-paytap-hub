
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Permission } from "@/utils/permissions/types";
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/utils/permissions/permissionCheck";

/**
 * Hook for checking permissions in components
 */
export function usePermissions() {
  const { user } = useAuth();
  
  const can = useCallback((permission: Permission, resourceId?: string) => {
    return hasPermission(user, permission, resourceId);
  }, [user]);
  
  const canAny = useCallback((permissions: Permission[]) => {
    return hasAnyPermission(user, permissions);
  }, [user]);
  
  const canAll = useCallback((permissions: Permission[]) => {
    return hasAllPermissions(user, permissions);
  }, [user]);
  
  return {
    can,
    canAny,
    canAll
  };
}
