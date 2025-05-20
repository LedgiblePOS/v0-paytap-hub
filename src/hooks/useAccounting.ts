import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAccounting = (merchantId: string) => {
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch income data
        const { data: incomes, error: incomeError } = await supabase
          .from('incomes')
          .select('*')
          .eq('merchant_id', merchantId);
          
        if (incomeError) throw incomeError;
        setIncomeData(incomes || []);
        
        // Fetch expense data
        const { data: expenses, error: expenseError } = await supabase
          .from('expenses')
          .select('*')
          .eq('merchant_id', merchantId);
          
        if (expenseError) throw expenseError;
        setExpenseData(expenses || []);
        
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching accounting data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (merchantId) {
      fetchData();
    }
  }, [merchantId]);
  
  // Placeholder for income by period function
  const getIncomeByPeriod = async (period: string) => {
    try {
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('merchant_id', merchantId);
        
      if (error) throw error;
      
      // Return the data instead of setting state directly
      return data || [];
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching income by period:', err);
      return [];
    }
  };
  
  return {
    incomeData,
    expenseData,
    loading,
    error,
    getIncomeByPeriod,
  };
};

export default useAccounting;
