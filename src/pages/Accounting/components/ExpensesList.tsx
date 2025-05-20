
import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { FileImage, Plus, Search, Download, Trash2, Receipt, AlertCircle } from 'lucide-react';
import { ExpenseModel } from '@/types/accounting';
import LoadingIndicator from '@/components/Layout/LoadingIndicator';

interface ExpensesListProps {
  merchantId: string | undefined;
  dateRange?: { startDate: string, endDate: string };
}

const ExpensesList: React.FC<ExpensesListProps> = ({ merchantId, dateRange }) => {
  const [search, setSearch] = useState('');
  const [newExpense, setNewExpense] = useState<Partial<ExpenseModel>>({
    amount: 0,
    description: '',
    category: 'Office',
    date: format(new Date(), 'yyyy-MM-dd'),
    taxDeductible: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  
  const {
    expenses,
    isLoading,
    error,
    createExpense,
    deleteExpense,
    uploadReceipt
  } = useExpenses(merchantId || null, dateRange);
  
  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(search.toLowerCase()) ||
    expense.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewExpense(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else if (type === 'checkbox') {
      setNewExpense(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setNewExpense(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setNewExpense(prev => ({ ...prev, category: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!merchantId) return;
    
    try {
      setIsAddingExpense(true);
      
      // Create the expense
      const createdExpense = await createExpense({
        ...newExpense as Omit<ExpenseModel, "id" | "merchantId" | "createdAt" | "updatedAt">,
      });
      
      // Upload receipt if available
      if (selectedFile && createdExpense.id) {
        await uploadReceipt(createdExpense.id, selectedFile);
      }
      
      // Reset form
      setNewExpense({
        amount: 0,
        description: '',
        category: 'Office',
        date: format(new Date(), 'yyyy-MM-dd'),
        taxDeductible: false
      });
      setSelectedFile(null);
      setIsAddingExpense(false);
      
    } catch (error) {
      console.error("Error adding expense:", error);
      setIsAddingExpense(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading expenses..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Error Loading Expenses</h3>
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expenses</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newExpense.description || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleCategoryChange} defaultValue={newExpense.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Meals">Meals</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Advertising">Advertising</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newExpense.date || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="taxDeductible" 
                  name="taxDeductible"
                  checked={newExpense.taxDeductible || false}
                  onCheckedChange={(checked) => 
                    setNewExpense(prev => ({ ...prev, taxDeductible: !!checked }))
                  }
                />
                <Label htmlFor="taxDeductible">Tax Deductible</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="receipt">Receipt Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={isAddingExpense}>
                {isAddingExpense ? "Adding..." : "Add Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="ml-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {expense.receiptImageUrl ? (
                        <a href={expense.receiptImageUrl} target="_blank" rel="noopener noreferrer">
                          <FileImage className="h-4 w-4 text-blue-500" />
                        </a>
                      ) : (
                        <Receipt className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
