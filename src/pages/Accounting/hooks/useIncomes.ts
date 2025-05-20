
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IncomeModel } from '@/types/accounting';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  getIncomes, 
  createIncome,
  updateIncome,
  deleteIncome
} from '@/services/accounting/incomeService';

export const useIncomes = (merchantId: string | null, dateRange?: { startDate: string, endDate: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Format the query key with date range if provided
  const queryKey = dateRange 
    ? ['incomes', merchantId, dateRange.startDate, dateRange.endDate]
    : ['incomes', merchantId];

  // Get incomes
  const { 
    data = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey,
    queryFn: () => merchantId ? getIncomes(merchantId) : Promise.resolve([]),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Create income mutation
  const { mutateAsync: createIncomeMutation } = useMutation({
    mutationFn: (income: Omit<IncomeModel, "id" | "merchantId" | "createdAt" | "updatedAt">) => {
      if (!merchantId) throw new Error("Merchant ID is required");
      
      const now = new Date().toISOString();
      const newIncome: IncomeModel = {
        id: uuidv4(),
        merchantId,
        ...income,
        createdAt: now,
        updatedAt: now
      };
      
      return createIncome(newIncome);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', merchantId] });
      toast({
        title: "Income Added",
        description: "Income has been successfully added",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add income: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update income mutation
  const { mutateAsync: updateIncomeMutation } = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<IncomeModel> }) => {
      return updateIncome(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', merchantId] });
      toast({
        title: "Income Updated",
        description: "Income has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update income: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete income mutation
  const { mutateAsync: deleteIncomeMutation } = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', merchantId] });
      toast({
        title: "Income Deleted",
        description: "Income has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete income: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  return {
    incomes: data,
    isLoading,
    error: error ? (error as Error).message : null,
    createIncome: createIncomeMutation,
    updateIncome: updateIncomeMutation,
    deleteIncome: deleteIncomeMutation
  };
};
