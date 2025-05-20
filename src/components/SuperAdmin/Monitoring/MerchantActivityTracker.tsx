
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

// Mock data for merchant activity
const merchantActivities = [
  { 
    id: "m1", 
    name: "Acme Store", 
    lastActive: new Date(Date.now() - 1000 * 60 * 15), 
    status: "active",
    transactions: 128,
    revenue: 5840.50,
    newCustomers: 12
  },
  { 
    id: "m2", 
    name: "Globex Trading", 
    lastActive: new Date(Date.now() - 1000 * 60 * 45), 
    status: "active",
    transactions: 86,
    revenue: 3210.25,
    newCustomers: 8
  },
  { 
    id: "m3", 
    name: "Oceanic Retail", 
    lastActive: new Date(Date.now() - 1000 * 60 * 180), 
    status: "idle",
    transactions: 54,
    revenue: 2150.00,
    newCustomers: 6
  },
  { 
    id: "m4", 
    name: "Initech Solutions", 
    lastActive: new Date(Date.now() - 1000 * 60 * 360), 
    status: "idle",
    transactions: 32,
    revenue: 1680.75,
    newCustomers: 4
  },
  { 
    id: "m5", 
    name: "Massive Dynamic", 
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), 
    status: "inactive",
    transactions: 0,
    revenue: 0,
    newCustomers: 0
  },
];

// Mock data for activity distribution
const activityDistribution = [
  { name: "Transactions", value: 42, color: "#1677ff" },
  { name: "Product Updates", value: 28, color: "#52c41a" },
  { name: "Customer Management", value: 18, color: "#722ed1" },
  { name: "Settings Changes", value: 12, color: "#fa8c16" },
];

// Mock data for activity over time
const activityTimeData = [
  { day: "Mon", transactions: 245, logins: 36 },
  { day: "Tue", transactions: 288, logins: 42 },
  { day: "Wed", transactions: 356, logins: 48 },
  { day: "Thu", transactions: 279, logins: 38 },
  { day: "Fri", transactions: 340, logins: 52 },
  { day: "Sat", transactions: 152, logins: 24 },
  { day: "Sun", transactions: 128, logins: 18 },
];

const MerchantActivityTracker: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "idle": return "bg-amber-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Merchant Activity Tracking</h1>
        <Badge variant="outline" className="ml-2 px-3 py-1">
          {merchantActivities.filter(m => m.status === "active").length} Active Merchants
        </Badge>
      </div>
      
      {/* Activity Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold">36</h3>
              <p className="text-sm text-muted-foreground mt-1">Total Merchants</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold">24</h3>
              <p className="text-sm text-muted-foreground mt-1">Active Today</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold">3</h3>
              <p className="text-sm text-muted-foreground mt-1">New this Week</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Merchant Activity</CardTitle>
          <CardDescription>
            Current status and recent activity of merchants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">New Customers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchantActivities.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell className="font-medium">{merchant.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(merchant.status)}`} />
                      <span className="capitalize">{merchant.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(merchant.lastActive, { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">{merchant.transactions}</TableCell>
                  <TableCell className="text-right">${merchant.revenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{merchant.newCustomers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Activity Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
            <CardDescription>
              Types of activities performed by merchants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Over Time</CardTitle>
            <CardDescription>
              Transactions and logins over the last week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="transactions" stroke="#1677ff" name="Transactions" />
                  <Line type="monotone" dataKey="logins" stroke="#52c41a" name="Logins" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantActivityTracker;
