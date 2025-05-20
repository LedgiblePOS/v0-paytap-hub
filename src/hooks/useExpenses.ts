import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { Expense, ExpenseEntity, toExpenseModels } from '@/types/expense';

interface UseExpensesResult {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expenseData: Partial<Expense>) => Promise<void>;
  updateExpense: (id: string, expenseData: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

export function useExpenses(): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('expenses')
        .select('*')
        .eq('merchant_id', user?.merchantId)
        .order('date', { ascending: false });
      
      if (fetchError) throw new Error(fetchError.message);
      
      // Convert the snake_case entities to camelCase models
      setExpenses(toExpenseModels(data as ExpenseEntity[]));
      
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error fetching expenses',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expenseData)
        .select();
      
      if (error) {
        throw error;
      }
      
      setExpenses((prevExpenses) => [...prevExpenses, data[0]]);
    } catch (error: any) {
      setError(error);
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(expenseData)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === id ? { ...expense, ...data[0] } : expense
        )
      );
    } catch (error: any) {
      setError(error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    if (user?.merchantId) {
      fetchExpenses();
    }
  }, [user?.merchantId]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  };
}
