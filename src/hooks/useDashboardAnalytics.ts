
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateWeeklyRevenue } from '@/services/dashboardService';

export interface AnalyticsData {
  salesData: Array<{ date: string, amount: number }>;
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  customerCount: number;
  revenueTrend: number;
  orderTrend: number;
  aovTrend: number;
  customerTrend: number;
  performanceMetrics: Array<{
    name: string;
    value: number;
    target: number;
    unit?: string;
    trend?: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardAnalytics = (): AnalyticsData => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<Array<{ date: string, amount: number }>>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [revenueTrend, setRevenueTrend] = useState(0);
  const [orderTrend, setOrderTrend] = useState(0);
  const [aovTrend, setAovTrend] = useState(0);
  const [customerTrend, setCustomerTrend] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    Array<{ name: string; value: number; target: number; unit?: string; trend?: number }>
  >([]);
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real application, we would fetch actual data from Supabase or an API
        // For now, we'll use the generateWeeklyRevenue function from dashboardService
        const weeklyData = generateWeeklyRevenue();
        
        // Transform the weekly data to the format needed for charts
        const transformedSalesData = weeklyData.map(item => ({
          date: item.name,
          amount: item.amount,
        }));
        
        setSalesData(transformedSalesData);
        
        // Calculate total revenue
        const calculatedTotalRevenue = transformedSalesData.reduce(
          (sum, item) => sum + item.amount, 0
        );
        setTotalRevenue(calculatedTotalRevenue);
        
        // Set mock data for other metrics
        // In a real application, these would come from API calls
        setOrderCount(Math.floor(calculatedTotalRevenue / 125)); // Assume average order value of $125
        setAverageOrderValue(125);
        setCustomerCount(Math.floor(calculatedTotalRevenue / 250)); // Assume each customer spends $250 on average
        
        // Set mock trends (percentage change vs. previous period)
        setRevenueTrend(12.5); // 12.5% up from last period
        setOrderTrend(8.2);
        setAovTrend(3.7);
        setCustomerTrend(-2.1); // Negative trend example
        
        // Set mock performance metrics
        setPerformanceMetrics([
          {
            name: "Monthly Revenue Goal",
            value: calculatedTotalRevenue,
            target: 10000,
            unit: "$",
            trend: 15.2
          },
          {
            name: "New Customer Acquisition",
            value: Math.floor(calculatedTotalRevenue / 500),
            target: 50,
            trend: -5.3
          },
          {
            name: "Avg. Processing Time",
            value: 3.2,
            target: 2.5,
            unit: " days",
            trend: -2.1
          }
        ]);
        
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user]);

  return {
    salesData,
    totalRevenue,
    orderCount,
    averageOrderValue,
    customerCount,
    revenueTrend,
    orderTrend,
    aovTrend,
    customerTrend,
    performanceMetrics,
    isLoading,
    error
  };
};
