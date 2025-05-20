
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Define merchant subscription types
interface MerchantSubscription {
  id: string;
  businessName: string;
  businessLogo?: string;
  country: string;
  defaultCurrency: string;
  subscriptionTier: string;
  productCount: number;
  productLimit: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tierFeatures: TierFeatures;
}

interface TierFeatures {
  hasInventoryManagement: boolean;
  hasMultipleUsers: boolean;
  hasReporting: boolean;
  hasCustomerManagement: boolean;
  hasAdvancedAnalytics: boolean;
}

// Hook to fetch and manage merchant subscriptions
const useMerchantSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<MerchantSubscription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch merchants with their subscription info
      const { data: merchants, error } = await supabase
        .from('merchants')
        .select(`
          *,
          profiles (id, email, first_name, last_name, role)
        `);
      
      if (error) throw error;
      
      const formattedSubscriptions = merchants?.map(merchant => {
        // Extract profile info safely with null checks
        const profileInfo = merchant.profiles ? {
          email: merchant.profiles.email,
          firstName: merchant.profiles.first_name,
          lastName: merchant.profiles.last_name,
          role: merchant.profiles.role
        } : {
          email: 'Unknown',
          firstName: 'Unknown',
          lastName: 'User',
          role: 'Unknown'
        };
        
        // Map subscription tier to features
        // We'll handle this with safe defaults if features doesn't exist
        const tierFeatures = {
          hasInventoryManagement: true,
          hasMultipleUsers: merchant.subscription_tier !== 'FREE',
          hasReporting: merchant.subscription_tier !== 'FREE',
          hasCustomerManagement: merchant.subscription_tier !== 'FREE',
          hasAdvancedAnalytics: merchant.subscription_tier === 'BUSINESS' || merchant.subscription_tier === 'ENTERPRISE'
        };

        return {
          id: merchant.id,
          businessName: merchant.business_name,
          businessLogo: merchant.business_logo,
          country: merchant.country,
          defaultCurrency: merchant.default_currency,
          subscriptionTier: merchant.subscription_tier,
          productCount: merchant.product_count,
          productLimit: merchant.product_limit,
          createdAt: merchant.created_at,
          updatedAt: merchant.updated_at,
          userId: merchant.user_id,
          tierFeatures,
          profileInfo
        };
      }) || [];

      setSubscriptions(formattedSubscriptions);
    } catch (err) {
      console.error('Error fetching merchant subscriptions:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    isLoading,
    error,
    refetch: fetchSubscriptions
  };
};

export default useMerchantSubscriptions;
