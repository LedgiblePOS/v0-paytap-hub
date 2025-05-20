
import { supabase } from "@/integrations/supabase/client";
import { CartItemType } from "@/components/POS/Cart";
import { updateProductStock } from "@/services/inventoryService";
import { FasstapTransactionResult } from "./types";

/**
 * Manages recording transactions and updating inventory
 */
class TransactionManager {
  /**
   * Handle a successful transaction by:
   * 1. Recording the transaction in the database
   * 2. Updating inventory levels
   * 3. Recording transaction items
   */
  public async handleSuccessfulTransaction(
    result: FasstapTransactionResult,
    cartItems: CartItemType[],
    merchantId: string
  ): Promise<void> {
    try {
      if (!merchantId) {
        throw new Error("Merchant ID not set");
      }
      
      // 1. Record the transaction in the database
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          merchant_id: merchantId,
          amount: result.amount,
          status: "COMPLETED",
          payment_method: "TAP_TO_PAY",
          reference: result.transactionId
        })
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // 2. Record transaction items and update inventory
      for (const item of cartItems) {
        // Record transaction item
        await supabase
          .from('transaction_items')
          .insert({
            transaction_id: transaction.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity
          });
        
        // Update inventory levels
        await this.updateInventory(item.id, item.quantity);
      }
      
      console.log("Transaction successfully recorded with ID:", transaction.id);
    } catch (error) {
      console.error("Failed to record transaction:", error);
    }
  }

  /**
   * Update inventory levels for a product
   */
  private async updateInventory(productId: string, quantity: number): Promise<void> {
    try {
      // Get current stock level
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('in_stock')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      const currentStock = product.in_stock || 0;
      const newStock = Math.max(0, currentStock - quantity);
      
      // Update stock level
      await updateProductStock(productId, newStock);
      
      console.log(`Updated inventory for product ${productId}: ${currentStock} -> ${newStock}`);
    } catch (error) {
      console.error(`Failed to update inventory for product ${productId}:`, error);
    }
  }

  /**
   * Check the status of a transaction
   */
  public async checkTransactionStatus(transactionId: string): Promise<FasstapTransactionResult | null> {
    try {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('reference', transactionId)
        .single();
      
      if (error) throw error;
      
      if (!transaction) return null;
      
      return {
        transactionId: transaction.reference,
        status: transaction.status === "COMPLETED" ? "completed" : 
                transaction.status === "FAILED" ? "failed" : "cancelled",
        amount: transaction.amount,
        currency: "USD",
        timestamp: transaction.created_at,
        paymentMethod: transaction.payment_method
      };
    } catch (error) {
      console.error("Failed to check transaction status:", error);
      return null;
    }
  }

  /**
   * Handle a transaction
   * This is what FasstapBridge calls
   */
  public async handleTransaction(options: {
    merchantId: string;
    terminalId: string;
    amount: number;
    currency: string;
  }): Promise<FasstapTransactionResult> {
    try {
      // Simulate a transaction
      const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Create a transaction record
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          merchant_id: options.merchantId,
          amount: options.amount,
          status: "COMPLETED",
          payment_method: "TAP_TO_PAY",
          reference: transactionId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return {
        transactionId,
        status: "completed",
        amount: options.amount,
        currency: options.currency,
        timestamp: new Date().toISOString(),
        paymentMethod: "TAP_TO_PAY"
      };
    } catch (error) {
      console.error("Failed to handle transaction:", error);
      
      return {
        transactionId: `failed_${Date.now()}`,
        status: "failed",
        amount: options.amount,
        currency: options.currency,
        timestamp: new Date().toISOString(),
        paymentMethod: "TAP_TO_PAY",
        errorMessage: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  
  /**
   * Abort a transaction in progress
   */
  public async abortTransaction(): Promise<void> {
    console.log("Transaction aborted");
    return Promise.resolve();
  }
}

export default new TransactionManager();
