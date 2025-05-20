
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserTable from '../UserTable';
import { UserData, UserRole } from '@/types';
import { createTestUserTableProps, createMockUsers } from './helpers/userTestHelpers';

const mockUsers: UserData[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    role: UserRole.ADMIN,
    is_active: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    role: UserRole.MERCHANT,
    is_active: false,
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z"
  }
];

describe('UserTable', () => {
  const mockProps = {
    users: mockUsers,
    totalUsers: 2,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    totalItems: 2,
    totalPages: 1,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
    handleEditUser: jest.fn(),
    handleResetPassword: jest.fn(),
    handleDeactivateUser: jest.fn()
  };

  it('renders user data correctly', () => {
    render(<UserTable {...createTestUserTableProps(mockProps)} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('MERCHANT')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<UserTable {...createTestUserTableProps({...mockProps, loading: true})} />);
    
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('shows empty state when no users', () => {
    render(<UserTable {...createTestUserTableProps({...mockProps, users: []})} />);
    
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('calls handleEditUser when edit action is clicked', () => {
    render(<UserTable {...createTestUserTableProps(mockProps)} />);
    
    // Find the first user's action button and click it
    const actionButtons = screen.getAllByText('Actions');
    fireEvent.click(actionButtons[0]);
    
    // Click the Edit option in dropdown
    fireEvent.click(screen.getByText('Edit'));
    
    expect(mockProps.handleEditUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls handleResetPassword when reset password action is clicked', () => {
    render(<UserTable {...createTestUserTableProps(mockProps)} />);
    
    // Find the first user's action button and click it
    const actionButtons = screen.getAllByText('Actions');
    fireEvent.click(actionButtons[0]);
    
    // Click the Reset Password option in dropdown
    fireEvent.click(screen.getByText('Reset Password'));
    
    expect(mockProps.handleResetPassword).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls handleDeactivateUser when deactivate action is clicked', () => {
    render(<UserTable {...createTestUserTableProps(mockProps)} />);
    
    // Find the first user's action button and click it
    const actionButtons = screen.getAllByText('Actions');
    fireEvent.click(actionButtons[0]);
    
    // Click the Deactivate option in dropdown
    fireEvent.click(screen.getByText('Deactivate'));
    
    expect(mockProps.handleDeactivateUser).toHaveBeenCalledWith(mockUsers[0]);
  });
});
