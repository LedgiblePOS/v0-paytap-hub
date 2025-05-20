
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionTier } from '@/types/enums';
import { MerchantEntity } from '@/types/merchant';

class MerchantSubscriptionService {
  public async updateMerchantSubscription(merchantId: string, tier: SubscriptionTier): Promise<boolean> {
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
        return false;
      }
      
      // Log the subscription change
      await this.logSubscriptionChange(merchantId, tier);
      
      return true;
    } catch (error) {
      console.error("Error in updateMerchantSubscription:", error);
      return false;
    }
  }

  public async getMerchantsByTier(): Promise<Record<SubscriptionTier, MerchantEntity[]>> {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*');
      
      if (error) {
        console.error("Error fetching merchants by tier:", error);
        return {} as Record<SubscriptionTier, MerchantEntity[]>;
      }

      const merchants = data as MerchantEntity[];
      return merchants.reduce((acc, merchant) => {
        const tier = merchant.subscription_tier as SubscriptionTier || SubscriptionTier.STARTER;
        if (!acc[tier]) {
          acc[tier] = [];
        }
        acc[tier].push(merchant);
        return acc;
      }, {} as Record<SubscriptionTier, MerchantEntity[]>);
    } catch (error) {
      console.error("Error in getMerchantsByTier:", error);
      return {} as Record<SubscriptionTier, MerchantEntity[]>;
    }
  }

  private async logSubscriptionChange(merchantId: string, tier: SubscriptionTier): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        action: 'SUBSCRIPTION_UPDATE',
        resource: 'merchants',
        description: `Updated merchant subscription to ${tier}`,
        merchant_id: merchantId
      });
    } catch (error) {
      console.error("Error creating audit log:", error);
    }
  }
}

export default new MerchantSubscriptionService();
