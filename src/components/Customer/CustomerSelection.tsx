
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CustomerModel } from '@/types/customer';

interface CustomerSelectionProps {
  customers: CustomerModel[];
  onSelectCustomer: (customer: CustomerModel) => void;
}

export const Customer: React.FC<CustomerSelectionProps> = ({ 
  customers, 
  onSelectCustomer 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    false
  );
  
  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search customers by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredCustomers.length === 0 ? (
          <p className="text-muted-foreground">No customers found</p>
        ) : (
          filteredCustomers.map(customer => (
            <Card key={customer.id} className="hover:bg-muted/50 cursor-pointer">
              <CardContent className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectCustomer(customer)}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Customer;
