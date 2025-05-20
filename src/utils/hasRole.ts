
import { User, UserRole } from '@/types/user';

/**
 * Checks if a user has a specified role
 * @param user The user to check
 * @param role The role or roles to check for
 * @returns True if the user has any of the specified roles
 */
export const hasRole = (user: User | null, role: UserRole | UserRole[]): boolean => {
  if (!user) return false;
  
  // Super admin can do anything
  if (user.role === UserRole.SUPER_ADMIN) return true;
  
  // Check for specific roles
  const roles = Array.isArray(role) ? role : [role];
  return roles.includes(user.role);
};

export default hasRole;
