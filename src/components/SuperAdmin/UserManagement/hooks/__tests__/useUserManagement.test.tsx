
import { renderHook, act } from '@testing-library/react';
import { useUserManagement } from '../useUserManagement';
import { UserData } from '@/types/user';

// Mock dependencies
jest.mock('../useUserData', () => ({
  useUserData: jest.fn(() => ({
    users: mockUsers,
    isLoading: false,
    totalUsers: 10,
    fetchUsers: jest.fn()
  }))
}));

jest.mock('../useUserFilters', () => ({
  useUserFilters: jest.fn(() => ({
    roleFilter: '',
    searchQuery: '',
    handleRoleChange: jest.fn(),
    handleSearchChange: jest.fn()
  }))
}));

jest.mock('../usePagination', () => ({
  usePagination: jest.fn(() => ({
    currentPage: 1,
    pageSize: 10,
    setCurrentPage: jest.fn(),
    setPageSize: jest.fn(),
    resetPagination: jest.fn()
  }))
}));

jest.mock('../useUserDialogs', () => ({
  useUserDialogs: jest.fn(() => ({
    selectedUser: null,
    setSelectedUser: jest.fn(),
    newUserOpen: false,
    setNewUserOpen: jest.fn(),
    editUserOpen: false,
    setEditUserOpen: jest.fn(),
    resetPasswordOpen: false,
    setResetPasswordOpen: jest.fn(),
    deactivateUserOpen: false,
    setDeactivateUserOpen: jest.fn(),
    openEditUserDialog: jest.fn(),
    openResetPasswordDialog: jest.fn(),
    openDeactivateUserDialog: jest.fn()
  }))
}));

jest.mock('@/components/SuperAdmin/UserManagement/hooks/useUserActions', () => ({
  useUserActions: jest.fn(() => ({
    actionLoading: false,
    executeDeactivateUser: jest.fn(),
    handleEditUser: jest.fn(),
    handleResetPassword: jest.fn(),
    handleDeactivateUser: jest.fn()
  }))
}));

// Mock data
const mockUsers: UserData[] = [
  {
    id: '1',
    email: 'user1@example.com',
    first_name: 'User',
    last_name: 'One',
    role: 'ADMIN',
    is_active: true,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: '2',
    email: 'user2@example.com',
    first_name: 'User',
    last_name: 'Two',
    role: 'MERCHANT',
    is_active: true,
    created_at: '2023-01-02',
    updated_at: '2023-01-02'
  }
];

describe('useUserManagement', () => {
  it('should return proper values and methods', () => {
    const { result } = renderHook(() => useUserManagement());

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.totalUsers).toBe(10);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.roleFilter).toBe('');
    expect(result.current.searchQuery).toBe('');
    
    // Check if functions are defined
    expect(typeof result.current.setCurrentPage).toBe('function');
    expect(typeof result.current.setPageSize).toBe('function');
    expect(typeof result.current.handleRoleChange).toBe('function');
    expect(typeof result.current.handleSearchChange).toBe('function');
    expect(typeof result.current.handleEditUser).toBe('function');
    expect(typeof result.current.handleResetPassword).toBe('function');
    expect(typeof result.current.handleDeactivateUser).toBe('function');
  });

  it('should handle edit user action', () => {
    const { result } = renderHook(() => useUserManagement());
    
    act(() => {
      // Fix: passing UserData object instead of string
      result.current.handleEditUser(mockUsers[0]);
    });
    
    // Add assertions as needed
  });

  it('should handle reset password action', () => {
    const { result } = renderHook(() => useUserManagement());
    
    act(() => {
      result.current.handleResetPassword('user1@example.com');
    });
    
    // Add assertions as needed
  });

  it('should handle deactivate user action', () => {
    const { result } = renderHook(() => useUserManagement());
    
    act(() => {
      // Fix: using the user ID (string)
      result.current.handleDeactivateUser('1');
    });
    
    // Add assertions as needed
  });
});
