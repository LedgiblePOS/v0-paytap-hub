
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag } from "lucide-react";

// Mock data for KPIs over time
const kpiTrendData = [
  { month: "Jan", revenue: 45000, userGrowth: 12, avgOrderValue: 78, merchantCount: 24 },
  { month: "Feb", revenue: 52000, userGrowth: 18, avgOrderValue: 82, merchantCount: 26 },
  { month: "Mar", revenue: 58000, userGrowth: 15, avgOrderValue: 85, merchantCount: 28 },
  { month: "Apr", revenue: 65000, userGrowth: 22, avgOrderValue: 88, merchantCount: 32 },
  { month: "May", revenue: 72000, userGrowth: 28, avgOrderValue: 92, merchantCount: 34 },
  { month: "Jun", revenue: 80000, userGrowth: 25, avgOrderValue: 95, merchantCount: 35 },
];

// Mock data for revenue by merchant category
const revenueByCategory = [
  { category: "Retail", revenue: 32500 },
  { category: "Food & Beverage", revenue: 24800 },
  { category: "Services", revenue: 18200 },
  { category: "Health & Beauty", revenue: 14500 },
  { category: "Others", revenue: 10000 },
];

// Mock data for user growth
const userGrowthData = [
  { quarter: "Q1", merchants: 22, customers: 4500 },
  { quarter: "Q2", merchants: 28, customers: 5800 },
  { quarter: "Q3", merchants: 32, customers: 7200 },
  { quarter: "Q4", merchants: 36, customers: 8600 },
];

const BusinessKPIReport: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Business KPI Dashboard</h1>
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$80,000</h3>
              </div>
              <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">User Growth</p>
                <h3 className="text-2xl font-bold mt-1">25%</h3>
              </div>
              <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+3% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                <h3 className="text-2xl font-bold mt-1">$95</h3>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-full">
                <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+3.2% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total Merchants</p>
                <h3 className="text-2xl font-bold mt-1">36</h3>
              </div>
              <div className="bg-amber-100 dark:bg-amber-800/30 p-2 rounded-full">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm font-medium text-amber-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2 new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>
            Monthly revenue growth over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#1677ff" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Category & User Growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>
              Distribution of revenue across merchant categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              Growth of merchants and customers by quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="merchants" fill="#8884d8" name="Merchants" />
                  <Bar yAxisId="right" dataKey="customers" fill="#82ca9d" name="Customers (x100)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* KPI Trends Table */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Trends</CardTitle>
          <CardDescription>
            Monthly progression of key performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Month</th>
                  <th className="py-2 px-4 text-right">Revenue</th>
                  <th className="py-2 px-4 text-right">User Growth %</th>
                  <th className="py-2 px-4 text-right">Avg. Order Value</th>
                  <th className="py-2 px-4 text-right">Merchants</th>
                </tr>
              </thead>
              <tbody>
                {kpiTrendData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 text-left">{data.month}</td>
                    <td className="py-2 px-4 text-right">${data.revenue.toLocaleString()}</td>
                    <td className="py-2 px-4 text-right">{data.userGrowth}%</td>
                    <td className="py-2 px-4 text-right">${data.avgOrderValue}</td>
                    <td className="py-2 px-4 text-right">{data.merchantCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessKPIReport;
