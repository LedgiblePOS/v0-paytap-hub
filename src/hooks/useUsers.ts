
import { useState, useCallback } from 'react';
import { UserRole } from '@/types/enums';
import { UserData, toEditUserData } from '@/types/user';

export interface UseUsersProps {
  initialPage?: number;
  initialPageSize?: number;
}

export function useUsers({ 
  initialPage = 1, 
  initialPageSize = 10 
}: UseUsersProps = {}) {
  // State
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(1);

  // Mock fetch users function
  const fetchUsers = useCallback(async (
    page: number = currentPage,
    limit: number = pageSize,
    search: string = '',
    role: string | null = null
  ) => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock users data
      const mockUsers: UserData[] = [
        {
          id: '1',
          email: 'admin@example.com',
          first_name: 'John',
          last_name: 'Admin',
          firstName: 'John',
          lastName: 'Admin',
          role: UserRole.SUPER_ADMIN,
          is_active: true,
          isActive: true,
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'merchant@example.com',
          first_name: 'Jane',
          last_name: 'Merchant',
          firstName: 'Jane',
          lastName: 'Merchant',
          role: UserRole.MERCHANT,
          is_active: true,
          isActive: true,
          merchant_id: 'merchant-1',
          merchantId: 'merchant-1',
          merchant_name: 'Jane\'s Store',
          merchantName: 'Jane\'s Store',
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      // Filter by search term if provided
      let filteredUsers = mockUsers;
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredUsers = mockUsers.filter(user => 
          user.email.toLowerCase().includes(searchTerm) || 
          user.firstName?.toLowerCase().includes(searchTerm) || 
          user.lastName?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by role if provided
      if (role) {
        filteredUsers = filteredUsers.filter(user => 
          user.role.toString() === role
        );
      }
      
      setUsers(filteredUsers);
      setTotalUsers(filteredUsers.length);
      setTotalPages(Math.ceil(filteredUsers.length / limit));
      
      return filteredUsers;
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize);
  };
  
  // Create user
  const createUser = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add new user to the list (demo only)
      const newUser: UserData = {
        id: Date.now().toString(),
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName, 
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        is_active: true,
        isActive: true,
        merchant_id: userData.merchantId,
        merchantId: userData.merchantId,
        merchant_name: userData.merchantName,
        merchantName: userData.merchantName,
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prev => [...prev, newUser]);
      setTotalUsers(prev => prev + 1);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user
  const updateUser = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user in the list (demo only)
      const editData = toEditUserData(userData);
      
      setUsers(prev => prev.map(user => 
        user.id === userData.id ? { ...user, ...editData } : user
      ));
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Deactivate user
  const deactivateUser = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Toggle user's active status (demo only)
      setUsers(prev => prev.map(user => 
        user.id === userId ? { 
          ...user, 
          is_active: !user.is_active,
          isActive: !user.is_active
        } : user
      ));
    } catch (err: any) {
      console.error('Error deactivating user:', err);
      setError(err.message || 'Failed to deactivate user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      // This would be a real API call in a production app
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Just a mock response for demo
      console.log(`Password reset requested for ${email}`);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useState(() => {
    fetchUsers(initialPage, initialPageSize);
  });
  
  return {
    // State
    users,
    isLoading,
    error,
    totalUsers,
    currentPage,
    pageSize,
    totalPages,
    
    // Actions
    fetchUsers,
    handlePageChange,
    setPageSize,
    createUser,
    updateUser,
    deactivateUser,
    resetPassword
  };
}

export default useUsers;
