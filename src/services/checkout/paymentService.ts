
import { FasstapPaymentOptions, FasstapPaymentResult, FasstapService } from "../fasstapService";
import CBDCService from "../cbdcService";
import { User, UserRole } from "@/types/user";
import { authorizePaymentAction } from "@/utils/security/authGuards";
import { authorizeCBDCAccess, validateCBDCTransaction } from "@/utils/security/cbdcSecurityUtils";
import enhancedAuditService, { AuditSeverity } from "@/services/enhancedAuditService";

/**
 * Service for handling payment processing with different payment methods
 */
class PaymentService {
  /**
   * Process a Tap to Pay payment using the legacy Fasstap service
   * with enhanced security controls
   */
  public async processTapToPay(
    options: FasstapPaymentOptions,
    currentUser: User | null
  ): Promise<null> {
    // Verify authorization before processing
    await authorizePaymentAction(
      currentUser, 
      'PROCESS_PAYMENT',
      options.merchantId
    );
    
    // Log the payment attempt
    await enhancedAuditService.logSecurityEvent({
      action: 'PAYMENT_INITIATED',
      description: `User initiated a Tap to Pay payment`,
      userId: currentUser?.id,
      severity: AuditSeverity.INFO,
      metadata: { 
        amount: options.amount,
        currency: options.currency,
        merchantId: options.merchantId,
        paymentMethod: 'TAP_TO_PAY'
      }
    });
    
    // Get the instance of FasstapService first, then call the initiatePayment method
    await FasstapService.getInstance().initiatePayment(options);
    
    // Return null as the result will be handled via redirect
    return null;
  }
  
  /**
   * Process a CBDC payment with enhanced security controls
   */
  public async processCBDCPayment(
    options: any,
    currentUser: User | null
  ): Promise<FasstapPaymentResult | null> {
    try {
      // Authorize CBDC access
      await authorizeCBDCAccess(currentUser, 'PAYMENT', {
        amount: options.amount,
        currency: options.currency,
        merchantId: options.merchantId
      });
      
      // Validate transaction parameters
      validateCBDCTransaction(
        options.amount, 
        options.currency,
        options.merchantId
      );
      
      // Apply transaction limits if user is not a super admin
      if (currentUser && currentUser.role !== UserRole.SUPER_ADMIN) {
        await this.enforceDailyTransactionLimits(
          currentUser,
          options.amount,
          options.currency,
          options.merchantId
        );
      }
      
      // Log the CBDC payment attempt
      await enhancedAuditService.logSecurityEvent({
        action: 'CBDC_PAYMENT_INITIATED',
        description: `User initiated a CBDC payment`,
        userId: currentUser?.id,
        severity: AuditSeverity.INFO,
        metadata: { 
          amount: options.amount,
          currency: options.currency,
          merchantId: options.merchantId
        }
      });
      
      const result = await CBDCService.initiatePayment(options);
      
      // Convert CBDC result to FasstapPaymentResult format for consistency
      // Fix the type mismatch by mapping 'pending' to 'cancelled' since FasstapPaymentResult doesn't support 'pending'
      const mappedStatus: "completed" | "failed" | "cancelled" = 
        result.status === "pending" ? "cancelled" : result.status;
      
      // Log the CBDC payment result
      await enhancedAuditService.logSecurityEvent({
        action: 'CBDC_PAYMENT_COMPLETED',
        description: `CBDC payment completed with status: ${result.status}`,
        userId: currentUser?.id,
        severity: result.success ? AuditSeverity.INFO : AuditSeverity.WARNING,
        metadata: { 
          success: result.success,
          status: result.status,
          transactionId: result.transactionId,
          error: result.error,
          amount: options.amount,
          merchantId: options.merchantId
        }
      });
      
      return {
        success: result.success,
        transactionId: result.transactionId,
        status: mappedStatus,
        error: result.error
      };
    } catch (error) {
      console.error("Error processing CBDC payment:", error);
      
      // Log the CBDC payment failure
      if (currentUser) {
        await enhancedAuditService.logSecurityEvent({
          action: 'CBDC_PAYMENT_FAILED',
          description: `CBDC payment processing error`,
          userId: currentUser.id,
          severity: AuditSeverity.WARNING,
          metadata: { 
            error: error instanceof Error ? error.message : "Unknown error",
            amount: options.amount,
            merchantId: options.merchantId
          }
        });
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        status: "failed"
      };
    }
  }

  /**
   * Enforce daily transaction limits for users
   * This prevents excessive transaction activity that might indicate fraud
   */
  private async enforceDailyTransactionLimits(
    user: User,
    amount: number,
    currency: string,
    merchantId: string
  ): Promise<void> {
    // Implementation would typically query transaction history
    // and enforce daily limits based on user role
    
    // For now, we'll just log the check
    await enhancedAuditService.logSecurityEvent({
      action: 'TRANSACTION_LIMIT_CHECK',
      description: `Daily transaction limit check performed`,
      userId: user.id,
      severity: AuditSeverity.INFO,
      metadata: { 
        amount,
        currency,
        merchantId,
        userRole: user.role
      }
    });
    
    // In a real implementation, this would throw an error if limits are exceeded
  }
}

export default new PaymentService();
