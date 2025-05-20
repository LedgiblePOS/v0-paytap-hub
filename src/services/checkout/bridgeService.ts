
import { FasstapService } from "../fasstapService";
import { CartItemType } from "@/components/POS/Cart";
import { supabase } from "@/integrations/supabase/client";
import FasstapBridge, { FasstapTransactionResult } from "@/bridges/FasstapBridge";
import transactionManager from "@/bridges/fasstap/transactionManager";
import { handleError } from "@/utils/errorHandling";

/**
 * Service for interfacing with the Fasstap Bridge implementation
 */
class BridgeService {
  /**
   * Process a Tap-to-Pay payment using the Fasstap Bridge
   */
  public async processTapToPayWithBridge(
    merchantId: string, 
    amount: number, 
    cartItems: CartItemType[],
    metadata: Record<string, any> = {}
  ): Promise<FasstapTransactionResult> {
    try {
      console.log(`Processing tap-to-pay payment with bridge: ${amount}`);
      
      // Initialize the bridge with the merchant ID
      const bridge = new FasstapBridge({
        merchantId,
        environmentMode: 'production'
      });
      
      await bridge.initialize();
      
      // Process the payment
      const result = await bridge.startPayment(amount);
      
      if (result.success || result.status === "completed") {
        // Record the successful transaction
        await transactionManager.handleSuccessfulTransaction(
          result,
          cartItems,
          merchantId
        );
        
        // Log the transaction for audit purposes
        await this.logTransaction(merchantId, amount, result.transactionId, true);
      } else {
        // Log the failed transaction
        await this.logTransaction(merchantId, amount, result.transactionId, false, result.error);
      }
      
      return result;
    } catch (error) {
      console.error("Error processing tap-to-pay payment with bridge:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Log the failed transaction
      await this.logTransaction(merchantId, amount, undefined, false, errorMessage);
      
      return {
        success: false,
        status: "failed",
        error: errorMessage,
        transactionId: `failed_${Date.now()}`
      };
    }
  }
  
  /**
   * Log a transaction for audit purposes
   */
  private async logTransaction(
    merchantId: string,
    amount: number,
    transactionId?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase
        .from('payment_logs')
        .insert({
          merchant_id: merchantId,
          payment_method: 'TAP_TO_PAY',
          transaction_id: transactionId || `log_${Date.now()}`,
          amount,
          status: success ? 'success' : 'failed',
          error_message: errorMessage,
          provider: 'fasstap_bridge'
        });
    } catch (logError) {
      console.error("Failed to log transaction:", logError);
    }
  }
  
  /**
   * Initialize the bridge for a specific merchant
   */
  public async initializeBridge(merchantId: string): Promise<boolean> {
    try {
      // Initialize the bridge with the merchant ID
      const bridge = new FasstapBridge({
        merchantId,
        environmentMode: 'production'
      });
      
      return await bridge.initialize();
    } catch (error) {
      handleError("Failed to initialize bridge", error);
      return false;
    }
  }
  
  /**
   * Check if a device is connected
   */
  public async checkDeviceConnection(merchantId: string): Promise<boolean> {
    try {
      // Set the merchant ID in the service
      FasstapService.getInstance().setMerchantId(merchantId);
      
      // Check if a device is connected
      return await FasstapService.connect();
    } catch (error) {
      handleError("Failed to check device connection", error);
      return false;
    }
  }
}

export default new BridgeService();
