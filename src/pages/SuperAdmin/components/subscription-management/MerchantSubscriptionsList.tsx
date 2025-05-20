
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { SubscriptionTier } from '@/types';
import { useMerchantSubscriptions, MerchantSubscriptionData } from '@/hooks/useMerchantSubscriptions';

const MerchantSubscriptionsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  
  const {
    merchants,
    isLoadingMerchants,
    merchantsError,
    isAssigningTier,
    updateSubscriptionTier,
  } = useMerchantSubscriptions();
  
  // Filter merchants based on search query and tier filter
  const filteredMerchants = merchants.filter((merchant: MerchantSubscriptionData) => {
    const matchesSearch = 
      merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (merchant.email && merchant.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      `${merchant.firstName || ''} ${merchant.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTier = selectedTier === 'all' || merchant.subscriptionTier === selectedTier;
    
    return matchesSearch && matchesTier;
  });

  const handleTierChange = async (merchantId: string, tier: SubscriptionTier) => {
    await updateSubscriptionTier(merchantId, tier);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {Object.values(SubscriptionTier).map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoadingMerchants ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading merchant data...</span>
          </div>
        ) : merchantsError ? (
          <div className="text-center py-8 text-red-500">
            Error loading merchant data. Please try again.
          </div>
        ) : filteredMerchants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No merchants found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Subscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.businessName}</TableCell>
                    <TableCell>{`${merchant.firstName || ''} ${merchant.lastName || ''}`}</TableCell>
                    <TableCell>{merchant.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          merchant.subscriptionTier === SubscriptionTier.FREE ? 'bg-gray-100' :
                          merchant.subscriptionTier === SubscriptionTier.STARTER ? 'bg-blue-50' :
                          merchant.subscriptionTier === SubscriptionTier.PROFESSIONAL ? 'bg-green-50' :
                          merchant.subscriptionTier === SubscriptionTier.ENTERPRISE ? 'bg-purple-50' :
                          merchant.subscriptionTier === SubscriptionTier.BUSINESS ? 'bg-amber-50' :
                          merchant.subscriptionTier === SubscriptionTier.GO_GLOBAL ? 'bg-cyan-50' :
                          'bg-gray-100'
                        }
                      >
                        {merchant.subscriptionTier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        value={merchant.subscriptionTier}
                        onValueChange={(tier) => handleTierChange(merchant.id, tier as SubscriptionTier)}
                        disabled={isAssigningTier}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Change tier" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(SubscriptionTier).map((tier) => (
                            <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantSubscriptionsList;
