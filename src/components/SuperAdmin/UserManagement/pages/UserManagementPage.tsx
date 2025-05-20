
import React from 'react';
import { useUserManagement } from '../hooks/useUserManagement';
import UserFilters from '../UserFilters';
import UserTable from '../UserTable';
import UserDialogsSection from '../UserDialogsSection';

const UserManagementPage: React.FC = () => {
  const userManagement = useUserManagement();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <UserFilters 
        roleFilter={userManagement.roleFilter}
        searchQuery={userManagement.searchQuery}
        onRoleChange={userManagement.handleRoleChange}
        onSearchChange={userManagement.handleSearchChange}
      />
      
      <UserTable 
        users={userManagement.users}
        isLoading={userManagement.isLoading}
        onEdit={userManagement.handleEditUser}
        onDeactivateUser={userManagement.handleDeactivateUser}
        onResetPassword={userManagement.handleResetPassword}
        currentPage={userManagement.currentPage}
        totalPages={userManagement.totalPages}
        pageSize={userManagement.pageSize}
        totalUsers={userManagement.totalUsers}
        onPageChange={userManagement.setCurrentPage}
        onPageSizeChange={userManagement.setPageSize}
      />
      
      {/* Include dialogs section */}
      <UserDialogsSection 
        newUserOpen={userManagement.newUserOpen}
        editUserOpen={userManagement.editUserOpen}
        resetPasswordOpen={userManagement.resetPasswordOpen}
        deactivateUserOpen={userManagement.deactivateUserOpen}
        setNewUserOpen={userManagement.setNewUserOpen}
        setEditUserOpen={userManagement.setEditUserOpen}
        setResetPasswordOpen={userManagement.setResetPasswordOpen}
        setDeactivateUserOpen={userManagement.setDeactivateUserOpen}
        selectedUser={userManagement.selectedUser ? {
          id: userManagement.selectedUser.id,
          firstName: userManagement.selectedUser.first_name,
          lastName: userManagement.selectedUser.last_name,
          email: userManagement.selectedUser.email,
          role: userManagement.selectedUser.role as any,
        } : null}
        selectedEmail={userManagement.selectedUser?.email || ''}
        selectedUserId={userManagement.selectedUser?.id || ''}
        selectedUserName={`${userManagement.selectedUser?.first_name || ''} ${userManagement.selectedUser?.last_name || ''}`}
        onCreateUser={async (userData) => true} // Placeholder implementation
        onUpdateUser={async (userData) => true} // Placeholder implementation
        onResetPassword={async (email) => true} // Placeholder implementation
        onDeactivateUser={async (id) => true} // Placeholder implementation
        isLoading={userManagement.isLoading}
      />
    </div>
  );
};

export default UserManagementPage;
