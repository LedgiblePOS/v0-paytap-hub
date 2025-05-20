
import { User } from '@/types/user';
import { UserRole } from '@/types/enums';

/**
 * Helper function to check if a user has the required permissions based on their role
 * @param user Current user
 * @param requiredRole Required role or array of roles
 * @returns boolean indicating if the user has the required permissions
 */
export const checkUserPermissions = (user: User | null, requiredRole: UserRole | UserRole[]): boolean => {
  if (!user) return false;

  // Role hierarchy weights
  const roleWeights: Record<string, number> = {
    [UserRole.SUPER_ADMIN]: 100,
    [UserRole.ADMIN]: 80,
    [UserRole.MERCHANT]: 60,
    [UserRole.STAFF]: 40,
    [UserRole.USER]: 20
  };

  // Get user's role weight
  const userRoleWeight = roleWeights[user.role] || 0;

  // Check against required roles
  if (Array.isArray(requiredRole)) {
    // For array of roles, user needs to have at least one
    return requiredRole.some(role => {
      const requiredWeight = roleWeights[role] || 0;
      return userRoleWeight >= requiredWeight;
    });
  } else {
    // For single role
    const requiredWeight = roleWeights[requiredRole] || 0;
    return userRoleWeight >= requiredWeight;
  }
};

/**
 * Logs detailed information about user permissions for debugging
 * @param user Current user
 */
export const logUserPermissionDetails = (user: User | null): void => {
  if (!user) {
    console.error("Permission check failed: No user provided");
    return;
  }

  console.info("User Permission Details:", {
    userId: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    merchantId: user.merchantId,
    hasValidRole: Object.values(UserRole).includes(user.role as UserRole),
    canAccessMerchantSection: checkUserPermissions(user, [UserRole.MERCHANT, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    canAccessAdminSection: checkUserPermissions(user, [UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    canAccessSuperAdminSection: checkUserPermissions(user, UserRole.SUPER_ADMIN),
    timestamp: new Date().toISOString()
  });
};

/**
 * Check if onboarding is needed for the merchant
 * @param user Current user
 * @returns boolean indicating if onboarding is needed
 */
export const isMerchantOnboardingNeeded = (user: User | null): boolean => {
  if (!user) return false;
  
  // If the user is a merchant but has no merchantId, they need onboarding
  return user.role === UserRole.MERCHANT && !user.merchantId;
};

export default checkUserPermissions;
