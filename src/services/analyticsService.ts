
// Mock analytics service functions
import { supabase } from '@/integrations/supabase/client';

export const getTransactionAnalytics = async (merchantId: string, dateRange?: { start: string, end: string }) => {
  try {
    // Mock data for transaction analytics
    return {
      totalTransactions: 152,
      totalAmount: 12450.75,
      averageTransactionAmount: 81.91,
      paymentMethodBreakdown: [
        { method: 'CARD', count: 98, percentage: 64.5 },
        { method: 'CASH', count: 32, percentage: 21.1 },
        { method: 'TAP_TO_PAY', count: 22, percentage: 14.4 }
      ]
    };
  } catch (error) {
    console.error('Error fetching transaction analytics:', error);
    throw error;
  }
};

export const getProductAnalytics = async (merchantId: string, dateRange?: { start: string, end: string }) => {
  try {
    // Mock data for product analytics
    return {
      totalProducts: 45,
      totalSold: 325,
      topCategories: [
        { name: 'Electronics', count: 120, revenue: 8750.50 },
        { name: 'Clothing', count: 85, revenue: 2125.25 },
        { name: 'Home Goods', count: 45, revenue: 1575.00 }
      ],
      lowStockItems: 8
    };
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    throw error;
  }
};

export const getSalesByTimePeriod = async (merchantId: string, period: 'day' | 'week' | 'month' | 'year', dateRange?: { start: string, end: string }) => {
  try {
    // Mock data for sales by time period
    const mockData = [
      { date: '2023-01-01', sales: 1245.75 },
      { date: '2023-02-01', sales: 1578.25 },
      { date: '2023-03-01', sales: 2145.50 },
      { date: '2023-04-01', sales: 1875.00 },
      { date: '2023-05-01', sales: 2450.75 },
      { date: '2023-06-01', sales: 3120.25 },
      { date: '2023-07-01', sales: 2875.50 },
      { date: '2023-08-01', sales: 3450.75 },
      { date: '2023-09-01', sales: 3875.25 },
      { date: '2023-10-01', sales: 4250.50 },
      { date: '2023-11-01', sales: 3975.00 },
      { date: '2023-12-01', sales: 4750.75 }
    ];
    
    return mockData;
  } catch (error) {
    console.error('Error fetching sales by time period:', error);
    throw error;
  }
};

export const getTopSellingProducts = async (merchantId: string, limit: number = 10, dateRange?: { start: string, end: string }) => {
  try {
    // Mock data for top selling products
    return [
      { id: 'prod-1', name: 'Wireless Headphones', sold: 45, revenue: 2250.00 },
      { id: 'prod-2', name: 'Smart Watch', sold: 32, revenue: 4800.00 },
      { id: 'prod-3', name: 'Laptop Stand', sold: 28, revenue: 840.00 },
      { id: 'prod-4', name: 'Phone Charger', sold: 25, revenue: 500.00 },
      { id: 'prod-5', name: 'Bluetooth Speaker', sold: 22, revenue: 1100.00 }
    ];
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    throw error;
  }
};

export const getCustomerInsights = async (merchantId: string, dateRange?: { start: string, end: string }) => {
  try {
    // Mock data for customer insights
    return {
      totalCustomers: 215,
      newCustomers: 28,
      returningCustomers: 187,
      averageOrderValue: 85.75,
      customerRetentionRate: 87.5,
      topCustomers: [
        { id: 'cust-1', name: 'John Doe', purchases: 12, total: 975.50 },
        { id: 'cust-2', name: 'Jane Smith', purchases: 10, total: 825.75 },
        { id: 'cust-3', name: 'Bob Johnson', purchases: 8, total: 720.00 }
      ]
    };
  } catch (error) {
    console.error('Error fetching customer insights:', error);
    throw error;
  }
};
