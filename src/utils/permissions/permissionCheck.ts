
import { User } from "@/types";
import { UserRole } from "@/types/user";
import { Permission, ROLE_PERMISSIONS } from "./types";

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  user: User | null, 
  permission: Permission,
  resourceId?: string
): boolean {
  if (!user) return false;
  
  // Super admins have all permissions
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Check if the user's role has the required permission
  const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole];
  if (!rolePermissions) return false;
  
  return rolePermissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: Permission[]
): boolean {
  if (!user || permissions.length === 0) return false;
  
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null,
  permissions: Permission[]
): boolean {
  if (!user || permissions.length === 0) return false;
  
  return permissions.every(permission => hasPermission(user, permission));
}
