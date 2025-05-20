
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTab from '@/components/Payments/TransactionsTab';
import PaymentSettingsTab from './components/PaymentSettingsTab';
import PaymentMethodsTab from './components/PaymentMethodsTab';

const PaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  
  return (
    <div className="container p-6 mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage your payment processing and transaction history.</p>
      </div>
      
      <Card className="overflow-hidden">
        <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-6">
            <TabsList className="w-full sm:w-auto flex flex-wrap">
              <TabsTrigger value="transactions" className="flex-1 sm:flex-none">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="methods" className="flex-1 sm:flex-none">
                Payment Methods
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 sm:flex-none">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-0">
            <TabsContent value="transactions" className="m-0">
              <TransactionsTab />
            </TabsContent>
            
            <TabsContent value="methods" className="m-0">
              <PaymentMethodsTab />
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <PaymentSettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default PaymentsPage;
