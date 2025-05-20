
import { supabase } from "@/integrations/supabase/client";

export interface SalesProjection {
  period: string;
  projectedSales: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  growthRate: number;
}

export class SalesProjector {
  /**
   * Get historical sales data for a specific period
   * @param merchantId The merchant ID
   * @param startDate The start date of the period
   * @param endDate The end date of the period
   */
  private async getHistoricalSales(
    merchantId: string,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount')
        .eq('merchant_id', merchantId)
        .eq('status', 'COMPLETED')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      if (error) throw error;
      
      return transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
    } catch (error) {
      console.error("Error getting historical sales:", error);
      return 0;
    }
  }
  
  /**
   * Calculate the growth rate between two periods
   * @param currentPeriodSales Sales for the current period
   * @param previousPeriodSales Sales for the previous period
   */
  private calculateGrowthRate(currentPeriodSales: number, previousPeriodSales: number): number {
    if (previousPeriodSales === 0) return 0;
    return (currentPeriodSales - previousPeriodSales) / previousPeriodSales;
  }
  
  /**
   * Determine confidence level based on available data
   * @param transactionCount Number of transactions
   * @param monthsOfData Number of months with data
   */
  private determineConfidenceLevel(transactionCount: number, monthsOfData: number): 'low' | 'medium' | 'high' {
    if (monthsOfData < 3 || transactionCount < 20) return 'low';
    if (monthsOfData < 6 || transactionCount < 50) return 'medium';
    return 'high';
  }
  
  /**
   * Project monthly sales for the next specified number of months
   * @param merchantId The merchant ID
   * @param months Number of months to project
   */
  public async projectMonthlySales(
    merchantId: string,
    months: number = 3
  ): Promise<SalesProjection[]> {
    const projections: SalesProjection[] = [];
    const now = new Date();
    
    try {
      // Get transaction count for confidence level
      const { count: transactionCount, error: countError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantId)
        .eq('status', 'COMPLETED');
      
      if (countError) throw countError;
      
      // Get sales for the last 6 months to establish trend
      const historicalData: {month: number; year: number; sales: number}[] = [];
      
      for (let i = 6; i >= 1; i--) {
        const targetMonth = new Date();
        targetMonth.setMonth(now.getMonth() - i);
        
        const startDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
        const endDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
        
        const sales = await this.getHistoricalSales(merchantId, startDate, endDate);
        
        historicalData.push({
          month: targetMonth.getMonth(),
          year: targetMonth.getFullYear(),
          sales
        });
      }
      
      // Calculate average growth rate
      let totalGrowthRate = 0;
      let growthRateCount = 0;
      
      for (let i = 1; i < historicalData.length; i++) {
        const currentSales = historicalData[i].sales;
        const previousSales = historicalData[i-1].sales;
        
        if (previousSales > 0) {
          const growthRate = this.calculateGrowthRate(currentSales, previousSales);
          totalGrowthRate += growthRate;
          growthRateCount++;
        }
      }
      
      const avgGrowthRate = growthRateCount > 0 ? totalGrowthRate / growthRateCount : 0;
      
      // Calculate confidence level
      const confidenceLevel = this.determineConfidenceLevel(
        transactionCount || 0, 
        historicalData.filter(d => d.sales > 0).length
      );
      
      // Get the most recent month's sales as the baseline
      const lastMonthSales = historicalData.length > 0 
        ? historicalData[historicalData.length - 1].sales 
        : 0;
      
      // Project sales for future months
      for (let i = 1; i <= months; i++) {
        const targetMonth = new Date();
        targetMonth.setMonth(now.getMonth() + i);
        
        const projectedSales = lastMonthSales * Math.pow(1 + avgGrowthRate, i);
        
        projections.push({
          period: targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          projectedSales: Math.max(0, projectedSales), // Ensure non-negative
          confidenceLevel,
          growthRate: avgGrowthRate
        });
      }
      
      return projections;
    } catch (error) {
      console.error("Error projecting sales:", error);
      return [];
    }
  }
}

export default new SalesProjector();
