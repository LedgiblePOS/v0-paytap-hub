
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Download,
  Filter,
  RefreshCcw, 
  Search, 
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { TransactionEntity } from '@/types/transaction';
import { toTransactionModel } from '@/utils/modelConversions/transactionConverters';

const TransactionReview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const merchantId = searchParams.get('merchantId');
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('transactions')
          .select(`
            *,
            merchant:merchant_id (
              business_name,
              user_id,
              subscription_tier
            ),
            customer:customer_id (
              first_name,
              last_name,
              email
            )
          `);
          
        // Filter by merchant if specified
        if (merchantId) {
          query = query.eq('merchant_id', merchantId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Process the transaction data
        const formattedTransactions = data.map((transaction: any) => {
          const transactionModel = toTransactionModel(transaction as TransactionEntity);
          return {
            ...transactionModel,
            merchantName: transaction.merchant?.business_name || 'Unknown Merchant',
            customerName: transaction.customer ? 
              `${transaction.customer.first_name} ${transaction.customer.last_name}` : 
              'Guest Customer'
          };
        });
        
        setTransactions(formattedTransactions);
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transactions',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [merchantId, toast]);
  
  // Filter transactions based on search and tab
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && transaction.status === 'PENDING_APPROVAL';
    if (activeTab === 'completed') return matchesSearch && transaction.status === 'COMPLETED';
    if (activeTab === 'failed') return matchesSearch && transaction.status === 'FAILED';
    
    return matchesSearch;
  });
  
  const handleApproveTransaction = async () => {
    if (!selectedTransaction) return;
    
    try {
      // Update the transaction status
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'COMPLETED',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTransaction.id);
      
      if (error) throw error;
      
      // Create audit log entry
      await supabase
        .from('audit_logs')
        .insert({
          action: 'UPDATE',
          resource: 'transactions',
          description: `Transaction ${selectedTransaction.id} approved by super admin`,
          user_id: 'super_admin' // This would be the actual user ID in a real implementation
        });
      
      // Update local state
      setTransactions(transactions.map(tx => 
        tx.id === selectedTransaction.id ? { ...tx, status: 'COMPLETED' } : tx
      ));
      
      // Close the review dialog
      setIsReviewOpen(false);
      setSelectedTransaction(null);
      
      toast({
        title: 'Transaction Approved',
        description: 'The transaction has been successfully approved',
      });
    } catch (error: any) {
      console.error('Error approving transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve transaction',
        variant: 'destructive',
      });
    }
  };
  
  const handleRejectTransaction = async () => {
    if (!selectedTransaction) return;
    
    try {
      // Update the transaction status
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'REJECTED',
          updated_at: new Date().toISOString(),
          notes: rejectionReason
        })
        .eq('id', selectedTransaction.id);
      
      if (error) throw error;
      
      // Create audit log entry
      await supabase
        .from('audit_logs')
        .insert({
          action: 'UPDATE',
          resource: 'transactions',
          description: `Transaction ${selectedTransaction.id} rejected by super admin. Reason: ${rejectionReason}`,
          user_id: 'super_admin' // This would be the actual user ID in a real implementation
        });
      
      // Update local state
      setTransactions(transactions.map(tx => 
        tx.id === selectedTransaction.id ? { ...tx, status: 'REJECTED' } : tx
      ));
      
      // Close the dialogs
      setIsRejectOpen(false);
      setIsReviewOpen(false);
      setSelectedTransaction(null);
      setRejectionReason('');
      
      toast({
        title: 'Transaction Rejected',
        description: 'The transaction has been rejected',
      });
    } catch (error: any) {
      console.error('Error rejecting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject transaction',
        variant: 'destructive',
      });
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'PENDING_APPROVAL':
        return <Badge className="bg-yellow-600"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-600"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Review</h1>
          <p className="text-muted-foreground">
            Review, approve, or reject payment transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsLoading(true)}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
            <TabsTrigger value="failed" className="text-xs sm:text-sm">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            All payment transactions in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {transaction.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{transaction.merchantName}</TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        {transaction.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsReviewOpen(true);
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <CreditCard className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Transaction Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Transaction</DialogTitle>
            <DialogDescription>
              Review transaction details before approval or rejection.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Transaction ID</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm">{getStatusBadge(selectedTransaction.status)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Merchant</p>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.merchantName}</p>
                </div>
                {selectedTransaction.reference && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Reference</p>
                    <p className="text-sm text-muted-foreground">{selectedTransaction.reference}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button variant="destructive" onClick={() => {
              setIsRejectOpen(true);
            }}>
              Reject Transaction
            </Button>
            <Button onClick={handleApproveTransaction}>
              Approve Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection Confirmation Dialog */}
      <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this transaction? Please provide a reason:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Input
            placeholder="Rejection reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="mt-2"
          />
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRejectTransaction} disabled={!rejectionReason.trim()}>
              Reject Transaction
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionReview;
