
import { renderHook, act } from '@testing-library/react';
import { useUserManagement } from '../useUserManagement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/enums';

// Mock dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
  }
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn()
  })
}));

describe('useUserManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserManagement());
    
    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.totalUsers).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.selectedUser).toBe(null);
    expect(result.current.roleFilter).toBe(null);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.actionLoading).toBe(false);
    expect(result.current.newUserOpen).toBe(false);
    expect(result.current.editUserOpen).toBe(false);
    expect(result.current.resetPasswordOpen).toBe(false);
    expect(result.current.deactivateUserOpen).toBe(false);
  });

  it('should handle role filter changes', () => {
    const { result } = renderHook(() => useUserManagement());
    
    act(() => {
      result.current.handleRoleChange(UserRole.ADMIN);
    });
    
    expect(result.current.roleFilter).toBe(UserRole.ADMIN);
    expect(result.current.currentPage).toBe(1); // Should reset to page 1
  });

  it('should handle search query changes', () => {
    const { result } = renderHook(() => useUserManagement());
    
    act(() => {
      result.current.handleSearchChange('John');
    });
    
    expect(result.current.searchQuery).toBe('John');
    expect(result.current.currentPage).toBe(1); // Should reset to page 1
  });

  it('should handle edit user selection', () => {
    const { result } = renderHook(() => useUserManagement());
    const mockUser = { 
      id: '123', 
      first_name: 'John', 
      last_name: 'Doe',
      role: UserRole.ADMIN,
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      email: 'john@example.com',
      is_active: true
    };
    
    act(() => {
      result.current.handleEditUser(mockUser);
    });
    
    expect(result.current.selectedUser).toEqual(mockUser);
    expect(result.current.editUserOpen).toBe(true);
  });

  it('should handle reset password selection', () => {
    const { result } = renderHook(() => useUserManagement());
    const mockEmail = 'john.doe@example.com';
    const mockUser = { 
      id: '123', 
      first_name: 'John', 
      last_name: 'Doe',
      email: mockEmail,
      role: UserRole.ADMIN,
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      is_active: true
    };
    
    // First add the user to the users array
    act(() => {
      // @ts-ignore - this is just for the test
      result.current.users = [mockUser];
    });
    
    act(() => {
      result.current.handleResetPassword(mockEmail);
    });
    
    expect(result.current.selectedUser).toEqual(mockUser);
    expect(result.current.resetPasswordOpen).toBe(true);
  });

  it('should handle deactivate user selection', () => {
    const { result } = renderHook(() => useUserManagement());
    const mockUser = { 
      id: '123', 
      first_name: 'John', 
      last_name: 'Doe',
      role: UserRole.ADMIN,
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      email: 'john@example.com',
      is_active: true
    };
    
    // First add the user to the users array
    act(() => {
      // @ts-ignore - this is just for the test
      result.current.users = [mockUser];
    });
    
    act(() => {
      result.current.handleDeactivateUser(mockUser.id);
    });
    
    expect(result.current.selectedUser).toEqual(mockUser);
    expect(result.current.deactivateUserOpen).toBe(true);
  });

  it('should execute deactivate user action', async () => {
    const { result } = renderHook(() => useUserManagement());
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    const mockUser = { 
      id: '123', 
      first_name: 'John', 
      last_name: 'Doe',
      role: UserRole.ADMIN,
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      email: 'john@example.com',
      is_active: true
    };
    
    // Set the selected user
    act(() => {
      // @ts-ignore - this is just for the test
      result.current.selectedUser = mockUser;
    });
    
    await act(async () => {
      await result.current.executeDeactivateUser();
    });
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'User Deactivated',
      description: `${mockUser.first_name} ${mockUser.last_name} has been deactivated.`,
    });
    expect(result.current.deactivateUserOpen).toBe(false);
  });
});
