
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  useToast 
} from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { UserData, EditUserData, toEditUserData } from '@/types/user';
import { useUserManagement } from './hooks/useUserManagement';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import NewUserDialog from './Dialogs/NewUserDialog';
import EditUserDialog from './Dialogs/EditUserDialog';
import ResetPasswordDialog from './Dialogs/ResetPasswordDialog';
import DeactivateUserDialog from './Dialogs/DeactivateUserDialog';

const UserManagement: React.FC = () => {
  // Use the toast hook correctly
  const { toast } = useToast();
  
  // Use the user management hook
  const {
    users,
    isLoading,
    totalUsers,
    currentPage,
    pageSize,
    totalPages,
    setCurrentPage,
    setPageSize,
    roleFilter,
    searchQuery,
    handleRoleChange,
    handleSearchChange,
    newUserOpen,
    editUserOpen,
    resetPasswordOpen,
    deactivateUserOpen,
    setNewUserOpen,
    setEditUserOpen,
    setResetPasswordOpen,
    setDeactivateUserOpen,
    selectedUser,
    handleEditUser,
    handleResetPassword,
    handleDeactivateUser
  } = useUserManagement();

  // Handle user creation with toast notification
  const handleCreateUser = async (userData: any): Promise<boolean> => {
    try {
      // Mock creation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "User Created",
        description: `Successfully created user ${userData.firstName} ${userData.lastName}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle user update with toast notification
  const handleUpdateUser = async (userData: EditUserData): Promise<boolean> => {
    try {
      // Mock update for now
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "User Updated",
        description: `Successfully updated user ${userData.firstName} ${userData.lastName}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle password reset with toast notification
  const handleResetPasswordConfirm = async (email: string): Promise<boolean> => {
    try {
      // Mock reset password for now
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "Password Reset",
        description: `Password reset link sent to ${email}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle user deactivation with toast notification
  const handleDeactivateConfirm = async (userId: string): Promise<boolean> => {
    try {
      // Mock deactivation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({
        title: "User Deactivated",
        description: "User has been deactivated successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">User Management</h2>
        <Button
          onClick={() => setNewUserOpen(true)}
        >
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Fix UserFilters props */}
          <UserFilters
            roleFilter={roleFilter}
            searchQuery={searchQuery}
            onRoleChange={handleRoleChange}
            onSearchChange={handleSearchChange}
          />

          {/* Fix UserTable props */}
          <UserTable 
            users={users}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDeactivateUser={handleDeactivateUser}
            onResetPassword={handleResetPassword}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalUsers={totalUsers}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
          
          {/* Fix pagination component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Fix dialogs to use the correct prop formats */}
      <NewUserDialog
        open={newUserOpen}
        onOpenChange={setNewUserOpen}
        onSubmit={handleCreateUser}
        isLoading={isLoading}
      />

      {selectedUser && (
        <EditUserDialog
          isOpen={editUserOpen}
          onClose={() => setEditUserOpen(false)}
          userData={selectedUser ? toEditUserData(selectedUser) : {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            role: 'USER',
          }}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
      )}

      <ResetPasswordDialog
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        userEmail={selectedUser?.email || ''}
        onConfirm={() => handleResetPasswordConfirm(selectedUser?.email || '')}
        isLoading={isLoading}
      />

      <DeactivateUserDialog
        isOpen={deactivateUserOpen}
        onClose={() => setDeactivateUserOpen(false)}
        user={{
          id: selectedUser?.id || '',
          firstName: selectedUser?.first_name || '',
          lastName: selectedUser?.last_name || ''
        }}
        onDeactivate={() => handleDeactivateConfirm(selectedUser?.id || '')}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserManagement;
