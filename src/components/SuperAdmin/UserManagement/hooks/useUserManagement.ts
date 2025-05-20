
import { useState, useCallback, useEffect } from 'react';
import { UserData, EditUserData } from '@/types/user';
import { UserRole } from '@/types/enums';
import { convertToEditUserData } from '@/utils/userTypeConverter';

interface FetchUsersParams {
  currentPage?: number;
  pageSize?: number;
  roleFilter?: string | null;
  searchQuery?: string;
  // For backwards compatibility
  page?: number;
  limit?: number;
  role?: string | null;
  searchTerm?: string;
}

export const useUserManagement = () => {
  // Users state
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // User action states
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editUserData, setEditUserData] = useState<EditUserData | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Dialog states
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [deactivateUserOpen, setDeactivateUserOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async (params?: FetchUsersParams) => {
    // Normalize parameters
    const page = params?.currentPage || params?.page || currentPage;
    const limit = params?.pageSize || params?.limit || pageSize;
    const role = params?.roleFilter || params?.role || roleFilter;
    const search = params?.searchQuery || params?.searchTerm || searchQuery;

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for demonstration
      const mockUsers: UserData[] = Array.from({ length: 25 }, (_, i) => ({
        id: `user-${i + 1}`,
        email: `user${i + 1}@example.com`,
        first_name: `First${i + 1}`,
        last_name: `Last${i + 1}`,
        role: i % 3 === 0 ? UserRole.ADMIN : i % 5 === 0 ? UserRole.SUPER_ADMIN : UserRole.USER,
        is_active: i % 7 !== 0,
        merchant_id: i % 4 === 0 ? `merchant-${i}` : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Filter by role if needed
      let filteredUsers = role ? mockUsers.filter(user => user.role === role) : mockUsers;
      
      // Filter by search if needed
      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.email.toLowerCase().includes(searchLower) ||
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower)
        );
      }
      
      // Calculate total and pagination
      const total = filteredUsers.length;
      const pageCount = Math.ceil(total / limit);
      
      // Get current page
      const startIdx = (page - 1) * limit;
      const paginatedUsers = filteredUsers.slice(startIdx, startIdx + limit);
      
      setUsers(paginatedUsers);
      setTotalUsers(total);
      setTotalPages(pageCount);
      setError(null);
      
      return { success: true, users: paginatedUsers, total };
    } catch (err) {
      setError('Failed to fetch users');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, roleFilter, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Create user function
  const createUser = async (userData: any): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchUsers();
      return true;
    } catch (err) {
      setError('Failed to create user');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userId: string, userData: any): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchUsers();
      return true;
    } catch (err) {
      setError('Failed to update user');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      setError('Failed to reset password');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Deactivate/delete user function
  const deleteUser = async (userId: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchUsers();
      return true;
    } catch (err) {
      setError('Failed to deactivate user');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Handler functions
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setEditUserData(convertToEditUserData(user));
    setEditUserOpen(true);
  };

  const handleResetPassword = (email: string) => {
    setResetPasswordEmail(email);
    setResetPasswordOpen(true);
  };

  const handleDeactivateUser = (user: UserData) => {
    setSelectedUser(user);
    setDeactivateUserOpen(true);
  };

  // Handler for role filter changes
  const handleRoleChange = (role: string | null) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  // Handler for search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    users,
    isLoading,
    loading: isLoading, // For backward compatibility
    error, 
    totalUsers,
    currentPage,
    pageSize,
    totalPages,
    roleFilter,
    searchQuery,
    selectedUser,
    editUserData,
    actionLoading,
    // Dialog states
    newUserOpen,
    editUserOpen, 
    resetPasswordOpen,
    resetPasswordEmail,
    deactivateUserOpen,
    // Pagination actions
    setCurrentPage,
    setPageSize,
    // Dialog actions
    setNewUserOpen,
    setEditUserOpen,
    setResetPasswordOpen,
    setResetPasswordEmail,
    setDeactivateUserOpen,
    // Filter actions
    handleRoleChange,
    handleSearchChange,
    setRoleFilter,
    setSearchQuery,
    // User actions
    handleEditUser,
    handleResetPassword,
    handleDeactivateUser,
    // API actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
  };
};
