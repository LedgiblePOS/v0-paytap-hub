
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types/subscription";
import auditService from "@/services/auditService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TransactionFeeSettings: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query to fetch subscription plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price', { ascending: true });
      
      if (error) throw error;
      
      return data.map(plan => ({
        id: plan.id,
        name: plan.name,
        monthlyPrice: plan.monthly_price,
        annualPrice: plan.annual_price,
        features: plan.features || [],
        productLimit: plan.product_limit,
        isActive: plan.is_active,
        description: plan.description,
        transactionFeePercentage: plan.transaction_fee_percentage
      })) as SubscriptionPlan[];
    },
  });

  // State to track edited values
  const [editedFees, setEditedFees] = useState<Record<string, string>>({});

  // Handle input change
  const handleFeeChange = (planId: string, value: string) => {
    setEditedFees(prev => ({
      ...prev,
      [planId]: value
    }));
  };

  // Mutation for updating transaction fees
  const updateFeesMutation = useMutation({
    mutationFn: async (fees: Record<string, number>) => {
      setIsSubmitting(true);
      
      // Update each plan with its new fee
      const promises = Object.entries(fees).map(([planId, fee]) => 
        supabase
          .from('subscription_plans')
          .update({ transaction_fee_percentage: fee })
          .eq('id', planId)
      );
      
      await Promise.all(promises);
      
      // Log to audit
      await auditService.logAction(
        'UPDATE', 
        'SUBSCRIPTION_PLANS', 
        'Updated transaction fee percentages'
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast({
        title: 'Transaction fees updated',
        description: 'Transaction fee percentages have been updated successfully.',
      });
      setEditedFees({});
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update transaction fees: ${error.message}`,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });

  // Handle save
  const handleSave = () => {
    // Convert string values to numbers
    const numericFees: Record<string, number> = {};
    
    for (const [planId, feeStr] of Object.entries(editedFees)) {
      const fee = parseFloat(feeStr);
      if (isNaN(fee) || fee < 0) {
        toast({
          title: 'Invalid fee',
          description: 'Transaction fees must be valid numbers greater than or equal to 0.',
          variant: 'destructive',
        });
        return;
      }
      numericFees[planId] = fee;
    }
    
    updateFeesMutation.mutate(numericFees);
  };

  const hasChanges = Object.keys(editedFees).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Fee Settings</CardTitle>
        <CardDescription>
          Configure transaction fees for each subscription tier
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground mb-2">
                Transaction fees are applied to each transaction processed through the platform.
                Set different rates based on subscription tiers.
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Monthly Price</TableHead>
                    <TableHead>Transaction Fee (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans?.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>${plan.monthlyPrice.toFixed(2)}/mo</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={
                              editedFees[plan.id] !== undefined
                                ? editedFees[plan.id]
                                : plan.transactionFeePercentage?.toString() || "0"
                            }
                            onChange={(e) => handleFeeChange(plan.id, e.target.value)}
                            className="w-24"
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={!hasChanges || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionFeeSettings;
