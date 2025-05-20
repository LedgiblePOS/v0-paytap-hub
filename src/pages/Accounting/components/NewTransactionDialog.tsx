
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useIncomes } from '../hooks/useIncomes';
import { TransactionType, ExpenseCategories, IncomeSources } from '@/types/accounting';
import { useToast } from '@/hooks/use-toast';

interface NewTransactionDialogProps {
  merchantId: string | undefined;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  onTransactionAdded?: () => void;
}

const NewTransactionDialog: React.FC<NewTransactionDialogProps> = ({ 
  merchantId,
  className,
  variant = "default",
  size = "default",
  onTransactionAdded
}) => {
  const [open, setOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  // Form state for expense
  const [expenseData, setExpenseData] = useState({
    amount: 0,
    description: '',
    category: 'Office',
    date: format(new Date(), 'yyyy-MM-dd'),
    taxDeductible: false
  });
  
  // Form state for income
  const [incomeData, setIncomeData] = useState({
    amount: 0,
    description: '',
    source: 'Sales',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  
  // File for receipt or document
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Hooks for API operations
  const { createExpense, uploadReceipt } = useExpenses(merchantId || null);
  const { createIncome } = useIncomes(merchantId || null);
  
  // Handle expense input changes
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setExpenseData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (type === 'checkbox') {
      setExpenseData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setExpenseData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle income input changes
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setIncomeData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setIncomeData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!merchantId) {
      toast({
        title: "Error",
        description: "Merchant ID is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      if (transactionType === TransactionType.EXPENSE) {
        // Create expense
        const newExpense = await createExpense({
          ...expenseData
        });
        
        // Upload receipt if available
        if (selectedFile && newExpense.id) {
          await uploadReceipt(newExpense.id, selectedFile);
        }
      } else {
        // Create income
        await createIncome({
          ...incomeData
        });
      }
      
      // Reset forms
      setExpenseData({
        amount: 0,
        description: '',
        category: 'Office',
        date: format(new Date(), 'yyyy-MM-dd'),
        taxDeductible: false
      });
      
      setIncomeData({
        amount: 0,
        description: '',
        source: 'Sales',
        date: format(new Date(), 'yyyy-MM-dd')
      });
      
      setSelectedFile(null);
      
      setIsProcessing(false);
      setOpen(false);
      
      // Notify parent component
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: `Failed to add transaction: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        
        <Tabs
          defaultValue={TransactionType.EXPENSE}
          onValueChange={(value) => setTransactionType(value as TransactionType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value={TransactionType.EXPENSE} className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              <span>Expense</span>
            </TabsTrigger>
            <TabsTrigger value={TransactionType.INCOME} className="flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              <span>Income</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={TransactionType.EXPENSE}>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expense-amount">Amount</Label>
                  <Input
                    id="expense-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={expenseData.amount || ''}
                    onChange={handleExpenseChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input
                    id="expense-date"
                    name="date"
                    type="date"
                    value={expenseData.date}
                    onChange={handleExpenseChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expense-description">Description</Label>
                <Input
                  id="expense-description"
                  name="description"
                  value={expenseData.description}
                  onChange={handleExpenseChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expense-category">Category</Label>
                <Select 
                  value={expenseData.category} 
                  onValueChange={(value) => setExpenseData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {ExpenseCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="expense-tax-deductible" 
                  name="taxDeductible"
                  checked={expenseData.taxDeductible}
                  onCheckedChange={(checked) => 
                    setExpenseData(prev => ({ ...prev, taxDeductible: !!checked }))
                  }
                />
                <Label htmlFor="expense-tax-deductible">Tax Deductible</Label>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="expense-receipt">Receipt Image</Label>
                <Input
                  id="expense-receipt"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value={TransactionType.INCOME}>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="income-amount">Amount</Label>
                  <Input
                    id="income-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={incomeData.amount || ''}
                    onChange={handleIncomeChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="income-date">Date</Label>
                  <Input
                    id="income-date"
                    name="date"
                    type="date"
                    value={incomeData.date}
                    onChange={handleIncomeChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="income-description">Description</Label>
                <Input
                  id="income-description"
                  name="description"
                  value={incomeData.description}
                  onChange={handleIncomeChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="income-source">Source</Label>
                <Select 
                  value={incomeData.source} 
                  onValueChange={(value) => setIncomeData(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {IncomeSources.map(source => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="income-document">Supporting Document</Label>
                <Input
                  id="income-document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Saving..." : "Save Transaction"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewTransactionDialog;
