
import { useEffect, useCallback } from "react";
import { useUserData } from "./useUserData";
import { useUserFilters } from "./useUserFilters";
import { usePagination } from "./usePagination";
import { useUserDialogs } from "./useUserDialogs";
import { useUserActions } from "@/components/SuperAdmin/UserManagement/hooks/useUserActions";
import { UserData, EditUserData } from "@/types/user";

export function useUserManagement() {
  const { 
    users, 
    isLoading, 
    totalUsers, 
    fetchUsers 
  } = useUserData();

  const {
    roleFilter,
    searchQuery,
    handleRoleChange,
    handleSearchChange
  } = useUserFilters();

  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    resetPagination
  } = usePagination();

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

  const fetchUsersCallback = useCallback(() => {
    return fetchUsers({
      currentPage,
      pageSize,
      roleFilter,
      searchQuery
    });
  }, [fetchUsers, currentPage, pageSize, roleFilter, searchQuery]);

  const {
    actionLoading,
    executeDeactivateUser,
    handleEditUser,
    handleResetPassword,
    handleDeactivateUser
  } = useUserActions(fetchUsersCallback);

  // Fetch users when filters or pagination changes
  useEffect(() => {
    fetchUsersCallback();
  }, [fetchUsersCallback]);

  // User action handlers that integrate the dialog and action hooks
  const handleEditUserAction = useCallback((user: UserData) => {
    const processedUser = handleEditUser(user);
    openEditUserDialog(processedUser);
    return processedUser;
  }, [handleEditUser, openEditUserDialog]);

  const handleResetPasswordAction = useCallback((email: string) => {
    const user = handleResetPassword(email, users);
    if (user) {
      openResetPasswordDialog(user);
    }
    return user;
  }, [handleResetPassword, users, openResetPasswordDialog]);

  const handleDeactivateUserAction = useCallback((userId: string) => {
    const user = handleDeactivateUser(userId, users);
    if (user) {
      openDeactivateUserDialog(user);
    }
    return user;
  }, [handleDeactivateUser, users, openDeactivateUserDialog]);

  const executeDeactivateUserAction = useCallback(() => {
    if (selectedUser) {
      executeDeactivateUser(selectedUser).then(() => {
        setDeactivateUserOpen(false);
      });
    }
  }, [selectedUser, executeDeactivateUser, setDeactivateUserOpen]);

  // Side effect to reset pagination when filters change
  useEffect(() => {
    resetPagination();
  }, [roleFilter, searchQuery, resetPagination]);

  return {
    // State
    users,
    isLoading,
    loading: isLoading, // For backward compatibility
    totalUsers,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalUsers / pageSize),
    selectedUser,
    roleFilter,
    searchQuery,
    actionLoading,
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
