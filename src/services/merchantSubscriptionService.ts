
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "@/types/enums";

/**
 * Service for managing merchant subscriptions
 */
class MerchantSubscriptionService {
  /**
   * Update a merchant's subscription tier
   */
  public async updateMerchantSubscriptionTier(merchantId: string, tier: SubscriptionTier): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('merchants')
        .update({ 
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantId);
      
      if (error) {
        console.error("Error updating merchant subscription:", error);
        throw error;
      }
      
      // Create audit log entry for subscription change
      await this.createAuditLog(merchantId, tier);
      
      return true;
    } catch (error) {
      console.error("Error in updateMerchantSubscriptionTier:", error);
      return false;
    }
  }
  
  /**
   * Get merchants grouped by subscription tier
   */
  public async getMerchantCountByTier(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('subscription_tier');
      
      if (error) {
        console.error("Error fetching merchant subscription data:", error);
        throw error;
      }
      
      // Count merchants by subscription tier
      const tierCounts: Record<string, number> = {};
      
      // Initialize with all known tiers set to zero
      tierCounts[SubscriptionTier.STARTER] = 0;
      tierCounts[SubscriptionTier.PROFESSIONAL] = 0;
      tierCounts[SubscriptionTier.ENTERPRISE] = 0;
      
      // Count actual subscriptions
      data.forEach(merchant => {
        const tier = merchant.subscription_tier || SubscriptionTier.STARTER;
        tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      });
      
      return tierCounts;
    } catch (error) {
      console.error("Error in getMerchantCountByTier:", error);
      return {};
    }
  }
  
  /**
   * Get monthly subscription revenue by tier
   */
  public async getMonthlySubscriptionRevenue(): Promise<Record<string, number>> {
    try {
      // First get all active subscription plans
      const { data: plans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('name, monthly_price');
      
      if (plansError) throw plansError;
      
      // Then get merchant counts by tier
      const tierCounts = await this.getMerchantCountByTier();
      
      // Map plan names to tiers
      const tierPriceMap: Record<string, number> = {};
      
      plans.forEach(plan => {
        tierPriceMap[plan.name] = parseFloat(plan.monthly_price);
      });
      
      // Calculate revenue by tier
      const revenue: Record<string, number> = {};
      
      Object.entries(tierCounts).forEach(([tier, count]) => {
        revenue[tier] = (tierPriceMap[tier] || 0) * count;
      });
      
      return revenue;
    } catch (error) {
      console.error("Error in getMonthlySubscriptionRevenue:", error);
      return {};
    }
  }
  
  /**
   * Create audit log entry for subscription change
   */
  private async createAuditLog(merchantId: string, tier: SubscriptionTier): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      await supabase.from('audit_logs').insert({
        action: 'SUBSCRIPTION_UPDATE',
        resource: 'merchants',
        description: `Updated merchant subscription to ${tier}`,
        user_id: user?.id
      });
    } catch (error) {
      console.error("Error creating audit log:", error);
    }
  }
}

export default new MerchantSubscriptionService();
