
import { useState, useCallback } from 'react';
import { EditUserData } from '@/components/SuperAdmin/User/utils/userDataConverter';

export function useUserDialogs() {
  const [selectedUser, setSelectedUser] = useState<EditUserData | null>(null);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [deactivateUserOpen, setDeactivateUserOpen] = useState(false);

  const openEditUserDialog = useCallback((user: EditUserData) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  }, []);

  const openResetPasswordDialog = useCallback((user: EditUserData) => {
    setSelectedUser(user);
    setResetPasswordOpen(true);
  }, []);

  const openDeactivateUserDialog = useCallback((user: EditUserData) => {
    setSelectedUser(user);
    setDeactivateUserOpen(true);
  }, []);

  return {
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
  };
}
