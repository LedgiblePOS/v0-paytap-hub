
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Users, ShoppingBag, CreditCard } from "lucide-react";
import SystemMetrics from "@/components/SuperAdmin/SystemMetrics";

const Analytics = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <BarChart className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>
      
      <Tabs defaultValue="system">
        <TabsList className="mb-4">
          <TabsTrigger value="system">
            <BarChart className="h-4 w-4 mr-2" />
            System Metrics
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Analytics
          </TabsTrigger>
          <TabsTrigger value="merchants">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Merchant Analytics
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <CreditCard className="h-4 w-4 mr-2" />
            Revenue Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <SystemMetrics />
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of user growth and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Detailed user analytics will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchants">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of merchant performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Detailed merchant analytics will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of platform revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Detailed revenue analytics will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
