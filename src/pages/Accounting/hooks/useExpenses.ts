
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseModel } from '@/types/accounting';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  getExpenses, 
  createExpense,
  updateExpense,
  deleteExpense,
  uploadReceiptImage
} from '@/services/accounting/expenseService';

export const useExpenses = (merchantId: string | null, dateRange?: { startDate: string, endDate: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Format the query key with date range if provided
  const queryKey = dateRange 
    ? ['expenses', merchantId, dateRange.startDate, dateRange.endDate]
    : ['expenses', merchantId];

  // Get expenses
  const { 
    data = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey,
    queryFn: () => merchantId ? getExpenses(merchantId) : Promise.resolve([]),
    enabled: !!merchantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Create expense mutation
  const { mutateAsync: createExpenseMutation } = useMutation({
    mutationFn: (expense: Omit<ExpenseModel, "id" | "merchantId" | "createdAt" | "updatedAt">) => {
      if (!merchantId) throw new Error("Merchant ID is required");
      
      const now = new Date().toISOString();
      const newExpense: ExpenseModel = {
        id: uuidv4(),
        merchantId,
        ...expense,
        createdAt: now,
        updatedAt: now
      };
      
      return createExpense(newExpense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', merchantId] });
      toast({
        title: "Expense Added",
        description: "Expense has been successfully added",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add expense: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  // Update expense mutation
  const { mutateAsync: updateExpenseMutation } = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<ExpenseModel> }) => {
      return updateExpense(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', merchantId] });
      toast({
        title: "Expense Updated",
        description: "Expense has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update expense: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete expense mutation
  const { mutateAsync: deleteExpenseMutation } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', merchantId] });
      toast({
        title: "Expense Deleted",
        description: "Expense has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete expense: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });
  
  // Upload receipt
  const uploadReceipt = useCallback(async (expenseId: string, file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await uploadReceiptImage(expenseId, file);
      queryClient.invalidateQueries({ queryKey: ['expenses', merchantId] });
      toast({
        title: "Receipt Uploaded",
        description: "Receipt has been successfully uploaded",
      });
      setIsUploading(false);
      return imageUrl;
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Error",
        description: `Failed to upload receipt: ${(error as Error).message}`,
        variant: "destructive",
      });
      throw error;
    }
  }, [merchantId, queryClient, toast]);

  return {
    expenses: data,
    isLoading,
    isUploading,
    error: error ? (error as Error).message : null,
    createExpense: createExpenseMutation,
    updateExpense: updateExpenseMutation,
    deleteExpense: deleteExpenseMutation,
    uploadReceipt
  };
};
