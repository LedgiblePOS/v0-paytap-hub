
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { taxCalculator } from "@/services/tax/taxCalculator";
import { getTaxSettings, getDefaultTaxSettings } from "@/services/tax/taxSettingsService";

// Define tax data interface
export interface TaxSummaryData {
  salesTax: number;
  stateTax: number;
  localTax: number;
  totalTax: number;
  isPaid: boolean;
  dueDate?: string;
  filingStatus?: 'pending' | 'filed' | 'late';
}

// Monthly data type for the chart
export interface MonthlyTaxData {
  month: string;
  salesTax: number;
  stateTax: number;
  localTax: number;
  total: number;
}

export const useTaxSummary = (period: string) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [taxData, setTaxData] = useState<TaxSummaryData>({
    salesTax: 0,
    stateTax: 0,
    localTax: 0,
    totalTax: 0,
    isPaid: false
  });
  const [chartData, setChartData] = useState<MonthlyTaxData[]>([]);

  // Load tax data based on selected period
  useEffect(() => {
    const fetchTaxData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch this data from the database
        // For now, we'll use mock data with our tax calculator
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        // Get tax settings (or default if not found)
        const merchantId = user.id;
        const taxSettings = await getTaxSettings(merchantId) || 
          getDefaultTaxSettings(merchantId);
        
        let periodData;
        if (period === 'monthly') {
          // Last month data
          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);
          periodData = await taxCalculator.calculateTaxes(
            merchantId, 
            startDate, 
            endDate,
            taxSettings.salesTaxRate / 100
          );
        } else if (period === 'quarterly') {
          // Current quarter data
          const currentQuarter = Math.floor(month / 3);
          const startMonth = currentQuarter * 3;
          const startDate = new Date(year, startMonth, 1);
          const endDate = new Date(year, startMonth + 3, 0);
          periodData = await taxCalculator.calculateTaxes(
            merchantId, 
            startDate, 
            endDate,
            taxSettings.salesTaxRate / 100
          );
        } else {
          // Yearly data
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31);
          periodData = await taxCalculator.calculateTaxes(
            merchantId, 
            startDate, 
            endDate,
            taxSettings.salesTaxRate / 100
          );
        }
        
        // Calculate different tax components
        const salesTaxAmount = periodData.totalSales * (taxSettings.salesTaxRate / 100);
        const stateTaxAmount = periodData.totalSales * (taxSettings.stateTaxRate / 100);
        const localTaxAmount = periodData.totalSales * (taxSettings.localTaxRate / 100);
        const totalTaxAmount = salesTaxAmount + stateTaxAmount + localTaxAmount;
        
        // Set the tax data
        setTaxData({
          salesTax: salesTaxAmount,
          stateTax: stateTaxAmount,
          localTax: localTaxAmount,
          totalTax: totalTaxAmount,
          isPaid: false,
          dueDate: new Date(year, month + 1, 15).toISOString(),
          filingStatus: 'pending'
        });
        
        // Generate chart data (six months)
        const monthlyData: MonthlyTaxData[] = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for (let i = 5; i >= 0; i--) {
          const dataMonth = (month - i + 12) % 12; // Handle wrapping around to previous year
          const sales = 10000 + Math.random() * 5000; // Mock data
          const salesTax = sales * (taxSettings.salesTaxRate / 100);
          const stateTax = sales * (taxSettings.stateTaxRate / 100);
          const localTax = sales * (taxSettings.localTaxRate / 100);
          
          monthlyData.push({
            month: monthNames[dataMonth],
            salesTax: parseFloat(salesTax.toFixed(2)),
            stateTax: parseFloat(stateTax.toFixed(2)),
            localTax: parseFloat(localTax.toFixed(2)),
            total: parseFloat((salesTax + stateTax + localTax).toFixed(2))
          });
        }
        
        setChartData(monthlyData);
      } catch (err) {
        console.error("Error loading tax data:", err);
        setError(err instanceof Error ? err : new Error('Failed to load tax data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaxData();
  }, [user, period]);

  // Tax chart configuration
  const taxChartConfig = useMemo(() => ({
    salesTax: {
      label: "Sales Tax",
      theme: {
        light: "hsl(220, 90%, 60%)",
        dark: "hsl(220, 90%, 60%)"
      }
    },
    stateTax: {
      label: "State Tax",
      theme: {
        light: "hsl(150, 60%, 50%)",
        dark: "hsl(150, 60%, 50%)"
      }
    },
    localTax: {
      label: "Local Tax",
      theme: {
        light: "hsl(40, 90%, 60%)",
        dark: "hsl(40, 90%, 60%)"
      }
    }
  }), []);

  // Next tax payment information
  const nextPaymentDue = useMemo(() => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days
    
    return {
      title: "Quarterly Sales Tax",
      date: dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      amount: taxData.totalTax
    };
  }, [taxData.totalTax]);

  return {
    taxData,
    chartData,
    taxChartConfig,
    nextPaymentDue,
    isLoading,
    error
  };
};
