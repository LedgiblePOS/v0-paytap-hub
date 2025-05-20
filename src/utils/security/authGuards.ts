
import { User, UserRole } from "@/types";
import { AppError, ErrorType } from "@/utils/errorHandler";
import { Permission } from "@/utils/permissions/types";
import { hasPermission } from "@/utils/permissions/permissionCheck";
import enhancedAuditService, { AuditSeverity } from "@/services/enhancedAuditService";
import { supabase } from "@/integrations/supabase/client";

/**
 * Authorization guard that checks user roles and permissions
 */
export const authorizeAction = async (
  user: User | null,
  requiredPermissions: Permission[],
  resourceId?: string
): Promise<void> => {
  if (!user) {
    throw new AppError("Authentication required", ErrorType.AUTHENTICATION_ERROR);
  }

  const isAuthorized = requiredPermissions.every(permission => 
    hasPermission(user, permission, resourceId)
  );

  if (!isAuthorized) {
    // Log unauthorized access attempt
    await enhancedAuditService.logSecurityEvent({
      action: 'UNAUTHORIZED_ACCESS',
      description: `User attempted to access resource requiring permissions: ${requiredPermissions.join(', ')}`,
      userId: user.id,
      severity: AuditSeverity.WARNING,
      metadata: { resourceId, requiredPermissions }
    });

    throw new AppError("Insufficient permissions", ErrorType.PERMISSION_ERROR);
  }
};

/**
 * Enhanced middleware to verify user role with audit logging
 */
export const verifyRole = async (user: User | null, requiredRoles: UserRole[]): Promise<boolean> => {
  if (!user) return false;
  
  const hasRequiredRole = requiredRoles.includes(user.role);
  
  if (!hasRequiredRole) {
    // Log unauthorized role access attempt
    await enhancedAuditService.logSecurityEvent({
      action: 'ROLE_VERIFICATION_FAILED',
      description: `User with role ${user.role} attempted to access resource requiring roles: ${requiredRoles.join(', ')}`,
      userId: user.id,
      severity: AuditSeverity.WARNING,
      metadata: { userRole: user.role, requiredRoles }
    });
  }
  
  return hasRequiredRole;
};

/**
 * Verify merchant ownership of a resource
 */
export const verifyMerchantOwnership = async (
  user: User | null,
  merchantId: string
): Promise<boolean> => {
  if (!user) return false;
  
  // Super admins can access any merchant
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Check if user is associated with the merchant
  const isOwner = user.merchantId === merchantId;
  
  if (!isOwner) {
    // Log unauthorized merchant access attempt
    await enhancedAuditService.logSecurityEvent({
      action: 'MERCHANT_ACCESS_DENIED',
      description: `User attempted to access merchant they don't own`,
      userId: user.id,
      severity: AuditSeverity.WARNING,
      metadata: { 
        attemptedMerchantId: merchantId,
        userMerchantId: user.merchantId
      }
    });
    
    // Also check via database function for double verification
    const { data, error } = await supabase.rpc('check_merchant_ownership', {
      merchant_id: merchantId
    });
    
    if (error || !data) {
      return false;
    }
    
    return data === true;
  }
  
  return isOwner;
};

/**
 * Comprehensive authorization check for payment endpoints
 */
export const authorizePaymentAction = async (
  user: User | null,
  action: string,
  merchantId?: string
): Promise<void> => {
  if (!user) {
    throw new AppError("Authentication required for payment operations", ErrorType.AUTHENTICATION_ERROR);
  }
  
  // Allow super admins to perform any action
  if (user.role === UserRole.SUPER_ADMIN) {
    return;
  }
  
  // For merchant-specific actions, verify ownership
  if (merchantId) {
    const isOwner = await verifyMerchantOwnership(user, merchantId);
    if (!isOwner) {
      throw new AppError("Cannot perform payment actions for other merchants", ErrorType.PERMISSION_ERROR);
    }
  }
  
  // Additional action-specific checks
  switch (action) {
    case 'VIEW_TRANSACTIONS':
      // Merchants and staff can view transactions
      if (![UserRole.MERCHANT, UserRole.STAFF, UserRole.ADMIN].includes(user.role)) {
        throw new AppError("Insufficient permissions to view transactions", ErrorType.PERMISSION_ERROR);
      }
      break;
      
    case 'PROCESS_PAYMENT':
      // Only merchants and staff can process payments
      if (![UserRole.MERCHANT, UserRole.STAFF].includes(user.role)) {
        throw new AppError("Insufficient permissions to process payments", ErrorType.PERMISSION_ERROR);
      }
      break;
      
    case 'REFUND':
      // Only merchants can refund payments
      if (user.role !== UserRole.MERCHANT) {
        throw new AppError("Only merchants can refund payments", ErrorType.PERMISSION_ERROR);
      }
      break;
      
    case 'CONFIGURE_PAYMENT':
      // Only merchants can configure payment settings
      if (user.role !== UserRole.MERCHANT) {
        throw new AppError("Only merchants can configure payment settings", ErrorType.PERMISSION_ERROR);
      }
      break;
      
    default:
      throw new AppError(`Unknown payment action: ${action}`, ErrorType.VALIDATION_ERROR);
  }
  
  // Log successful authorization
  await enhancedAuditService.logSecurityEvent({
    action: 'PAYMENT_ACTION_AUTHORIZED',
    description: `User authorized to perform payment action: ${action}`,
    userId: user.id,
    severity: AuditSeverity.INFO,
    metadata: { 
      action,
      merchantId
    }
  });
};
