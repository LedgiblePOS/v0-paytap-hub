
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStats from '@/components/Dashboard/DashboardStats';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardAnalytics from './components/DashboardAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useDashboardData();
  const { toast } = useToast();

  const handleRefresh = () => {
    // This would trigger a refetch in a real implementation
    toast({
      title: "Refreshing dashboard",
      description: "Your dashboard data is being updated"
    });
  };

  return (
    <div className="container p-6 mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your merchant dashboard.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="w-full md:w-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      
      <DashboardStats 
        isLoading={loading}
        totalRevenue={data.totalRevenue}
        transactionCount={data.transactionCount}
        productCount={data.recentTransactions.length}
        customerCount={data.customerCount}
      />
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 gap-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="recentOrders">Recent Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="p-0 border-none">
          <DashboardAnalytics period="weekly" />
        </TabsContent>
        
        <TabsContent value="recentOrders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-gray-300 rounded-full"></div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Recent orders will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-gray-300 rounded-full"></div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Inventory information will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
