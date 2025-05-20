
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, LineChart, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from 'recharts';
import { useToast } from "@/hooks/use-toast";

const mockRevenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { name: 'Feb', revenue: 3000, profit: 1398, expenses: 1602 },
  { name: 'Mar', revenue: 2000, profit: 800, expenses: 1200 },
  { name: 'Apr', revenue: 2780, profit: 1408, expenses: 1372 },
  { name: 'May', revenue: 1890, profit: 1000, expenses: 890 },
  { name: 'Jun', revenue: 2390, profit: 1500, expenses: 890 },
  { name: 'Jul', revenue: 3490, profit: 2100, expenses: 1390 },
];

const mockProductData = [
  { name: 'Product A', sales: 100, revenue: 2500 },
  { name: 'Product B', sales: 85, revenue: 2100 },
  { name: 'Product C', sales: 70, revenue: 1750 },
  { name: 'Product D', sales: 65, revenue: 1625 },
  { name: 'Product E', sales: 50, revenue: 1250 },
];

const mockCustomerData = [
  { name: 'Jan', new: 40, returning: 24 },
  { name: 'Feb', new: 30, returning: 35 },
  { name: 'Mar', new: 20, returning: 40 },
  { name: 'Apr', new: 27, returning: 35 },
  { name: 'May', new: 18, returning: 42 },
  { name: 'Jun', new: 23, returning: 45 },
  { name: 'Jul', new: 34, returning: 50 },
];

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const { toast } = useToast();
  
  const handleExportData = () => {
    toast({
      title: 'Exporting Data',
      description: 'Your analytics data is being exported as CSV'
    });
  };

  return (
    <div className="container p-6 mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">View insights and reports about your business.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Select 
            value={dateRange} 
            onValueChange={setDateRange}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="thismonth">This Month</SelectItem>
              <SelectItem value="lastmonth">Last Month</SelectItem>
              <SelectItem value="thisyear">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$18,550.00</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">↑ 12.2%</span> from previous period
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  width={300} 
                  height={60} 
                  data={mockRevenueData} 
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">↑ 8.4%</span> from previous period
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  width={300} 
                  height={60} 
                  data={mockRevenueData.map(item => ({ name: item.name, orders: item.revenue / 25 }))} 
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">↑ 17.2%</span> from previous period
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  width={300} 
                  height={60} 
                  data={mockCustomerData.map(item => ({ name: item.name, total: item.new + item.returning }))} 
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3 gap-4">
          <TabsTrigger value="sales" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Sales Analytics
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Product Performance
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Customer Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>View your revenue, profit, and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={mockRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                    <Bar dataKey="profit" fill="#10B981" name="Profit" />
                    <Bar dataKey="expenses" fill="#F59E0B" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>See which products are selling best</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={mockProductData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#8B5CF6" name="Units Sold" />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>New vs returning customers over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={mockCustomerData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="new" fill="#3B82F6" name="New Customers" />
                    <Bar dataKey="returning" fill="#8B5CF6" name="Returning Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
