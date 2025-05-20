
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import subscriptionPlanService from '@/services/subscriptionPlanService';
import { SubscriptionPlanModel } from '@/types';
import { useToast } from './use-toast';

export const useSubscriptionPlans = (includeInactive = false) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanModel | null>(null);

  // Fetch all subscription plans
  const { 
    data: subscriptionPlans,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['subscriptionPlans', { includeInactive }],
    queryFn: () => subscriptionPlanService.getAllSubscriptionPlans(includeInactive),
  });

  // Create a new subscription plan
  const createPlanMutation = useMutation({
    mutationFn: (plan: Omit<SubscriptionPlanModel, 'id' | 'createdAt' | 'updatedAt'>) => 
      subscriptionPlanService.createSubscriptionPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast({
        title: 'Success',
        description: 'Subscription plan created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create subscription plan: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update an existing subscription plan
  const updatePlanMutation = useMutation({
    mutationFn: ({ id, plan }: { id: string; plan: Partial<Omit<SubscriptionPlanModel, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      subscriptionPlanService.updateSubscriptionPlan(id, plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast({
        title: 'Success',
        description: 'Subscription plan updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update subscription plan: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete a subscription plan
  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => subscriptionPlanService.deleteSubscriptionPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionPlans'] });
      toast({
        title: 'Success',
        description: 'Subscription plan deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete subscription plan: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Function to start editing a plan
  const startEditingPlan = (plan: SubscriptionPlanModel) => {
    setEditingPlan(plan);
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingPlan(null);
  };

  return {
    subscriptionPlans: subscriptionPlans || [],
    isLoading,
    error,
    refetch,
    createPlan: createPlanMutation.mutateAsync,
    updatePlan: updatePlanMutation.mutateAsync,
    deletePlan: deletePlanMutation.mutateAsync,
    isSubmitting: createPlanMutation.isPending || updatePlanMutation.isPending || deletePlanMutation.isPending,
    editingPlan,
    startEditingPlan,
    cancelEditing,
  };
};
