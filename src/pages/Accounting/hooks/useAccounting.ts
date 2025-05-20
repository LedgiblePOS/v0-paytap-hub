
import { useState, useEffect } from 'react';
import { FinancialSummary, FinancialReportParams } from '@/types/accounting';
import { useAuth } from '@/hooks/useAuth';
import { fetchFinancialSummary as apiFetchFinancialSummary } from '@/services/accounting/financialService';

interface UseAccountingReturn {
  isLoading: boolean;
  error: Error | null;
  financialSummary: FinancialSummary;
  fetchFinancialSummary: (params: FinancialReportParams) => Promise<FinancialSummary>;
}

export const useAccounting = (): UseAccountingReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    outstandingPayments: 0,
    revenueTrend: 'UP',
    expenseTrend: 'DOWN',
    profitTrend: 'UP',
    revenueGrowth: 5.2,
    expenseGrowth: -2.1,
    profitGrowth: 7.8,
    topExpenseCategories: [],
    topRevenueStreams: []
  });

  const fetchFinancialSummary = async (params: FinancialReportParams): Promise<FinancialSummary> => {
    if (!user?.merchantId) {
      setError(new Error('No merchant ID available'));
      return financialSummary;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await apiFetchFinancialSummary({
        ...params,
        merchantId: user.merchantId
      });
      
      setFinancialSummary(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch financial data';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    financialSummary,
    fetchFinancialSummary
  };
};
