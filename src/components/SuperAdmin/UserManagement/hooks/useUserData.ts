
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/user';
import { UserRole } from '@/types/enums';

interface FetchUsersParams {
  currentPage: number;
  pageSize: number;
  roleFilter: string | null;
  searchQuery: string;
}

export const useUserData = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchUsers = useCallback(async (params: any) => {
    try {
      setIsLoading(true);
      const { currentPage, pageSize, roleFilter, searchQuery } = params;

      let query = supabase.from('profiles').select('*', { count: 'exact' });

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      if (data) {
        // Convert DB records to UserData with proper typing
        const mappedUsers: UserData[] = data.map((user: any): UserData => ({
          id: user.id,
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          // Ensure role is appropriately typed
          role: user.role ? (Object.values(UserRole).includes(user.role as UserRole) 
            ? user.role as UserRole 
            : UserRole.USER) : UserRole.USER,
          is_active: user.is_active !== false,
          merchant_id: user.merchant_id || undefined,
          merchant_name: user.merchant_name || undefined,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString()
        }));

        setUsers(mappedUsers);
        setTotalUsers(count || 0);
      }
      
      return true;
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, totalUsers, fetchUsers };
};
