
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useVerificationActions = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const approveVerification = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('merchant_verifications')
        .update({ 
          is_verified: true,
          status: 'approved',
          verified_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['merchantVerifications'] });
      
      toast({
        title: 'Verification Approved',
        description: 'The merchant verification has been approved.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve verification',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const rejectVerification = async (id: string, reason: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('merchant_verifications')
        .update({ 
          is_verified: false,
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['merchantVerifications'] });
      
      toast({
        title: 'Verification Rejected',
        description: 'The merchant verification has been rejected.',
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject verification',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    approveVerification,
    rejectVerification
  };
};
