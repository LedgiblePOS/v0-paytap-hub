
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for dashboard data and operations
 */
export function useDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  
  // Check if the current user has a merchant account
  useEffect(() => {
    const checkMerchantAccount = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setMerchantId(data.id);
        }
      } catch (err) {
        console.error('Error checking merchant account:', err);
        setError(err instanceof Error ? err : new Error('Failed to check merchant account'));
      } finally {
        setLoading(false);
      }
    };
    
    checkMerchantAccount();
  }, [user?.id]);
  
  // Update merchant subscription to STARTER
  const updateSubscriptionToStarter = async () => {
    if (!merchantId) {
      throw new Error('No merchant account found');
    }
    
    try {
      const { error } = await supabase
        .from('merchants')
        .update({ 
          subscription_tier: 'STARTER',
          product_limit: 50 // Assuming STARTER tier gets 50 products
        })
        .eq('id', merchantId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating subscription tier:', err);
      throw err;
    }
  };
  
  return {
    loading,
    error,
    merchantId,
    hasMerchantAccount: !!merchantId,
    updateSubscriptionToStarter
  };
}
