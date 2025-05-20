
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserData, EditUserData } from '@/types/user';
import UserHeader from './components/UserHeader';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import AddUserDialog from './Dialogs/AddUserDialog';
import EditUserDialog from './Dialogs/EditUserDialog';
import DeactivateUserDialog from './Dialogs/DeactivateUserDialog';
import ResetPasswordDialog from './Dialogs/ResetPasswordDialog';
import { useToast } from '@/hooks/useToast';

const UserManagement = () => {
  // User state
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<EditUserData | null>(null);
  
  // Dialog states
  const [isNewUserOpen, setNewUserOpen] = useState(false);
  const [isEditUserOpen, setEditUserOpen] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Filters
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Use our toast hook
  const toast = useToast();

  // Mock fetchUsers (since we don't have real API yet)
  const fetchUsers = async () => {
    // This would be a real API call in a production app
    return [];
  };

  useEffect(() => {
    // Fetch users on component mount
    fetchUsers().then(response => {
      // Update state with response
    });
  }, [currentPage, pageSize, roleFilter, searchQuery]);

  // Handler functions for user actions
  const handleAddUser = async (userData: any): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock successful creation
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.toast({
        title: "User created",
        description: "The user has been created successfully.",
        variant: "default"
      });
      setNewUserOpen(false);
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      toast.toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (userData: any): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock successful update
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.toast({
        title: "User updated",
        description: "The user has been updated successfully.",
        variant: "default"
      });
      setEditUserOpen(false);
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const executeResetPassword = async (): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock successful password reset
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.toast({
        title: "Password reset",
        description: "A password reset email has been sent.",
        variant: "default"
      });
      setShowResetPasswordDialog(false);
      return true;
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const executeDeactivateUser = async (): Promise<boolean> => {
    setActionLoading(true);
    try {
      // Mock successful deactivation
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.toast({
        title: "User deactivated",
        description: "The user has been deactivated successfully.",
        variant: "default"
      });
      setShowDeactivateDialog(false);
      return true;
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.toast({
        title: "Error",
        description: "Failed to deactivate user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Handler functions for user selection
  const handleEditUser = (user: UserData) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleResetPassword = (user: UserData) => {
    setResetPasswordEmail(user.email);
    setShowResetPasswordDialog(true);
  };

  const handleDeactivateUser = (user: UserData) => {
    setSelectedUser(user);
    setShowDeactivateDialog(true);
  };

  return (
    <Card className="w-full">
      {/* Header with Add User button */}
      <UserHeader onAddUser={() => setNewUserOpen(true)} />

      <CardContent>
        {/* Filters section */}
        <UserFilters
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          handleRefresh={fetchUsers}
          isLoading={actionLoading}
        />

        {/* Users table */}
        <div className="mt-4">
          <UserTable
            users={users}
            isLoading={actionLoading}
            currentPage={currentPage}
            pageSize={pageSize}
            totalUsers={totalUsers}
            totalPages={Math.ceil(totalUsers / pageSize)}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            handleEditUser={handleEditUser}
            handleResetPassword={handleResetPassword}
            handleDeactivateUser={handleDeactivateUser}
          />
        </div>
      </CardContent>

      {/* Dialogs section */}
      <AddUserDialog 
        open={isNewUserOpen}
        onOpenChange={setNewUserOpen}
        onSubmit={handleAddUser}
        isLoading={actionLoading}
      />
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <EditUserDialog
          isOpen={isEditUserOpen}
          onClose={() => setEditUserOpen(false)}
          userData={selectedUser}
          onUpdateUser={handleUpdateUser}
          isLoading={actionLoading}
        />
      )}
      
      {/* Reset Password Dialog */}
      <ResetPasswordDialog
        isOpen={showResetPasswordDialog}
        onClose={() => setShowResetPasswordDialog(false)}
        userEmail={resetPasswordEmail}
        onConfirm={executeResetPassword}
        isLoading={actionLoading}
      />
      
      {/* Deactivate User Dialog */}
      {selectedUser && (
        <DeactivateUserDialog
          isOpen={showDeactivateDialog}
          onClose={() => setShowDeactivateDialog(false)}
          user={selectedUser}
          onConfirm={executeDeactivateUser}
          isLoading={actionLoading}
        />
      )}
    </Card>
  );
};

export default UserManagement;
