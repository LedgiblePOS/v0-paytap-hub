
import React from 'react';
import { render, screen } from '@testing-library/react';
import UserFormDialogs from '../UserFormDialogs';

// Mock the dialog components
jest.mock('../Dialogs/CreateUserDialog', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (
    open ? <div data-testid="create-user-dialog">Create User Dialog</div> : null
  )
}));

jest.mock('../Dialogs/EditUserDialog', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (
    open ? <div data-testid="edit-user-dialog">Edit User Dialog</div> : null
  )
}));

jest.mock('../Dialogs/ResetPasswordDialog', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (
    open ? <div data-testid="reset-password-dialog">Reset Password Dialog</div> : null
  )
}));

jest.mock('../Dialogs/DeactivateUserDialog', () => ({
  __esModule: true,
  default: ({ open }: { open: boolean }) => (
    open ? <div data-testid="deactivate-user-dialog">Deactivate User Dialog</div> : null
  )
}));

describe('UserFormDialogs Component', () => {
  const mockProps = {
    newUserOpen: false,
    setNewUserOpen: jest.fn(),
    editUserOpen: false,
    setEditUserOpen: jest.fn(),
    editUserData: {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN',
      created_at: '2023-01-01T00:00:00Z'
    },
    showResetPasswordDialog: false,
    setShowResetPasswordDialog: jest.fn(),
    resetPasswordEmail: 'john@example.com',
    showDeactivateDialog: false,
    setShowDeactivateDialog: jest.fn(),
    handleDeactivateUser: jest.fn(),
    isLoading: false
  };

  it('renders no dialogs when all are closed', () => {
    render(<UserFormDialogs {...mockProps} />);
    
    expect(screen.queryByTestId('create-user-dialog')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-user-dialog')).not.toBeInTheDocument();
    expect(screen.queryByTestId('reset-password-dialog')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deactivate-user-dialog')).not.toBeInTheDocument();
  });

  it('renders create user dialog when newUserOpen is true', () => {
    render(<UserFormDialogs {...mockProps} newUserOpen={true} />);
    
    expect(screen.getByTestId('create-user-dialog')).toBeInTheDocument();
  });

  it('renders edit user dialog when editUserOpen is true', () => {
    render(<UserFormDialogs {...mockProps} editUserOpen={true} />);
    
    expect(screen.getByTestId('edit-user-dialog')).toBeInTheDocument();
  });

  it('renders reset password dialog when showResetPasswordDialog is true', () => {
    render(<UserFormDialogs {...mockProps} showResetPasswordDialog={true} />);
    
    expect(screen.getByTestId('reset-password-dialog')).toBeInTheDocument();
  });

  it('renders deactivate user dialog when showDeactivateDialog is true', () => {
    render(<UserFormDialogs {...mockProps} showDeactivateDialog={true} />);
    
    expect(screen.getByTestId('deactivate-user-dialog')).toBeInTheDocument();
  });
});
