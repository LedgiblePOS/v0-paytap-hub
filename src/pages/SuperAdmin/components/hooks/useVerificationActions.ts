
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/utils/errorHandler';

export const useVerificationActions = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const approveVerification = async (id: string, merchantId: string) => {
    setLoading(true);
    try {
      // First, update the verification status
      const { error } = await supabase
        .from('merchant_verifications')
        .update({ 
          is_verified: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the merchant record to mark as verified
      // This could include setting a verified flag or updating permissions
      await supabase
        .from('merchants')
        .update({ 
          // You could add a verified field if needed
          updated_at: new Date().toISOString()
        })
        .eq('id', merchantId);
      
      // Create an audit log entry
      const user = (await supabase.auth.getUser()).data.user;
      await supabase.from('audit_logs').insert({
        action: 'VERIFICATION_APPROVE',
        resource: 'merchant_verifications',
        description: `Merchant verification ${id} approved`,
        user_id: user?.id
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['merchantVerifications'] });
      
      toast({
        title: 'Merchant verified',
        description: 'The merchant has been successfully verified.',
      });
      
      return true;
    } catch (err) {
      const error = handleError(err);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve verification. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const rejectVerification = async (id: string, reason: string) => {
    if (!reason || reason.trim() === '') {
      toast({
        title: 'Error',
        description: 'A rejection reason is required.',
        variant: 'destructive',
      });
      return false;
    }
    
    setLoading(true);
    try {
      // Get current verification data first
      const { data: currentVerification, error: fetchError } = await supabase
        .from('merchant_verifications')
        .select('verification_data')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Create updated verification data with rejection info
      const updatedVerificationData = {
        ...((currentVerification?.verification_data as Record<string, any>) || {}),
        rejection_reason: reason,
        rejection_date: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('merchant_verifications')
        .update({ 
          is_verified: false,
          verification_data: updatedVerificationData
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Create an audit log entry
      const user = (await supabase.auth.getUser()).data.user;
      await supabase.from('audit_logs').insert({
        action: 'VERIFICATION_REJECT',
        resource: 'merchant_verifications',
        description: `Merchant verification ${id} rejected: ${reason.substring(0, 100)}`,
        user_id: user?.id
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['merchantVerifications'] });
      
      toast({
        title: 'Verification rejected',
        description: 'The merchant verification has been rejected with feedback.',
      });
      
      return true;
    } catch (err) {
      const error = handleError(err);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject verification. Please try again.',
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
