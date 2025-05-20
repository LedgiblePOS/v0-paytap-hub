
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubscriptionManagement from "./SubscriptionManagement";
import MerchantSubscriptionsList from "./components/subscription-management/MerchantSubscriptionsList";
import SubscriptionAnalyticsDashboard from "./components/subscription-management/SubscriptionAnalyticsDashboard";

const SubscriptionManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage subscription plans and monitor merchant subscriptions
        </p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="merchants">Merchant Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <SubscriptionAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="plans">
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="merchants">
          <MerchantSubscriptionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionManagementPage;
