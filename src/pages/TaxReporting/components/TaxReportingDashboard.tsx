
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTaxSummary } from '../hooks/useTaxSummary';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, AlertTriangle, TrendingUp, ChevronRight, BarChart3, PieChart, LineChart as LineChartIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface TaxReportingDashboardProps {
  period: string;
}

const TaxReportingDashboard: React.FC<TaxReportingDashboardProps> = ({ period }) => {
  const { taxData, chartData, isLoading, error } = useTaxSummary(period);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Tax Data</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tax Obligations</CardTitle>
            <p className="text-muted-foreground text-sm">
              Summary of tax obligations for the {period} period
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sales Tax:</span>
                <span className="font-medium">${taxData.salesTax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">State Tax:</span>
                <span className="font-medium">${taxData.stateTax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Local Tax:</span>
                <span className="font-medium">${taxData.localTax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Total Tax Due:</span>
                <span className="font-bold">${taxData.totalTax.toFixed(2)}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge variant={taxData.isPaid ? "success" : "destructive"}>
                    {taxData.isPaid ? "Paid" : "Pending"}
                  </Badge>
                </div>
                {!taxData.isPaid && taxData.dueDate && (
                  <div className="text-sm text-muted-foreground mt-2 flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    Due date: {new Date(taxData.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          {taxData.filingStatus && (
            <CardFooter className="border-t pt-4">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Filing Status</span>
                  <Badge variant={
                    taxData.filingStatus === 'filed' ? "success" : 
                    taxData.filingStatus === 'late' ? "destructive" : "outline"
                  }>
                    {taxData.filingStatus === 'filed' ? 'Filed' : 
                     taxData.filingStatus === 'late' ? 'Late' : 'Pending'}
                  </Badge>
                </div>
                <Progress 
                  value={taxData.filingStatus === 'filed' ? 100 : 
                         taxData.filingStatus === 'late' ? 100 : 30} 
                  className={
                    taxData.filingStatus === 'filed' ? "bg-green-100" :
                    taxData.filingStatus === 'late' ? "bg-red-100" : ""
                  }
                />
              </div>
            </CardFooter>
          )}
        </Card>
        
        <Tabs defaultValue="bar" className="w-full">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Tax Breakdown</CardTitle>
                <TabsList className="grid w-[180px] grid-cols-3">
                  <TabsTrigger value="bar" className="h-8 px-2">
                    <BarChart3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="line" className="h-8 px-2">
                    <LineChartIcon className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="trend" className="h-8 px-2">
                    <TrendingUp className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </div>
              <p className="text-muted-foreground text-sm">
                Visualization of your tax distribution
              </p>
            </CardHeader>
            <CardContent>
              <TabsContent value="bar" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="salesTax" name="Sales Tax" fill="#3b82f6" />
                    <Bar dataKey="stateTax" name="State Tax" fill="#10b981" />
                    <Bar dataKey="localTax" name="Local Tax" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="line" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Total Tax" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="trend" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                    <Legend />
                    <Line type="monotone" dataKey="salesTax" name="Sales Tax" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="stateTax" name="State Tax" stroke="#10b981" />
                    <Line type="monotone" dataKey="localTax" name="Local Tax" stroke="#f59e0b" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      {/* Tax Calendar Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Upcoming Tax Deadlines</CardTitle>
          <p className="text-muted-foreground text-sm">
            Mark your calendar for these important tax dates
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Quarterly Sales Tax Filing",
                date: "April 15, 2025",
                amount: "$1,245.00",
                status: "upcoming"
              },
              {
                title: "Annual Business License Renewal",
                date: "May 31, 2025",
                amount: "$350.00",
                status: "upcoming"
              },
              {
                title: "Local Business Tax",
                date: "March 1, 2025",
                amount: "$175.50",
                status: "overdue"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${
                  item.status === 'overdue' ? 'border-red-200 bg-red-50' : 
                  'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {item.date}
                    </p>
                  </div>
                  {item.status === 'overdue' && (
                    <Badge variant="destructive">Overdue</Badge>
                  )}
                </div>
                <div className="mt-2 text-lg font-bold">{item.amount}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full text-right">
            <a href="#" className="text-sm text-primary flex items-center justify-end">
              <span>View complete tax calendar</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaxReportingDashboard;
