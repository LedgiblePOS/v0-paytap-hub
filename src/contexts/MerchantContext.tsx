
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MerchantModel } from '@/types/merchant';
import { useToast } from '@/hooks/use-toast';
import { toMerchantModel } from '@/utils/merchantUtils';
import { useAuth } from '@/hooks/useAuth';

interface MerchantContextType {
  selectedMerchantId: string | null;
  merchant: MerchantModel | null;
  loading: boolean;
  error: Error | null;
  setSelectedMerchantId: (id: string) => void;
  updateMerchant: (data: Partial<MerchantModel>) => Promise<MerchantModel | null>;
}

export const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<MerchantModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch merchant data when selectedMerchantId changes or on initial load for merchants
  useEffect(() => {
    const fetchMerchantData = async () => {
      // Use either the selected ID or the user's merchant ID
      const merchantIdToUse = selectedMerchantId || (user?.merchantId || null);
      
      if (!merchantIdToUse) {
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('merchants')
          .select('*')
          .eq('id', merchantIdToUse)
          .single();
          
        if (fetchError) throw fetchError;
        
        const merchantData = toMerchantModel(data);
        setMerchant(merchantData);
      } catch (err) {
        console.error('Error fetching merchant:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch merchant data'));
        toast({
          title: 'Error',
          description: 'Failed to load merchant data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [selectedMerchantId, user?.merchantId, toast]);

  // Update merchant data
  const updateMerchant = async (updatedData: Partial<MerchantModel>): Promise<MerchantModel | null> => {
    if (!merchant?.id) {
      toast({
        title: 'Error',
        description: 'No merchant found to update',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      setLoading(true);
      
      const { data, error: updateError } = await supabase
        .from('merchants')
        .update({ ...updatedData })
        .eq('id', merchant.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      const updatedMerchant = toMerchantModel(data);
      setMerchant(updatedMerchant);
      
      toast({
        title: 'Success',
        description: 'Merchant updated successfully',
      });
      
      return updatedMerchant;
    } catch (err) {
      console.error('Error updating merchant:', err);
      setError(err instanceof Error ? err : new Error('Failed to update merchant'));
      
      toast({
        title: 'Error',
        description: 'Failed to update merchant data',
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MerchantContext.Provider
      value={{
        selectedMerchantId,
        merchant,
        loading,
        error,
        setSelectedMerchantId,
        updateMerchant
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};
