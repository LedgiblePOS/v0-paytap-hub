import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Income {
  id: string;
  date: string;
  description: string;
  amount: number;
  merchant_id: string;
}

export const useIncomes = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      
      if (!user?.merchantId) {
        throw new Error('No merchant ID available');
      }
      
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('merchant_id', user.merchantId)
        .order('date', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setIncomes(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIncomes();
    }
  }, [user]);

  return {
    incomes,
    loading,
    error,
    fetchIncomes,
  };
};
