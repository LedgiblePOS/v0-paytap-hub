
import React from 'react';
import { render, screen } from '@testing-library/react';
import UserManagement from '../Index';
import { useUserManagement } from '../hooks/useUserManagement';

// Mock the hooks
jest.mock('../hooks/useUserManagement', () => ({
  useUserManagement: jest.fn()
}));

// Mock the components
jest.mock('@/components/SuperAdmin/User/UserFilters', () => ({
  __esModule: true,
  default: () => <div data-testid="user-filters">UserFilters Component</div>
}));

jest.mock('@/components/SuperAdmin/User/UserTable', () => ({
  __esModule: true,
  default: () => <div data-testid="user-table">UserTable Component</div>
}));

jest.mock('@/components/SuperAdmin/User/UserFormDialogs', () => ({
  __esModule: true,
  default: () => <div data-testid="user-form-dialogs">UserFormDialogs Component</div>
}));

jest.mock('../components/UserHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="user-header">UserHeader Component</div>
}));

describe('UserManagement Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useUserManagement as jest.Mock).mockReturnValue({
      users: [],
      isLoading: false,
      totalUsers: 0,
      currentPage: 1,
      pageSize: 10,
      selectedUser: null,
      newUserOpen: false,
      editUserOpen: false,
      resetPasswordOpen: false,
      deactivateUserOpen: false,
      setNewUserOpen: jest.fn(),
      setCurrentPage: jest.fn(),
      setPageSize: jest.fn(),
      setEditUserOpen: jest.fn(),
      setResetPasswordOpen: jest.fn(),
      setDeactivateUserOpen: jest.fn(),
      handleRoleChange: jest.fn(),
      handleSearchChange: jest.fn(),
      handleEditUser: jest.fn(),
      handleResetPassword: jest.fn(),
      handleDeactivateUser: jest.fn(),
      executeDeactivateUser: jest.fn(),
      actionLoading: false,
      roleFilter: null,
      searchQuery: ''
    });
  });

  it('renders all components when not loading', () => {
    render(<UserManagement />);
    
    expect(screen.getByTestId('user-header')).toBeInTheDocument();
    expect(screen.getByTestId('user-filters')).toBeInTheDocument();
    expect(screen.getByTestId('user-table')).toBeInTheDocument();
    expect(screen.getByTestId('user-form-dialogs')).toBeInTheDocument();
  });

  it('renders loading spinner when isLoading is true', () => {
    (useUserManagement as jest.Mock).mockReturnValue({
      ...useUserManagement(),
      isLoading: true
    });
    
    render(<UserManagement />);
    
    expect(screen.getByTestId('user-header')).toBeInTheDocument();
    expect(screen.getByTestId('user-filters')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('renders user form dialogs with selectedUser when available', () => {
    const mockSelectedUser = {
      id: '1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      role: 'ADMIN',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
      is_active: true
    };
    
    (useUserManagement as jest.Mock).mockReturnValue({
      ...useUserManagement(),
      selectedUser: mockSelectedUser
    });
    
    render(<UserManagement />);
    
    expect(screen.getByTestId('user-form-dialogs')).toBeInTheDocument();
  });

  it('renders user form dialogs without selectedUser when not available', () => {
    (useUserManagement as jest.Mock).mockReturnValue({
      ...useUserManagement(),
      selectedUser: null
    });
    
    render(<UserManagement />);
    
    expect(screen.getByTestId('user-form-dialogs')).toBeInTheDocument();
  });
});
