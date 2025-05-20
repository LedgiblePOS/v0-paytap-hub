
import { useState } from 'react';
import { ReportType, FinancialSummary, FinancialReportParams } from '@/types/accounting';
import { generateFinancialSummary } from '@/services/accounting/reportingService';
import { useAuth } from './useAuth';

export const useFinancialReporting = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchFinancialSummary = async (params: FinancialReportParams) => {
    if (!user?.merchantId) {
      setError(new Error('No merchant ID available'));
      return null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await generateFinancialSummary(user.merchantId, params);
      setFinancialSummary(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch financial summary');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    financialSummary,
    fetchFinancialSummary,
  };
};

export default useFinancialReporting;
