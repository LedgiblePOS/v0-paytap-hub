
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from './hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowDown,
  ArrowUp,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { SubscriptionTier } from '@/types/enums';
import { MerchantModel } from '@/types/models';

interface DashboardCardProps {
  title: string;
  value: string | number;
  isLoading: boolean;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  icon?: React.ReactNode;
}

// Helper functions for merchant data conversion
export function fixMerchantEntity(data: any) {
  return {
    ...data,
    name: data.name || data.business_name || 'Unnamed Merchant'
  };
}

export function toConsistentMerchantModel(entity: any): MerchantModel {
  return {
    id: entity.id || '',
    userId: entity.user_id || '',
    businessName: entity.business_name || entity.name || '',
    businessEmail: entity.business_email || '',
    businessPhone: entity.business_phone || '',
    businessAddress: entity.business_address || '',
    country: entity.country || '',
    city: entity.city || '',
    state: entity.state || '',
    zipCode: entity.zip_code || '',
    isActive: entity.is_active !== false,
    isVerified: entity.is_verified === true,
    verificationData: entity.verification_data || null,
    subscriptionTier: entity.subscription_tier || SubscriptionTier.FREE,
    productCount: entity.product_count || 0,
    productLimit: entity.product_limit || 10,
    defaultCurrency: entity.default_currency || 'USD', // Added missing field
    createdAt: entity.created_at || new Date().toISOString(),
    updatedAt: entity.updated_at || new Date().toISOString()
  };
}

export function fixMerchantEntitiesForAdmin(entities: any[]): any[] {
  return entities.map(entity => ({
    ...entity,
    name: entity.name || entity.business_name || 'Unnamed Merchant'
  }));
}

export function toConsistentMerchantModels(entities: any[]): MerchantModel[] {
  return entities.map(entity => toConsistentMerchantModel(entity));
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, isLoading, trend, trendValue, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-6 w-24" /> : value}
        </div>
        {trend && trendValue !== undefined && (
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            {trend === 'up' && <ArrowUp className="mr-1 h-4 w-4 text-green-500" />}
            {trend === 'down' && <ArrowDown className="mr-1 h-4 w-4 text-red-500" />}
            <span>
              {trend === 'up' ? '+' : ''}{trendValue}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    totalRevenue,
    totalCustomers,
    totalProducts,
    customerInsights,
    loading,
    error
  } = useDashboardData();

  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    if (user && user.merchantId) {
      // Fetch merchant data here using user.merchantId
      // Example:
      const fetchMerchantData = async () => {
        // Replace this with your actual data fetching logic
        const mockMerchantData = {
          id: user.merchantId,
          name: "Mock Merchant",
          subscriptionTier: "PRO"
        };
        setMerchant(mockMerchantData);
      };

      fetchMerchantData();
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Convert string to SubscriptionTier enum
  const subscriptionTierValue = merchant?.subscriptionTier || '';
  const subscriptionTier = 
    Object.values(SubscriptionTier).includes(subscriptionTierValue as SubscriptionTier) 
      ? subscriptionTierValue as SubscriptionTier 
      : SubscriptionTier.FREE;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Revenue"
        value={totalRevenue || 0}
        isLoading={loading}
        trend="up"
        trendValue={12.2}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <DashboardCard
        title="Total Customers"
        value={totalCustomers || 0}
        isLoading={loading}
        trend="down"
        trendValue={5.5}
        icon={<Users className="h-4 w-4" />}
      />
      <DashboardCard
        title="Total Products"
        value={totalProducts || 0}
        isLoading={loading}
        trend="up"
        trendValue={8.1}
        icon={<Package className="h-4 w-4" />}
      />
      <DashboardCard
        title="Subscription Tier"
        value={subscriptionTier}
        isLoading={loading}
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  );
};

const DashboardWrapper: React.FC = () => {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business performance
        </p>
      </div>
      <DashboardContent />
    </div>
  );
};

export default DashboardWrapper;
