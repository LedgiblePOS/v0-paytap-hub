
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionTier } from '@/types/enums';
import { TIER_REQUIREMENTS } from '@/constants/subscription';

export const useTierEligibility = (merchantId: string | null) => {
  const [eligibleTiers, setEligibleTiers] = useState<SubscriptionTier[]>([]);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!merchantId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get merchant data
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('subscription_tier, product_count')
          .eq('id', merchantId)
          .single();

        if (merchantError) throw merchantError;
        
        // Set the current tier
        setCurrentTier(merchant.subscription_tier as SubscriptionTier);
        
        // Example logic to determine which tiers a merchant is eligible for
        // This is simplified; in a real app, you would check multiple requirements
        const productCount = merchant.product_count || 0;
        
        const eligible = Object.entries(TIER_REQUIREMENTS)
          .filter(([_, requirements]) => {
            return requirements.productLimit === -1 || productCount <= requirements.productLimit;
          })
          .map(([tier]) => tier as SubscriptionTier);
        
        setEligibleTiers(eligible);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error checking tier eligibility:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkEligibility();
  }, [merchantId]);

  return {
    eligibleTiers,
    currentTier,
    isLoading,
    error
  };
};
