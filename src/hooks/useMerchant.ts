
// Only showing the relevant part of the file to be updated
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MerchantEntity, MerchantModel } from '@/types/models';
import { SubscriptionTier } from '@/types/enums';

export const useMerchant = () => {
  const [merchant, setMerchant] = useState<MerchantModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // All other existing functions and code...

  // Add merchant transformer with is_active
  const transformMerchantData = (data: any): MerchantEntity => {
    return {
      id: data.id,
      user_id: data.user_id,
      business_name: data.business_name || '',
      business_logo: data.business_logo || '',
      subscription_tier: data.subscription_tier as SubscriptionTier,
      product_limit: data.product_limit || 0,
      product_count: data.product_count || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
      country: data.country,
      default_currency: data.default_currency || 'USD',
      is_active: data.is_active !== undefined ? data.is_active : true
    };
  };

  // Use this transformer in your fetchMerchant function
  const fetchMerchant = useCallback(async (merchantId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', merchantId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Convert to MerchantEntity first, then to MerchantModel
        const merchantEntity = transformMerchantData(data);
        // Then convert to model or use it directly
        // Rest of your code
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch merchant data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    merchant,
    isLoading,
    error,
    // All other return values
  };
};
