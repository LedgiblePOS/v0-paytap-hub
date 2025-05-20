
import { useState, useCallback, useEffect } from 'react';
import { UserData, UserRole, EditUserData } from '@/types/user';

export interface UseUserManagementProps {
  initialPage?: number;
  initialPageSize?: number;
}

export function useUserManagement({ 
  initialPage = 1, 
  initialPageSize = 10 
}: UseUserManagementProps = {}) {
  // Main states
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Dialog states
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deactivateUserOpen, setDeactivateUserOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');

  // Mock fetch users function with proper Promise typing
  const fetchUsers = useCallback(async (params?: any): Promise<UserData[]> => {
    setIsLoading(true);
    setLoading(true);
    try {
      // Mock API call - in a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockUsers: UserData[] = [
        {
          id: "1",
          email: "admin@example.com",
          role: UserRole.SUPER_ADMIN || "SUPER_ADMIN",
          first_name: "Admin",
          last_name: "User",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Add camelCase versions for compatibility
          firstName: "Admin",
          lastName: "User",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          email: "merchant@example.com",
          role: UserRole.MERCHANT || "MERCHANT",
          first_name: "Merchant",
          last_name: "User",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Add camelCase versions for compatibility
          firstName: "Merchant",
          lastName: "User",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setUsers(mockUsers);
      setTotalUsers(mockUsers.length);
      return mockUsers;
    } catch (err) {
      console.error('Failed to fetch users:', err);
      return [];
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, []);

  // User action handlers with proper Promise typing
  const handleRoleChange = useCallback((role: string | null) => {
    setRoleFilter(role);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleEditUser = useCallback(async (user: UserData): Promise<UserData | null> => {
    setSelectedUser(user);
    setEditUserOpen(true);
    return Promise.resolve(user);
  }, []);

  const handleResetPassword = useCallback(async (email: string): Promise<UserData | null> => {
    const user = users.find(u => u.email === email);
    if (user) {
      setSelectedUser(user);
      setResetPasswordOpen(true);
      return Promise.resolve(user);
    }
    return Promise.resolve(null);
  }, [users]);

  const handleDeactivateUser = useCallback(async (userId: string): Promise<UserData | null> => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setDeactivateUserOpen(true);
      return Promise.resolve(user);
    }
    return Promise.resolve(null);
  }, [users]);

  const executeDeactivateUser = useCallback(async (): Promise<boolean> => {
    if (selectedUser) {
      setActionLoading(true);
      try {
        // Mock deactivation logic
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeactivateUserOpen(false);
        return true;
      } catch (error) {
        console.error('Error deactivating user:', error);
        return false;
      } finally {
        setActionLoading(false);
      }
    }
    return false;
  }, [selectedUser]);

  // Reset pagination when filters change
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    resetPagination();
  }, [roleFilter, searchQuery, resetPagination]);

  useEffect(() => {
    fetchUsers({
      currentPage,
      pageSize,
      roleFilter,
      searchQuery
    }).catch(err => console.error("Error fetching users:", err));
  }, [fetchUsers, currentPage, pageSize, roleFilter, searchQuery]);

  return {
    // State
    users,
    isLoading,
    loading,
    totalUsers,
    currentPage,
    pageSize,
    totalPages,
    selectedUser,
    roleFilter,
    searchQuery,
    actionLoading,
    newUserOpen,
    editUserOpen,
    resetPasswordOpen,
    deactivateUserOpen,
    resetPasswordEmail,
    
    // Actions
    setCurrentPage,
    setPageSize,
    setNewUserOpen,
    setEditUserOpen,
    setResetPasswordOpen,
    setDeactivateUserOpen,
    handleRoleChange,
    handleSearchChange,
    handleEditUser,
    handleResetPassword,
    handleDeactivateUser,
    executeDeactivateUser,
    fetchUsers
  };
}

export default useUserManagement;
