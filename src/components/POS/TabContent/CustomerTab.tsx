
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, UserPlus } from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface CustomerTabProps {
  onSelectCustomer: (customer: Customer | null) => void;
  selectedCustomer?: Customer | null;
}

const CustomerTab: React.FC<CustomerTabProps> = ({ onSelectCustomer, selectedCustomer }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Mock search functionality - would be replaced with actual API call
    setTimeout(() => {
      const results: Customer[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-1234' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '555-5678' }
      ].filter(customer => 
        customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleNewCustomer = () => {
    // Create empty customer with just an ID for now
    // Fix: Pass a string instead of an empty object
    onSelectCustomer({ id: 'new', firstName: '', lastName: '', email: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} variant="outline" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button onClick={handleNewCustomer} variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>
      
      {selectedCustomer && selectedCustomer.id !== 'new' && (
        <Card className="bg-primary/10">
          <CardContent className="p-4">
            <h3 className="font-medium">Selected Customer</h3>
            <p className="text-sm">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
            <p className="text-sm">{selectedCustomer.email}</p>
            {selectedCustomer.phone && <p className="text-sm">{selectedCustomer.phone}</p>}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2" 
              onClick={() => onSelectCustomer(null)}
            >
              Change
            </Button>
          </CardContent>
        </Card>
      )}
      
      {!selectedCustomer && searchResults.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-medium">Search Results</h3>
          {searchResults.map((customer) => (
            <Card 
              key={customer.id} 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onSelectCustomer(customer)}
            >
              <CardContent className="p-4">
                <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
                {customer.phone && <p className="text-sm">{customer.phone}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!selectedCustomer && searchResults.length === 0 && searchQuery && !isSearching && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No customers found</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={handleNewCustomer}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Customer
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomerTab;
