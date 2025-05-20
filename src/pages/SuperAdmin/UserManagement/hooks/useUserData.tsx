
import { useState, useCallback } from 'react';
import { UserData } from '@/components/SuperAdmin/User/utils/userDataConverter';

export function useUserData() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = useCallback(async ({ 
    currentPage, 
    pageSize, 
    roleFilter, 
    searchQuery 
  }: {
    currentPage: number;
    pageSize: number;
    roleFilter: string | null;
    searchQuery: string;
  }) => {
    setIsLoading(true);
    try {
      // This would be where you'd fetch data from an API
      console.log('Fetching users with:', { currentPage, pageSize, roleFilter, searchQuery });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data as a placeholder
      const mockUsers = Array(10).fill(0).map((_, i) => ({
        id: `user-${i + (currentPage - 1) * pageSize}`,
        email: `user${i}@example.com`,
        first_name: `Test${i}`,
        last_name: `User${i}`,
        role: i % 3 === 0 ? 'admin' : 'user',
        is_active: i % 4 !== 0,
        merchant_id: i % 2 === 0 ? `merchant-${i}` : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      setUsers(mockUsers);
      setTotalUsers(100); // Mock total
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    isLoading,
    totalUsers,
    fetchUsers
  };
}
