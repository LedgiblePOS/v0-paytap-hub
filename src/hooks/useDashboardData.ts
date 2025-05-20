
import { useState, useEffect } from 'react';
import { TransactionModel } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { toTransactionModels } from '@/utils/modelConversions/transactionConverters';

export interface DashboardData {
  totalRevenue: number;
  transactionCount: number;
  recentTransactions: TransactionModel[];
  customerCount: number;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    totalRevenue: 0,
    transactionCount: 0,
    recentTransactions: [],
    customerCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.merchantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch transaction data
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('merchant_id', user.merchantId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionError) throw transactionError;

        // Calculate total revenue and transaction count
        const { data: revenueData, error: revenueError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('merchant_id', user.merchantId)
          .eq('status', 'completed');

        if (revenueError) throw revenueError;

        // Calculate customer count
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('merchant_id', user.merchantId);

        if (customerError) throw customerError;

        // Convert transaction entities to models
        const recentTransactions = toTransactionModels(transactionData || []);
        
        // Calculate total revenue
        const totalRevenue = revenueData
          ? revenueData.reduce((sum, transaction) => sum + (transaction.amount || 0), 0)
          : 0;

        setData({
          totalRevenue,
          transactionCount: revenueData?.length || 0,
          recentTransactions,
          customerCount: customerData?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
        
        toast({
          title: 'Error',
          description: 'Failed to fetch dashboard data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.merchantId, toast]);

  return { data, loading, error };
}
