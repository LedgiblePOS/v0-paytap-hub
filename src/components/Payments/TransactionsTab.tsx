
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import EmptyTransactionState from "./EmptyTransactionState";
import TransactionList from "./TransactionList";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  payment_method: string;
  merchant_id: string;
  reference?: string;
}

const TransactionsTab: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();
  
  // Fetch transactions from the database
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }
        
        // Get merchant ID for the current user
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', session.session.user.id)
          .single();
        
        if (merchantError || !merchant) {
          console.error("Error loading merchant:", merchantError);
          setIsLoading(false);
          return;
        }
        
        // Get transactions for the merchant
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('merchant_id', merchant.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [toast]);
  
  // Filter transactions based on search query
  const filteredTransactions = searchQuery
    ? transactions.filter(transaction => 
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transactions;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-10 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 border rounded-md hover:bg-gray-100">
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-gray-300 rounded-full" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyTransactionState />
        ) : (
          <TransactionList transactions={filteredTransactions} />
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;
