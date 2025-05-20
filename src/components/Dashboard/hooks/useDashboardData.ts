
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [customerInsights, setCustomerInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock data for now - in a real application, this would fetch from an API or Supabase
        setTotalRevenue(12589.45);
        setTotalCustomers(256);
        setTotalProducts(86);
        setCustomerInsights([
          { id: 1, type: 'new', count: 24 },
          { id: 2, type: 'returning', count: 38 },
          { id: 3, type: 'inactive', count: 12 }
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    totalRevenue,
    totalCustomers,
    totalProducts,
    customerInsights,
    loading,
    error
  };
};

export default useDashboardData;
