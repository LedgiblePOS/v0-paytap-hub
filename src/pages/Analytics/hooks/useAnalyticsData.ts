
import { useState, useEffect } from 'react';
import { 
  getTransactionAnalytics, 
  getProductAnalytics, 
  getSalesByTimePeriod, 
  getTopSellingProducts, 
  getCustomerInsights 
} from '@/services/analyticsService';

export const useAnalyticsData = (merchantId: string | null, dateRange?: { start: string, end: string }) => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [salesByPeriod, setSalesByPeriod] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [customerInsights, setCustomerInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!merchantId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [
          transactionResult,
          productResult,
          salesResult,
          topProductsResult,
          customerResult
        ] = await Promise.all([
          getTransactionAnalytics(merchantId, dateRange),
          getProductAnalytics(merchantId, dateRange),
          getSalesByTimePeriod(merchantId, 'month', dateRange),
          getTopSellingProducts(merchantId, 5, dateRange),
          getCustomerInsights(merchantId, dateRange)
        ]);
        
        setTransactionData(transactionResult);
        setProductData(productResult);
        setSalesByPeriod(salesResult);
        setTopProducts(topProductsResult);
        setCustomerInsights(customerResult);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [merchantId, dateRange]);
  
  return {
    transactionData,
    productData,
    salesByPeriod,
    topProducts,
    customerInsights,
    loading,
    error
  };
};
