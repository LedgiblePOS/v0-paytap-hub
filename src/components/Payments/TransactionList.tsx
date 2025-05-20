
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Coins,
  ChevronRight
} from "lucide-react";
import { Transaction } from './TransactionsTab';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getStatusBadge = (status: string) => {
    switch(status.toUpperCase()) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };
  
  const getPaymentIcon = (method: string) => {
    switch(method.toUpperCase()) {
      case 'CARD':
        return <CreditCard className="h-4 w-4" />;
      case 'CASH':
        return <Banknote className="h-4 w-4" />;
      case 'TAP_TO_PAY':
        return <Smartphone className="h-4 w-4" />;
      case 'CBDC':
        return <Coins className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell className="font-medium">
                {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {transaction.id.slice(0, 8)}...
              </TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getPaymentIcon(transaction.payment_method)}
                  <span>
                    {transaction.payment_method.replace('_', ' ')}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
