
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialSummary } from "@/types/accounting";
import { AccountingOverview } from './AccountingOverview';
import { InvoiceManagement } from './InvoiceManagement';
import { TaxReporting } from './TaxReporting';
import { ExpenseTracking } from './ExpenseTracking';
import { useAuth } from '@/hooks/useAuth';

interface AccountingTabsProps {
  financialSummary: FinancialSummary;
  isLoading: boolean;
  error: Error | null;
}

export function AccountingTabs({ financialSummary, isLoading, error }: AccountingTabsProps) {
  const { user } = useAuth();
  
  // Use merchantId instead of merchant_id
  const merchantId = user?.merchantId || '';
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="taxes">Taxes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <AccountingOverview 
          financialSummary={financialSummary}
          isLoading={isLoading}
          error={error}
        />
      </TabsContent>
      
      <TabsContent value="invoices">
        <InvoiceManagement merchantId={merchantId} />
      </TabsContent>
      
      <TabsContent value="expenses">
        <ExpenseTracking merchantId={merchantId} />
      </TabsContent>
      
      <TabsContent value="taxes">
        <TaxReporting merchantId={merchantId} />
      </TabsContent>
    </Tabs>
  );
}
