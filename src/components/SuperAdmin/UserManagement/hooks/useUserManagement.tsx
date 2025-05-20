import { useState, useCallback, useEffect } from 'react';
import { useUserData } from './useUserData';
import { useUserFilters } from './useUserFilters';
import { usePagination } from './usePagination';
import { useUserDialogs } from './useUserDialogs';
import { useUserActions } from "@/components/SuperAdmin/UserManagement/hooks/useUserActions";
import { UserData, EditUserData } from '@/types/user';

export interface UseUserManagementProps {
  initialPage?: number;
  initialPageSize?: number;
}

export function useUserManagement({ 
  initialPage = 1, 
  initialPageSize = 10 
}: UseUserManagementProps = {}) {
  // Main states
  const { 
    users, 
    isLoading, 
    totalUsers, 
    fetchUsers 
  } = useUserData();

  // Additional states for backwards compatibility
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Import hooks
  const {
    roleFilter,
    searchQuery,
    handleRoleChange,
    handleSearchChange
  } = useUserFilters();

  const {
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
    setPageSize,
    resetPagination
  } = usePagination(initialPage, initialPageSize, totalUsers);

  const {
    selectedUser,
    setSelectedUser,
    newUserOpen,
    setNewUserOpen,
    editUserOpen,
    setEditUserOpen,
    resetPasswordOpen,
    setResetPasswordOpen,
    deactivateUserOpen,
    setDeactivateUserOpen,
    openEditUserDialog,
    openResetPasswordDialog,
    openDeactivateUserDialog
  } = useUserDialogs();

  // Sync loading state for backward compatibility
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Fetch users when filters or pagination changes
  const fetchUsersCallback = useCallback(() => {
    fetchUsers({
      currentPage,
      pageSize,
      roleFilter,
      searchQuery
    });
    // Return undefined instead of a boolean
    return Promise.resolve();
  }, [fetchUsers, currentPage, pageSize, roleFilter, searchQuery]);

  // Filter users for backward compatibility
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // User action handlers
  const handleEditUserAction = useCallback((user: UserData | EditUserData) => {
    const processedUser = openEditUserDialog(user as any);
    return processedUser;
  }, [openEditUserDialog]);

  const handleResetPasswordAction = useCallback((email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      return openResetPasswordDialog(user);
    }
    return null;
  }, [users, openResetPasswordDialog]);

  const handleDeactivateUserAction = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      return openDeactivateUserDialog(user);
    }
    return null;
  }, [users, openDeactivateUserDialog]);

  const executeDeactivateUserAction = useCallback(async () => {
    if (selectedUser) {
      setActionLoading(true);
      try {
        // Mock deactivation logic
        await new Promise(resolve => setTimeout(resolve, 500));
        setDeactivateUserOpen(false);
        return true;
      } catch (error) {
        setError("Failed to deactivate user");
        return false;
      } finally {
        setActionLoading(false);
      }
    }
    return false;
  }, [selectedUser, setDeactivateUserOpen]);

  // Helper functions for CRUD operations
  const createUser = async (userData: any): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      setError("Failed to create user");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateUser = async (userData: EditUserData): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      setError("Failed to update user");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deactivateUser = async (userId: string): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      setError("Failed to deactivate user");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [roleFilter, searchQuery, resetPagination]);

  return {
    // State
    users,
    filteredUsers: users, // Add missing property
    isLoading,
    loading: isLoading, // For backward compatibility
    totalUsers,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalUsers / pageSize), // Add missing property
    selectedUser,
    roleFilter,
    searchQuery,
    actionLoading,
    error,
    newUserOpen,
    editUserOpen,
    resetPasswordOpen,
    deactivateUserOpen,
    
    // Actions
    setCurrentPage,
    setPageSize,
    setNewUserOpen,
    setEditUserOpen,
    setResetPasswordOpen,
    setDeactivateUserOpen,
    handleRoleChange,
    handleSearchChange,
    handleEditUser: handleEditUserAction,
    handleResetPassword: handleResetPasswordAction,
    handleDeactivateUser: handleDeactivateUserAction,
    executeDeactivateUser: executeDeactivateUserAction,
    fetchUsers: fetchUsersCallback
  };
}
