
import React, { useState } from 'react';
import { useIncomes } from '../hooks/useIncomes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { FileText, Plus, Search, Download, Trash2, AlertCircle } from 'lucide-react';
import { IncomeModel } from '@/types/accounting';
import LoadingIndicator from '@/components/Layout/LoadingIndicator';

interface IncomeListProps {
  merchantId: string | undefined;
  dateRange?: { startDate: string, endDate: string };
}

const IncomeList: React.FC<IncomeListProps> = ({ merchantId, dateRange }) => {
  const [search, setSearch] = useState('');
  const [newIncome, setNewIncome] = useState<Partial<IncomeModel>>({
    amount: 0,
    description: '',
    source: 'Sales',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  
  const {
    incomes,
    isLoading,
    error,
    createIncome,
    deleteIncome
  } = useIncomes(merchantId || null, dateRange);
  
  const filteredIncomes = incomes.filter(income => 
    income.description.toLowerCase().includes(search.toLowerCase()) ||
    income.source.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewIncome(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setNewIncome(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSourceChange = (value: string) => {
    setNewIncome(prev => ({ ...prev, source: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!merchantId) return;
    
    try {
      setIsAddingIncome(true);
      
      // Create the income
      await createIncome({
        ...newIncome as Omit<IncomeModel, "id" | "merchantId" | "createdAt" | "updatedAt">,
      });
      
      // Reset form
      setNewIncome({
        amount: 0,
        description: '',
        source: 'Sales',
        date: format(new Date(), 'yyyy-MM-dd')
      });
      setSelectedFile(null);
      setIsAddingIncome(false);
      
    } catch (error) {
      console.error("Error adding income:", error);
      setIsAddingIncome(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading income data..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Error Loading Income Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Income</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={newIncome.amount || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newIncome.description || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source">Source</Label>
                <Select onValueChange={handleSourceChange} defaultValue={newIncome.source}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Rental">Rental</SelectItem>
                      <SelectItem value="Refund">Refund</SelectItem>
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
                  value={newIncome.date || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">Supporting Document</Label>
                <div className="flex gap-2">
                  <Input
                    id="document"
                    type="file"
                    accept="image/*,.pdf"
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
              <Button onClick={handleSubmit} disabled={isAddingIncome}>
                {isAddingIncome ? "Adding..." : "Add Income"}
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
              placeholder="Search income entries..."
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
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>{format(new Date(income.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{income.description}</TableCell>
                    <TableCell>{income.source}</TableCell>
                    <TableCell className="text-right">${income.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteIncome(income.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No income entries found
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

export default IncomeList;
