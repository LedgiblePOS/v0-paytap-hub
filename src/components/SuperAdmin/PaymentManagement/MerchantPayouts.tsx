import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BanknoteIcon, 
  CalendarIcon, 
  CheckCircle2, 
  Download, 
  Filter, 
  RefreshCcw, 
  Search 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MerchantModel } from '@/types/merchant';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

// Mock payout data - in a real implementation this would come from the database
const MOCK_PAYOUTS = [
  {
    id: '1',
    merchantId: '1',
    merchantName: 'ABC Electronics',
    amount: 1250.75,
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    transactionCount: 12,
    paymentPeriod: '2024-04-01 to 2024-04-15',
    createdAt: '2024-04-16T10:30:00Z',
    processedAt: null,
    reference: 'ABE-20240416-01'
  },
  {
    id: '2',
    merchantId: '2',
    merchantName: 'Fashion Corner',
    amount: 3456.50,
    status: 'COMPLETED',
    paymentMethod: 'BANK_TRANSFER',
    transactionCount: 24,
    paymentPeriod: '2024-04-01 to 2024-04-15',
    createdAt: '2024-04-16T09:15:00Z',
    processedAt: '2024-04-16T14:25:00Z',
    reference: 'FC-20240416-01'
  },
  {
    id: '3',
    merchantId: '3',
    merchantName: 'Gourmet Foods',
    amount: 875.25,
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    transactionCount: 9,
    paymentPeriod: '2024-04-01 to 2024-04-15',
    createdAt: '2024-04-16T11:45:00Z',
    processedAt: null,
    reference: 'GF-20240416-01'
  },
  {
    id: '4',
    merchantId: '4',
    merchantName: 'Tech Supplies Inc',
    amount: 5632.80,
    status: 'COMPLETED',
    paymentMethod: 'BANK_TRANSFER',
    transactionCount: 38,
    paymentPeriod: '2024-04-01 to 2024-04-15',
    createdAt: '2024-04-16T08:30:00Z',
    processedAt: '2024-04-16T13:10:00Z',
    reference: 'TSI-20240416-01'
  },
];

const MerchantPayouts: React.FC = () => {
  const [payouts, setPayouts] = useState<any[]>(MOCK_PAYOUTS);
  const [merchants, setMerchants] = useState<MerchantModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCreatePayoutOpen, setIsCreatePayoutOpen] = useState(false);
  
  // Form state for new payout
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { toast } = useToast();

  // Fetch merchants for the dropdown
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const { data, error } = await supabase
          .from('merchants')
          .select(`
            *,
            profiles:user_id (
              first_name,
              last_name,
              email
            )
          `);
          
        if (error) throw error;
        
        const mappedMerchants = mapMerchantsData(merchants);
        
        setMerchants(mappedMerchants);
      } catch (error: any) {
        console.error('Error fetching merchants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMerchants();
    // In a real implementation, we would also fetch actual payouts from the database
  }, []);
  
  // Filter payouts based on search and tab
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = searchQuery === '' || 
      payout.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && payout.status === 'PENDING';
    if (activeTab === 'completed') return matchesSearch && payout.status === 'COMPLETED';
    
    return matchesSearch;
  });
  
  const handleApprovePayout = () => {
    if (!selectedPayout) return;
    
    // In a real implementation, this would be a call to the database
    const updatedPayouts = payouts.map(p => 
      p.id === selectedPayout.id ? 
      { 
        ...p, 
        status: 'COMPLETED', 
        processedAt: new Date().toISOString() 
      } : p
    );
    
    setPayouts(updatedPayouts);
    setIsApproveDialogOpen(false);
    setSelectedPayout(null);
    
    toast({
      title: 'Payout Approved',
      description: 'The merchant payout has been approved and will be processed',
    });
  };
  
  const handleCreatePayout = () => {
    if (!selectedMerchant || !payoutAmount || !startDate || !endDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const merchant = merchants.find(m => m.id === selectedMerchant);
    
    if (!merchant) {
      toast({
        title: 'Invalid Merchant',
        description: 'Please select a valid merchant',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a new payout
    const newPayout = {
      id: `payout-${Date.now()}`,
      merchantId: selectedMerchant,
      merchantName: merchant.businessName,
      amount: parseFloat(payoutAmount),
      status: 'PENDING',
      paymentMethod: 'BANK_TRANSFER',
      transactionCount: Math.floor(Math.random() * 20) + 5, // Random number for demo
      paymentPeriod: `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`,
      createdAt: new Date().toISOString(),
      processedAt: null,
      reference: `${merchant.businessName.substring(0, 3).toUpperCase()}-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 100)}`
    };
    
    setPayouts([newPayout, ...payouts]);
    setIsCreatePayoutOpen(false);
    
    // Reset form
    setSelectedMerchant('');
    setPayoutAmount('');
    setStartDate(undefined);
    setEndDate(undefined);
    
    toast({
      title: 'Payout Created',
      description: 'A new payout has been created and is pending approval',
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Fix the merchant data property access
  const displayMerchantData = (merchant: MerchantModel) => {
    return {
      id: merchant.id,
      name: merchant.businessName,
      email: merchant.businessEmail || '',
      phone: merchant.businessPhone || '',
      address: merchant.businessAddress || '',
      logo: merchant.businessLogo || '',
      country: merchant.country || '',
      state: merchant.state || '',
      city: merchant.city || '',
      zipCode: merchant.zipCode || '',
      subscriptionTier: merchant.subscriptionTier,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
      defaultCurrency: merchant.defaultCurrency,
      isActive: merchant.isActive || false,
      isVerified: merchant.isVerified || false,
      productCount: merchant.productCount,
      productLimit: merchant.productLimit,
      verificationData: merchant.verificationData,
      // If profiles data exists, use it, otherwise use empty values
      userFirstName: '',
      userLastName: '',
      userEmail: merchant.userEmail || ''
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchant Payouts</h1>
          <p className="text-muted-foreground">
            Manage and process payouts to merchants
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
          <Button onClick={() => setIsCreatePayoutOpen(true)}>
            <BanknoteIcon className="mr-2 h-4 w-4" />
            Create Payout
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payouts..."
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
          </TabsList>
        </Tabs>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payouts ({filteredPayouts.length})</CardTitle>
          <CardDescription>
            All merchant payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-muted-foreground">Loading payouts...</p>
            </div>
          ) : filteredPayouts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">
                      {payout.reference}
                    </TableCell>
                    <TableCell>{payout.merchantName}</TableCell>
                    <TableCell>{formatCurrency(payout.amount)}</TableCell>
                    <TableCell>{payout.paymentPeriod}</TableCell>
                    <TableCell>
                      {payout.status === 'COMPLETED' ? (
                        <Badge className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={payout.status === 'COMPLETED'}
                        onClick={() => {
                          setSelectedPayout(payout);
                          setIsApproveDialogOpen(true);
                        }}
                      >
                        {payout.status === 'COMPLETED' ? 'Processed' : 'Process'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <BanknoteIcon className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No payouts found</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Approve Payout Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to process this payout? This action cannot be undone.
              {selectedPayout && (
                <div className="mt-4 p-4 border rounded-md bg-muted/50">
                  <p><strong>Merchant:</strong> {selectedPayout.merchantName}</p>
                  <p><strong>Amount:</strong> {formatCurrency(selectedPayout.amount)}</p>
                  <p><strong>Reference:</strong> {selectedPayout.reference}</p>
                  <p><strong>Period:</strong> {selectedPayout.paymentPeriod}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprovePayout}>
              Process Payout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Create Payout Dialog */}
      <Dialog open={isCreatePayoutOpen} onOpenChange={setIsCreatePayoutOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Payout</DialogTitle>
            <DialogDescription>
              Create a new payout for a merchant
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Merchant</label>
              <Select value={selectedMerchant} onValueChange={setSelectedMerchant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a merchant" />
                </SelectTrigger>
                <SelectContent>
                  {merchants.map(merchant => (
                    <SelectItem key={merchant.id} value={merchant.id}>
                      {merchant.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input 
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Period</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="grid gap-2 flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PP') : 'Start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <span className="self-center">to</span>
                <div className="grid gap-2 flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PP') : 'End date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePayoutOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePayout}>Create Payout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Fix the merchant model mapping in the MerchantPayouts component
// We need to update the property access to use camelCase for MerchantModel objects
const mapMerchantsData = (merchants) => {
  if (!Array.isArray(merchants)) {
    return [];
  }
  
  return merchants.map(merchant => {
    return {
      id: merchant.id,
      userId: merchant.userId,
      businessName: merchant.businessName,
      businessEmail: merchant.businessEmail,
      businessPhone: merchant.businessPhone,
      businessAddress: merchant.businessAddress,
      businessLogo: merchant.businessLogo,
      city: merchant.city,
      state: merchant.state,
      zipCode: merchant.zipCode,
      country: merchant.country,
      subscriptionTier: merchant.subscriptionTier,
      createdAt: merchant.createdAt,
      updatedAt: merchant.updatedAt,
      defaultCurrency: merchant.defaultCurrency,
      isActive: merchant.isActive,
      isVerified: merchant.isVerified,
      productCount: merchant.productCount,
      productLimit: merchant.productLimit,
      verificationData: merchant.verificationData,
      name: merchant.name || merchant.businessName,
      userEmail: merchant.userEmail
    };
  });
};

export default MerchantPayouts;
