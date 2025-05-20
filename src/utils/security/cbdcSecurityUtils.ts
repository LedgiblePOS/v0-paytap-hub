
import { User, UserRole } from '@/types/user';
import enhancedAuditService, { AuditSeverity } from '@/services/enhancedAuditService';
import { AppError, ErrorType } from '@/utils/errorHandler';

/**
 * Controls access to CBDC functionality
 */
export const authorizeCBDCAccess = async (
  user: User | null,
  operation: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  if (!user) {
    throw new AppError("Authentication required for CBDC operations", ErrorType.AUTHENTICATION_ERROR);
  }
  
  // Only merchants and super admins can access CBDC functionality
  if (![UserRole.SUPER_ADMIN, UserRole.MERCHANT].includes(user.role)) {
    // Log unauthorized access attempt
    await enhancedAuditService.logSecurityEvent({
      action: 'CBDC_ACCESS_DENIED',
      description: `User with insufficient role attempted to access CBDC functionality`,
      userId: user.id,
      severity: AuditSeverity.WARNING,
      metadata: { 
        operation,
        userRole: user.role,
        ...metadata
      }
    });
    
    throw new AppError("Insufficient permissions for CBDC operations", ErrorType.PERMISSION_ERROR);
  }
  
  // Log successful authorization
  await enhancedAuditService.logSecurityEvent({
    action: 'CBDC_ACCESS_GRANTED',
    description: `User authorized for CBDC operation: ${operation}`,
    userId: user.id,
    severity: AuditSeverity.INFO,
    metadata: { 
      operation,
      ...metadata
    }
  });
};

/**
 * Secure validation for CBDC transaction parameters
 */
export const validateCBDCTransaction = (
  amount: number,
  currency: string,
  merchantId: string
): void => {
  // Validate amount
  if (amount <= 0) {
    throw new AppError("Transaction amount must be greater than zero", ErrorType.VALIDATION_ERROR);
  }
  
  // Validate currency (only support specific currencies for CBDC)
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY'];
  if (!supportedCurrencies.includes(currency)) {
    throw new AppError(`Currency not supported for CBDC: ${currency}`, ErrorType.VALIDATION_ERROR);
  }
  
  // Validate merchant ID
  if (!merchantId || merchantId.trim() === '') {
    throw new AppError("Merchant ID is required for CBDC transactions", ErrorType.VALIDATION_ERROR);
  }
};

/**
 * Enforce transaction limits for CBDC
 */
export const enforceCBDCTransactionLimits = async (
  user: User,
  amount: number,
  currency: string
): Promise<void> => {
  // Default limits (in USD)
  const defaultLimits = {
    [UserRole.SUPER_ADMIN]: 100000,
    [UserRole.MERCHANT]: 10000,
    [UserRole.ADMIN]: 5000,
    [UserRole.STAFF]: 1000,
    [UserRole.USER]: 500,
    [UserRole.CUSTOMER]: 200
  };
  
  // Get limit for user's role
  const userLimit = defaultLimits[user.role] || 100;
  
  // Check if transaction exceeds limit
  if (amount > userLimit) {
    // Log excessive transaction attempt
    await enhancedAuditService.logSecurityEvent({
      action: 'CBDC_LIMIT_EXCEEDED',
      description: `User attempted to perform CBDC transaction exceeding their limit`,
      userId: user.id,
      severity: AuditSeverity.WARNING,
      metadata: { 
        amount,
        currency,
        userLimit,
        userRole: user.role
      }
    });
    
    throw new AppError(`Transaction amount exceeds your limit of ${userLimit} ${currency}`, ErrorType.VALIDATION_ERROR);
  }
};
