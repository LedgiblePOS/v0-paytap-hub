import { useState, useEffect, useCallback } from 'react';
import { UserData, UserRole } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const toast = useToast();
  
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        // Convert to proper UserData objects with snake_case properties
        const formattedUsers: UserData[] = data.map(user => ({
          id: user.id,
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          role: user.role as UserRole || UserRole.USER,
          is_active: user.is_active !== false,
          merchant_id: user.merchant_id || null,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
          merchant_name: user.merchant_name || null,
          // Also add camelCase versions for components that expect them
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          isActive: user.is_active !== false,
          merchantId: user.merchant_id || null,
          createdAt: user.created_at || new Date().toISOString(),
          updatedAt: user.updated_at || new Date().toISOString(),
          merchantName: user.merchant_name || null
        }));
        
        setUsers(formattedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const createUser = async (userData: any): Promise<boolean> => {
    try {
      // Implementation
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      return false;
    }
  };
  
  const updateUser = async (userData: UserData): Promise<boolean> => {
    try {
      // Implementation
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      return false;
    }
  };
  
  const deactivateUser = async (userId: string): Promise<boolean> => {
    try {
      // Implementation
      return true;
    } catch (err) {
      console.error('Error deactivating user:', err);
      return false;
    }
  };
  
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Implementation
      return true;
    } catch (err) {
      console.error('Error resetting password:', err);
      return false;
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return {
    users,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    totalUsers: users.length,
    currentPage: 1,
    pageSize: 10,
    totalPages: Math.ceil(users.length / 10),
    roleFilter: null,
    searchQuery: '',
    handlePageChange: () => {},
    handlePageSizeChange: () => {},
    handleRoleChange: () => {},
    handleSearchChange: () => {},
    handleRefresh: fetchUsers,
    createUser,
    updateUser,
    deactivateUser,
    resetPassword,
    selectedUser: null,
    editUser: () => {},
    setSelectedUser: () => {}
  };
};
