import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/services/customerService';
import { CustomerModel } from '@/types';
import CustomerList from '@/components/Customers/CustomerList';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CustomerForm from '@/components/Customers/CustomerForm';
import CustomerDetails from '@/components/Customers/CustomerDetails';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

const CustomerModule: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchCustomers = useCallback(async () => {
    if (isFetchingRef.current || !isMountedRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const data = await getCustomers(user?.id);
      
      if (isMountedRef.current) {
        setCustomers(data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      if (isMountedRef.current) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch customers.',
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [toast, user?.id]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchCustomers();
    
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCustomers]);

  const handleAddCustomer = async (data: any) => {
    if (!isMountedRef.current) return;
    
    try {
      setIsSaving(true);
      await createCustomer({
        merchantId: user?.id || '',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      });
      
      if (isMountedRef.current) {
        toast({
          title: 'Success',
          description: 'Customer added successfully.',
        });
        setIsAddDialogOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      if (isMountedRef.current) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add customer.',
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const handleUpdateCustomer = async (data: any) => {
    if (!selectedCustomer || !isMountedRef.current) return;
    
    try {
      setIsSaving(true);
      await updateCustomer(selectedCustomer.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      });
      
      if (isMountedRef.current) {
        toast({
          title: 'Success',
          description: 'Customer updated successfully.',
        });
        setIsEditDialogOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      if (isMountedRef.current) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update customer.',
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer || !isMountedRef.current) return;
    
    try {
      setIsSaving(true);
      await deleteCustomer(selectedCustomer.id);
      
      if (isMountedRef.current) {
        toast({
          title: 'Success',
          description: 'Customer deleted successfully.',
        });
        setIsDeleteDialogOpen(false);
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      if (isMountedRef.current) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete customer.',
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const handleViewCustomer = async (customer: CustomerModel) => {
    if (!isMountedRef.current) return;
    
    setSelectedCustomer(customer);
    setCustomerTransactions([]);
    setIsViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: CustomerModel) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (customer: CustomerModel) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6" data-testid="customers-module">
      <CustomerList
        customers={customers}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={fetchCustomers}
        onAddCustomer={() => setIsAddDialogOpen(true)}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleOpenDeleteDialog}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <CustomerForm
            onSubmit={handleAddCustomer}
            onCancel={() => setIsAddDialogOpen(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedCustomer && (
            <CustomerForm
              customer={selectedCustomer}
              onSubmit={handleUpdateCustomer}
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedCustomer && (
            <CustomerDetails
              customer={selectedCustomer}
              transactions={customerTransactions}
              onClose={() => setIsViewDialogOpen(false)}
              onEdit={() => {
                setIsViewDialogOpen(false);
                handleEditCustomer(selectedCustomer);
              }}
              onDelete={() => {
                setIsViewDialogOpen(false);
                handleOpenDeleteDialog(selectedCustomer);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCustomer?.firstName} {selectedCustomer?.lastName}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCustomer} 
              disabled={isSaving}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSaving ? "Deleting..." : "Delete Customer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerModule;
