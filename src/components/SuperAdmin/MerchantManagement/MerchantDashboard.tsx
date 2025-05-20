
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X } from 'lucide-react';

// Define proper types for merchant data
interface MerchantData {
  id: string;
  business_name?: string;
  business_logo?: string;
  subscription_tier?: string;
  created_at?: string;
  updated_at?: string;
  product_count?: number;
  product_limit?: number;
  country?: string;
  user_id?: string;
  default_currency?: string;
  is_verified?: boolean; // Added proper property name for verification status
}

const MockMerchantData: MerchantData[] = [
  {
    id: '1',
    business_name: 'Acme Corp',
    subscription_tier: 'PROFESSIONAL',
    created_at: '2023-01-15T00:00:00Z',
    product_count: 48,
    product_limit: 100,
    country: 'United States',
    is_verified: true
  },
  {
    id: '2',
    business_name: 'XYZ Industries',
    subscription_tier: 'STARTER',
    created_at: '2023-02-20T00:00:00Z',
    product_count: 12,
    product_limit: 25,
    country: 'Canada',
    is_verified: false
  },
  {
    id: '3',
    business_name: 'Global Traders',
    subscription_tier: 'ENTERPRISE',
    created_at: '2023-03-10T00:00:00Z',
    product_count: 156,
    product_limit: 500,
    country: 'United Kingdom',
    is_verified: true
  }
];

interface MerchantDashboardProps {
  merchants?: MerchantData[];
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ merchants = MockMerchantData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [countryStats, setCountryStats] = useState<{ name: string; count: number }[]>([]);
  
  useEffect(() => {
    // Calculate country statistics
    const countries = merchants.reduce((acc: Record<string, number>, merchant) => {
      const country = merchant.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});
    
    const stats = Object.entries(countries).map(([name, count]) => ({ name, count }));
    setCountryStats(stats);
  }, [merchants]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {merchants.slice(0, 3).map(merchant => (
              <Card key={merchant.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {merchant.business_name}
                    {merchant.is_verified ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <strong>Tier:</strong> {merchant.subscription_tier}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Products:</strong> {merchant.product_count}/{merchant.product_limit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Country:</strong> {merchant.country}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Free', count: 12 },
                      { name: 'Starter', count: 45 },
                      { name: 'Professional', count: 28 },
                      { name: 'Enterprise', count: 10 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>Merchants by Country</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
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

export default MerchantDashboard;
