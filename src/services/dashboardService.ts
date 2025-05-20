
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { Merchant } from "@/types";
import { SubscriptionTier } from "@/types";
import { toTransactionEntities, toTransactionModels } from "@/utils/modelConversions";

// Fetch merchant data from Supabase
export const fetchMerchantData = async (userId: string): Promise<Merchant> => {
  try {
    const { data, error } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    
    return data as Merchant;
  } catch (error) {
    console.error('Error fetching merchant data:', error);
    // Return mock data as fallback for development
    return {
      id: "merchant-1",
      user_id: userId,
      business_name: "Mock Merchant",
      business_logo: "logo.png",
      subscription_tier: SubscriptionTier.GO_GLOBAL,
      product_limit: 1000,
      product_count: 500,
      country: "USA",
      default_currency: "USD",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
};

// Fetch recent transactions from Supabase
export const fetchRecentTransactions = async (merchantId: string) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    return toTransactionModels(data as Transaction[]);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return mock data as fallback for development
    const mockTransactions: Transaction[] = [
      {
        id: "transaction-1",
        merchant_id: merchantId,
        customer_id: "customer-1",
        amount: 50.00,
        status: "COMPLETED",
        payment_method: "CARD",
        reference: "REF123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "transaction-2",
        merchant_id: merchantId,
        customer_id: "customer-2",
        amount: 100.00,
        status: "COMPLETED",
        payment_method: "CASH",
        reference: "REF456",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    return toTransactionModels(mockTransactions);
  }
};

// Get dashboard stats including inventory and customer data
export const getDashboardStats = async (merchantId: string) => {
  try {
    // Fetch inventory summary
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, in_stock')
      .eq('merchant_id', merchantId);
    
    if (productsError) throw productsError;
    
    const inventorySummary = {
      totalProducts: products.length,
      lowStockCount: products.filter(p => p.in_stock > 0 && p.in_stock < 10).length,
      outOfStockCount: products.filter(p => !p.in_stock || p.in_stock <= 0).length
    };
    
    // Fetch customer stats
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, created_at')
      .eq('merchant_id', merchantId);
    
    if (customersError) throw customersError;
    
    // Get the first day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const customerStats = {
      totalCustomers: customers.length,
      newCustomersThisMonth: customers.filter(c => c.created_at >= firstDayOfMonth).length
    };
    
    return {
      inventorySummary,
      customerStats
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return mock data as fallback
    return {
      inventorySummary: {
        totalProducts: 45,
        lowStockCount: 8,
        outOfStockCount: 3
      },
      customerStats: {
        totalCustomers: 78,
        newCustomersThisMonth: 12
      }
    };
  }
};

// Generate weekly revenue data
export const generateWeeklyRevenue = () => {
  try {
    // In a real implementation, this would fetch from Supabase
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      weeklyData.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: Math.floor(Math.random() * 1000) + 500,
      });
    }
    
    return weeklyData;
  } catch (error) {
    console.error('Error generating weekly revenue data:', error);
    return [];
  }
};

// Alias for backward compatibility
export const getDashboardData = async () => {
  // This function is maintained for backward compatibility
  // In a real application, you would fetch this data from Supabase
  const mockMerchants = [
    {
      id: "merchant-1",
      user_id: "user-1",
      business_name: "Mock Merchant",
      business_logo: "logo.png",
      subscription_tier: SubscriptionTier.GO_GLOBAL,
      product_limit: 1000,
      product_count: 500,
      country: "USA",
      default_currency: "USD",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockTransactions = [
    {
      id: "transaction-1",
      merchant_id: "merchant-1",
      customer_id: "customer-1",
      amount: 50.00,
      status: "COMPLETED",
      payment_method: "CARD",
      reference: "REF123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "transaction-2",
      merchant_id: "merchant-1",
      customer_id: "customer-2",
      amount: 100.00,
      status: "COMPLETED",
      payment_method: "CASH",
      reference: "REF456",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const merchant = {
    user_id: mockMerchants[0].user_id,
    business_name: mockMerchants[0].business_name,
    business_logo: mockMerchants[0].business_logo,
    subscription_tier: mockMerchants[0].subscription_tier,
    product_limit: mockMerchants[0].product_limit,
    product_count: mockMerchants[0].product_count,
  };

  const totalRevenue = mockTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const recentTransactions = mockTransactions.slice(0, 5);

  // Convert transactions to the model format before returning
  const transactionModels = toTransactionModels(recentTransactions);

  return {
    merchant,
    totalRevenue,
    recentTransactions: transactionModels,
  };
};
