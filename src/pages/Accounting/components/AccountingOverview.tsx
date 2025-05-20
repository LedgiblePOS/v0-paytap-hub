
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { FinancialSummary } from "@/types/accounting";
import { Skeleton } from '@/components/ui/skeleton';
import { FinancialMetricCard } from './FinancialMetricCard';

interface AccountingOverviewProps {
  financialSummary: FinancialSummary;
  isLoading: boolean;
  error: Error | null;
}

export function AccountingOverview({ financialSummary, isLoading, error }: AccountingOverviewProps) {
  // Fix: Remove any arguments from refreshData call as it expects none
  const refreshData = () => {
    // This function should be implemented to refresh data
    console.log('Refreshing financial data');
    // Actual implementation would call a refresh function from a hook or context
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to load financial summary'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialMetricCard
          title="Revenue"
          value={financialSummary.totalRevenue}
          trend={financialSummary.revenueTrend}
          percentage={financialSummary.revenueGrowth}
          description="Total revenue this month"
        />
        
        <FinancialMetricCard
          title="Expenses"
          value={financialSummary.totalExpenses}
          trend={financialSummary.expenseTrend}
          percentage={financialSummary.expenseGrowth}
          description="Total expenses this month"
          inverseTrend
        />
        
        <FinancialMetricCard
          title="Profit"
          value={financialSummary.totalProfit}
          trend={financialSummary.profitTrend}
          percentage={financialSummary.profitGrowth}
          description="Net profit this month"
        />
        
        <FinancialMetricCard
          title="Outstanding"
          value={financialSummary.outstandingPayments}
          description="Payments pending collection"
          isMonetary
        />
      </div>
    </div>
  );
}
