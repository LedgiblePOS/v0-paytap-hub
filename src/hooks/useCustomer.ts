
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create a supabase client directly instead of importing
const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  merchant_id?: string;
}

export const useCustomer = (merchantId: string | null) => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from('customers')
          .select('*')
          .eq('merchant_id', merchantId);

        if (error) throw error;
        setCustomers(data || []);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [merchantId]);

  const addCustomer = async (customerData: Omit<CustomerData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      const newCustomer = {
        ...customerData,
        merchant_id: merchantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseClient
        .from('customers')
        .insert([newCustomer])
        .select();

      if (error) throw error;
      
      // Update local state
      if (data && data.length > 0) {
        setCustomers(prev => [...prev, data[0]]);
      }
      
      return { success: true, customer: data ? data[0] : null };
    } catch (err: any) {
      console.error('Error adding customer:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<CustomerData>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabaseClient
        .from('customers')
        .update({ ...customerData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('merchant_id', merchantId) // Ensure user can only update their own customers
        .select();

      if (error) throw error;
      
      // Update local state
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customerData } : c));
      
      return { success: true, customer: data ? data[0] : null };
    } catch (err: any) {
      console.error('Error updating customer:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabaseClient
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('merchant_id', merchantId); // Ensure user can only delete their own customers

      if (error) throw error;
      
      // Update local state
      setCustomers(prev => prev.filter(c => c.id !== id));
      
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
};
