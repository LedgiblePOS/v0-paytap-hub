
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MerchantModel } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboard } from '@/hooks/useDashboard';
import { useToast } from '@/hooks/use-toast';
import { fixMerchantEntity, toConsistentMerchantModel } from './DashboardWrapper';

const DashboardContent: React.FC = () => {
  const auth = useAuth();
  const [merchant, setMerchant] = useState<MerchantModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const { updateSubscriptionToStarter } = useDashboard();
  const { toast } = useToast();
  
  useEffect(() => {
    // Mark content as ready for blank screen detection
    document.body.setAttribute('data-content-ready', 'true');
    
    const fetchMerchantData = async () => {
      if (!auth.user?.id) return;
      
      try {
        console.log("Fetching merchant data for user:", auth.user.id);
        const { data, error } = await supabase
          .from('merchants')
          .select('*')
          .eq('user_id', auth.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching merchant data:', error);
          return;
        }
        
        if (data) {
          // Use the fixMerchantEntity function to ensure the name field exists
          const merchantEntity = fixMerchantEntity(data);
          // Use the new toConsistentMerchantModel function to ensure userId is defined
          const merchantModel = toConsistentMerchantModel(merchantEntity);
          setMerchant(merchantModel);
          console.log("Merchant data loaded:", merchantModel);
        }
      } catch (error) {
        console.error('Error fetching merchant data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMerchantData();
    
    return () => {
      // Cleanup function
      console.log("Dashboard component unmounting");
    };
  }, [auth.user]);

  const handleUpgradeToStarter = async () => {
    if (!merchant) return;
    
    try {
      setUpgrading(true);
      await updateSubscriptionToStarter();
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been upgraded to STARTER tier",
      });
      
      const { data } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', auth.user?.id)
        .single();
        
      if (data) {
        // Use the fixMerchantEntity function to ensure the name field exists
        const merchantEntity = fixMerchantEntity(data);
        // Use the new toConsistentMerchantModel function to ensure userId is defined
        const merchantModel = toConsistentMerchantModel(merchantEntity);
        setMerchant(merchantModel);
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error upgrading your subscription",
        variant: "destructive"
      });
    } finally {
      setUpgrading(false);
    }
  };
  
  if (loading) {
    return <div data-testid="dashboard-content" data-content-ready="true" className="dashboard-stats">Loading dashboard...</div>;
  }
  
  if (!merchant) {
    return <div data-testid="dashboard-content" data-content-ready="true" className="dashboard-stats">No merchant profile found</div>;
  }
  
  return (
    <div data-testid="dashboard-content" data-content-ready="true" className="p-6 dashboard-stats">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Business Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchant.businessName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {merchant.businessEmail || 'No email provided'} | {merchant.country}
            </p>
            <div className="text-xs mt-2">Phone: {merchant.businessPhone || '—'}</div>
            <div className="text-xs">Address: {merchant.businessAddress || '—'}</div>
            <div className="text-xs">City: {merchant.city || '—'}</div>
            <div className="text-xs">State: {merchant.state || '—'}</div>
            <div className="text-xs">Zip: {merchant.zipCode || '—'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchant.subscriptionTier}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Products: {merchant.productCount} / {merchant.productLimit}
            </p>
            {merchant.subscriptionTier !== 'STARTER' && (
              <Button 
                onClick={handleUpgradeToStarter}
                disabled={upgrading}
                className="mt-2 w-full"
                size="sm"
              >
                {upgrading ? 'Updating...' : 'Set to STARTER Tier'}
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{merchant.isVerified ? 'Verified' : 'Pending Verification'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Account {merchant.isActive ? 'Active' : 'Inactive'}
            </p>
            <div className="text-xs mt-2">Verification: {merchant.verificationData ? 'Complete' : '—'}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
