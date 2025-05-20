
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SubscriptionPlanModel } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionCardProps {
  subscriptionPlans: SubscriptionPlanModel[];
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscriptionPlans }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get merchant ID for the current user
  const { data: merchant } = useQuery({
    queryKey: ['merchant', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching merchant:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user,
  });
  
  const handleSelectPlan = async (plan: SubscriptionPlanModel) => {
    if (!merchant) return;
    
    // Don't allow selecting the current plan
    if (merchant && merchant.subscription_tier === plan.name) {
      toast({
        title: 'Already subscribed',
        description: `You are already on the ${plan.name} tier with ${plan.transactionFeePercentage}% transaction fee.`,
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('merchants')
        .update({
          subscription_tier: plan.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', merchant.id);
        
      if (error) throw error;
      
      toast({
        title: 'Plan updated',
        description: `Successfully switched to ${plan.name} tier with ${plan.transactionFeePercentage}% transaction fee.`,
      });
      
      // Reload to show the new subscription
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to switch plan. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Transaction Fee Tiers</CardTitle>
        <CardDescription>
          View and manage your transaction fee rates based on your subscription tier.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = merchant?.subscription_tier === plan.name;
            
            return (
              <div 
                key={plan.id}
                className={`border rounded-lg p-6 ${
                  isCurrentPlan 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md transition-shadow'
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">Transaction Fee Rate</p>
                </div>
                
                <div className="mb-6">
                  <span className="text-2xl font-bold">{plan.transactionFeePercentage}%</span>
                  <p className="text-sm text-gray-500">
                    per transaction
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Standard card transactions: {plan.transactionFeePercentage}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      CBDC transactions: {Math.max(0, plan.transactionFeePercentage - 0.5)}%
                    </span>
                  </div>
                </div>
                
                <button 
                  className={`w-full py-2 rounded-md font-medium ${
                    isCurrentPlan
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Tier' : 'Switch Tier'}
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
