
import { supabase } from "@/integrations/supabase/client";
import { PaymentResult } from "./types";

/**
 * Service for managing transaction records
 */
class TransactionService {
  /**
   * Create a new transaction record
   * @param merchantId The merchant ID
   * @param amount The transaction amount
   * @param paymentMethod The payment method used
   * @param reference Optional reference ID 
   * @returns The created transaction record
   */
  public async createTransaction(
    merchantId: string,
    amount: number,
    paymentMethod: string,
    reference?: string
  ): Promise<{ id: string; status: string } | null> {
    try {
      // Create a transaction record in the database
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          merchant_id: merchantId,
          amount: amount,
          status: "COMPLETED",
          payment_method: paymentMethod,
          reference
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  }
  
  /**
   * Create transaction items for a transaction
   * @param transactionId The transaction ID
   * @param items The items to create
   */
  public async createTransactionItems(
    transactionId: string,
    items: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transaction_items')
        .insert(items.map(item => ({
          transaction_id: transactionId,
          ...item
        })));
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error creating transaction items:", error);
      return false;
    }
  }
  
  /**
   * Update product inventory after a purchase
   * @param productId The product ID
   * @param quantity The quantity to reduce from inventory
   */
  public async updateProductInventory(productId: string, quantity: number): Promise<boolean> {
    try {
      // First get the current inventory
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('in_stock')
        .eq('id', productId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Then update with the new inventory value
      const currentStock = productData?.in_stock || 0;
      const newStock = Math.max(0, currentStock - quantity);
      
      const { error: inventoryError } = await supabase
        .from('products')
        .update({ in_stock: newStock })
        .eq('id', productId);
      
      if (inventoryError) throw inventoryError;
      
      return true;
    } catch (error) {
      console.error("Error updating inventory:", error);
      return false;
    }
  }
  
  /**
   * Format payment result
   * @param success Whether the payment was successful
   * @param transactionId The transaction ID
   * @param error Optional error message
   * @returns Formatted payment result
   */
  public formatPaymentResult(
    success: boolean,
    transactionId?: string,
    error?: string
  ): PaymentResult {
    return {
      success,
      transactionId,
      error,
      status: success ? "completed" : "failed"
    };
  }
}

export default new TransactionService();
