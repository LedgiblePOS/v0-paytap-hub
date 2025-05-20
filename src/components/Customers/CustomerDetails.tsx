import React from "react";
import { UserCircle, Mail, History, Trash2, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CustomerModel } from "@/types/customer"; 
import { TransactionModel } from "@/types";

interface CustomerDetailsProps {
  customer: CustomerModel;
  transactions: TransactionModel[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  transactions,
  onClose,
  onEdit,
  onDelete
}) => {
  const getCustomerStatus = (transactions: TransactionModel[]) => {
    if (transactions.length === 0) return "new";
    
    const lastTransactionDate = new Date(
      Math.max(...transactions.map(t => new Date(t.createdAt).getTime()))
    );
    
    const daysSinceLastTransaction = Math.floor(
      (new Date().getTime() - lastTransactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastTransaction < 30) return "active";
    if (daysSinceLastTransaction < 90) return "inactive";
    return "dormant";
  };

  const calculateTotalSpent = (transactions: TransactionModel[]) => {
    return transactions
      .filter(t => t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Fix: Using Badge component correctly with appropriate variant values
  const getBadgeVariant = (status: string) => {
    switch(status) {
      case "active": return "success";
      case "new": return "secondary";  
      case "inactive": return "warning";
      default: return "outline";
    }
  };

  const customerStatus = getCustomerStatus(transactions);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <UserCircle className="h-16 w-16 text-gray-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold">
            {customer.firstName} {customer.lastName}
          </h3>
          <Badge variant={getBadgeVariant(customerStatus)} className="ml-2">
            {customerStatus === "active" ? "Active" :
             customerStatus === "new" ? "New" :
             customerStatus === "inactive" ? "Inactive" : "Dormant"}
          </Badge>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg flex justify-between">
        <div>
          <p className="text-sm text-gray-500">Customer since</p>
          <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total orders</p>
          <p className="font-medium">{transactions.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total spent</p>
          <p className="font-medium">${calculateTotalSpent(transactions).toFixed(2)}</p>
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="w-full">
          <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
          <TabsTrigger value="communication" className="flex-1">Communication</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          {transactions.length === 0 ? (
            <div className="text-center py-6">
              <History className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No order history available.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        <TabsContent value="communication">
          <div className="text-center py-6">
            <Mail className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 mb-4">No communication history available.</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" disabled>
                Send Email
              </Button>
              <Button variant="outline" disabled>
                Send SMS
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Communication features coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-500"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={onEdit}
            >
              <PencilLine className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </DialogFooter>
    </div>
  );
};

export default CustomerDetails;
