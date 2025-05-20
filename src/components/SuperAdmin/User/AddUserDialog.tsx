
import React from 'react';
import { CreateUserDialogProps } from '@/types/user';
import CreateUserDialog from '../UserManagement/Dialogs/CreateUserDialog';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (userData: any) => Promise<boolean>;
  isLoading?: boolean;
}

const AddUserDialog: React.FC<AddUserDialogProps> = (props) => {
  // Convert props to match CreateUserDialogProps
  const dialogProps: CreateUserDialogProps = {
    open: props.open,
    onOpenChange: props.onOpenChange,
    onSubmit: props.onAddUser,
    isLoading: props.isLoading,
    title: "Add New User",
    description: "Enter user information to create a new account."
  };

  return <CreateUserDialog {...dialogProps} />;
};

export default AddUserDialog;
