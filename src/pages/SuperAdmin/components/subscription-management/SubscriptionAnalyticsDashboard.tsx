import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Loader2 } from 'lucide-react';
import { useMerchantSubscriptions } from '@/hooks/useMerchantSubscriptions';
import { SubscriptionTier } from '@/types/subscription';

const SubscriptionAnalyticsDashboard: React.FC = () => {
  const { subscriptionStats, isLoadingStats } = useMerchantSubscriptions();
  
  if (isLoadingStats) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading subscription analytics...</span>
      </div>
    );
  }
  
  // Prepare data for charts
  const tierCounts = subscriptionStats?.tierCounts || {};
  
  const getColor = (tier: string) => {
    switch(tier) {
      case SubscriptionTier.FREE: return '#CBD5E1'; // Gray
      case SubscriptionTier.STARTER: return '#60A5FA'; // Blue
      case SubscriptionTier.PROFESSIONAL: return '#34D399'; // Green
      case SubscriptionTier.ENTERPRISE: return '#C084FC'; // Purple
      case SubscriptionTier.BUSINESS: return '#FBBF24'; // Amber
      case SubscriptionTier.GO_GLOBAL: return '#22D3EE'; // Cyan
      default: return '#94A3B8'; // Gray
    }
  };
  
  // Distribution pie chart data
  const pieChartData = {
    labels: Object.keys(tierCounts),
    datasets: [
      {
        label: 'Merchants',
        data: Object.values(tierCounts),
        backgroundColor: Object.keys(tierCounts).map(getColor),
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };
  
  // Revenue by tier bar chart
  const revenueData = subscriptionStats?.revenueByTier || {};
  const barChartData = {
    labels: Object.keys(revenueData),
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: Object.values(revenueData),
        backgroundColor: Object.keys(revenueData).map(getColor),
      },
    ],
  };
  
  // Mock growth data (for demonstration)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = monthNames.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
  
  const lineChartData = {
    labels: last6Months,
    datasets: [
      {
        label: SubscriptionTier.STARTER,
        data: [10, 12, 15, 18, 20, 22],
        borderColor: getColor(SubscriptionTier.STARTER),
        backgroundColor: `${getColor(SubscriptionTier.STARTER)}33`,
        tension: 0.3,
      },
      {
        label: SubscriptionTier.PROFESSIONAL,
        data: [5, 7, 8, 10, 13, 15],
        borderColor: getColor(SubscriptionTier.PROFESSIONAL),
        backgroundColor: `${getColor(SubscriptionTier.PROFESSIONAL)}33`,
        tension: 0.3,
      },
      {
        label: SubscriptionTier.ENTERPRISE,
        data: [2, 3, 4, 4, 5, 7],
        borderColor: getColor(SubscriptionTier.ENTERPRISE),
        backgroundColor: `${getColor(SubscriptionTier.ENTERPRISE)}33`,
        tension: 0.3,
      },
    ],
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subscriptionStats?.totalMerchants || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all subscription plans
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(subscriptionStats?.monthlyRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recurring subscription revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Object.entries(tierCounts)
                .filter(([tier]) => tier !== SubscriptionTier.FREE)
                .reduce((sum, [, count]) => sum + count, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Premium tier merchants
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Revenue Per Merchant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                (subscriptionStats?.totalMerchants || 0) > 0 
                  ? (subscriptionStats?.monthlyRevenue || 0) / (subscriptionStats?.totalMerchants || 1)
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Monthly average
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <PieChart data={pieChartData} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Tier</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-80">
              <BarChart data={barChartData} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Growth Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80">
            <LineChart data={lineChartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionAnalyticsDashboard;
