import React from 'react';
import { EditUserData } from '@/types/user';
import NewUserDialog from './Dialogs/NewUserDialog';
import EditUserDialog from './Dialogs/EditUserDialog';
import ResetPasswordDialog from './Dialogs/ResetPasswordDialog';
import DeactivateUserDialog from './Dialogs/DeactivateUserDialog';

interface UserDialogsSectionProps {
  newUserOpen: boolean;
  editUserOpen: boolean;
  resetPasswordOpen: boolean;
  deactivateUserOpen: boolean;
  setNewUserOpen: (open: boolean) => void;
  setEditUserOpen: (open: boolean) => void;
  setResetPasswordOpen: (open: boolean) => void;
  setDeactivateUserOpen: (open: boolean) => void;
  selectedUser: EditUserData | null;
  selectedEmail: string;
  selectedUserId: string;
  selectedUserName: string;
  onCreateUser: (userData: any) => Promise<boolean>;
  onUpdateUser: (userData: EditUserData) => Promise<boolean>;
  onResetPassword: (email: string) => Promise<boolean>;
  onDeactivateUser: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

const UserDialogsSection: React.FC<UserDialogsSectionProps> = ({
  newUserOpen,
  editUserOpen,
  resetPasswordOpen,
  deactivateUserOpen,
  setNewUserOpen,
  setEditUserOpen,
  setResetPasswordOpen,
  setDeactivateUserOpen,
  selectedUser,
  selectedEmail,
  selectedUserId,
  selectedUserName,
  onCreateUser,
  onUpdateUser,
  onResetPassword,
  onDeactivateUser,
  isLoading
}) => {
  // Return boolean for all handlers to match expected types
  const handleUpdateUser = async (userData: EditUserData): Promise<boolean> => {
    try {
      await onUpdateUser(userData);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const handleResetPassword = async (): Promise<boolean> => {
    try {
      await onResetPassword(selectedEmail);
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  };

  const handleDeactivateUser = async (): Promise<boolean> => {
    try {
      await onDeactivateUser(selectedUserId);
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      return false;
    }
  };

  return (
    <>
      <NewUserDialog
        open={newUserOpen}
        onOpenChange={setNewUserOpen}
        onSubmit={onCreateUser}
        isLoading={isLoading}
      />

      {selectedUser && (
        <EditUserDialog
          isOpen={editUserOpen} 
          onClose={() => setEditUserOpen(false)}
          userData={selectedUser}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
      )}

      <ResetPasswordDialog
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        userEmail={selectedEmail}
        onConfirm={handleResetPassword}
        isLoading={isLoading}
      />

      <DeactivateUserDialog
        isOpen={deactivateUserOpen}
        onClose={() => setDeactivateUserOpen(false)}
        user={{
          id: selectedUserId,
          firstName: selectedUser?.firstName || '',
          lastName: selectedUser?.lastName || ''
        }}
        onDeactivate={handleDeactivateUser}
        isLoading={isLoading}
      />
    </>
  );
};

export default UserDialogsSection;
