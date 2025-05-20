
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/types/enums";

/**
 * Service for managing transaction fees
 */
class TransactionFeeService {
  /**
   * Get transaction fee percentage for a merchant based on their tier
   * @param merchantId The merchant ID
   * @returns The transaction fee percentage (e.g., 2.5 for 2.5%)
   */
  public async getMerchantTransactionFeePercentage(merchantId: string): Promise<number> {
    try {
      // Get the merchant's tier
      const { data: merchant, error } = await supabase
        .from('merchants')
        .select('subscription_tier')
        .eq('id', merchantId)
        .single();
        
      if (error) {
        console.error("Error fetching merchant tier:", error);
        return this.getDefaultFeeForTier(SubscriptionTier.STARTER);
      }
      
      const tier = merchant?.subscription_tier as SubscriptionTier || SubscriptionTier.STARTER;
      
      // Check if there's a custom fee for this tier in subscription_plans table
      const { data: planData, error: planError } = await supabase
        .from('subscription_plans')
        .select('transaction_fee_percentage')
        .eq('name', tier)
        .single();
        
      if (planError || !planData?.transaction_fee_percentage) {
        // Fall back to default fees if no custom fee is configured
        return this.getDefaultFeeForTier(tier);
      }
      
      return planData.transaction_fee_percentage;
    } catch (error) {
      console.error("Error getting transaction fee:", error);
      return this.getDefaultFeeForTier(SubscriptionTier.STARTER);
    }
  }
  
  /**
   * Get the default transaction fee percentage for a tier
   * @param tier Subscription tier
   * @returns Default transaction fee percentage
   */
  public getDefaultFeeForTier(tier: SubscriptionTier): number {
    switch (tier) {
      case SubscriptionTier.STARTER:
        return 2.5; // 2.5% per transaction
      case SubscriptionTier.PROFESSIONAL:
        return 2.0; // 2.0% per transaction (discounted rate)
      case SubscriptionTier.ENTERPRISE:
        return 1.5; // 1.5% per transaction (volume discount)
      default:
        return 2.5; // Default fee for STARTER
    }
  }
  
  /**
   * Calculate transaction fee amount
   * @param amount Transaction amount
   * @param feePercentage Fee percentage
   * @returns Fee amount
   */
  public calculateFeeAmount(amount: number, feePercentage: number): number {
    return (amount * feePercentage) / 100;
  }
  
  /**
   * Get the CBDC discount percentage (how much lower than standard fee)
   * @returns CBDC discount percentage
   */
  public getCbdcDiscountPercentage(): number {
    return 0.5; // CBDC transactions get 0.5% discount
  }
}

export default new TransactionFeeService();
